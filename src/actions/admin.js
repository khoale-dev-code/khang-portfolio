'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { defaultSiteContent, SECTION_DEFINITIONS } from '../data/default-site-content'
import { requireAdmin } from '../lib/auth'
import { createClient } from '../lib/supabase/server'

const allowedKeys = new Set(SECTION_DEFINITIONS.map(([key]) => key))

function getAdminLoginEmail() {
  const email = process.env.ADMIN_LOGIN_EMAIL?.trim()

  if (!email) {
    throw new Error(
      'ADMIN_LOGIN_EMAIL is not configured. Add it to .env.local and Vercel Environment Variables.',
    )
  }

  return email
}

export async function loginWithPasswordAction(password) {
  const adminPassword = String(password ?? '')

  if (!adminPassword) {
    return {
      ok: false,
      message: 'Please enter your password.',
    }
  }

  const email = getAdminLoginEmail()
  const supabase = await createClient()

  const {
    data,
    error: authError,
  } = await supabase.auth.signInWithPassword({
    email,
    password: adminPassword,
  })

  if (authError || !data?.user?.id) {
    return {
      ok: false,
      message: 'Incorrect password.',
    }
  }

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()

  if (adminError || !admin) {
    await supabase.auth.signOut()

    return {
      ok: false,
      message: 'This account is not authorized to access the CMS.',
    }
  }

  return {
    ok: true,
  }
}

export async function changeAdminPasswordAction(
  currentPassword,
  newPassword,
  confirmPassword,
) {
  const current = String(currentPassword ?? '')
  const next = String(newPassword ?? '')
  const confirm = String(confirmPassword ?? '')

  if (!current || !next || !confirm) {
    return {
      ok: false,
      message: 'Please complete all password fields.',
    }
  }

  if (next.length < 10) {
    return {
      ok: false,
      message: 'New password must contain at least 10 characters.',
    }
  }

  if (next !== confirm) {
    return {
      ok: false,
      message: 'New password and confirmation do not match.',
    }
  }

  if (current === next) {
    return {
      ok: false,
      message: 'New password must be different from the current password.',
    }
  }

  const { supabase, userId } = await requireAdmin()
  const email = getAdminLoginEmail()

  const {
    data: verification,
    error: verificationError,
  } = await supabase.auth.signInWithPassword({
    email,
    password: current,
  })

  if (
    verificationError ||
    !verification?.user ||
    verification.user.id !== userId
  ) {
    return {
      ok: false,
      message: 'Current password is incorrect.',
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: next,
  })

  if (updateError) {
    return {
      ok: false,
      message: updateError.message,
    }
  }

  try {
    await supabase.auth.signOut({
      scope: 'others',
    })
  } catch {
    // Current authenticated session remains usable.
  }

  return {
    ok: true,
    message: 'Password updated successfully.',
  }
}

function isMissingSchemaColumn(error, column) {
  const message = String(error?.message || '').toLowerCase()
  const details = String(error?.details || '').toLowerCase()
  const hint = String(error?.hint || '').toLowerCase()
  const combined = `${message} ${details} ${hint}`

  return (
    combined.includes(String(column).toLowerCase()) &&
    (
      combined.includes('schema cache') ||
      combined.includes('column') ||
      combined.includes('could not find')
    )
  )
}

async function upsertSiteSectionsCompat(supabase, rows) {
  const sourceRows = Array.isArray(rows) ? rows : [rows]
  let payload = sourceRows.map((row) => ({ ...row }))
  const removableColumns = ['updated_by', 'updated_at']
  const removedColumns = []

  for (let attempt = 0; attempt <= removableColumns.length; attempt += 1) {
    const result = await supabase
      .from('site_sections')
      .upsert(payload, {
        onConflict: 'key',
      })

    if (!result.error) {
      return {
        error: null,
        removedColumns,
      }
    }

    const missingColumn = removableColumns.find(
      (column) =>
        !removedColumns.includes(column) &&
        isMissingSchemaColumn(result.error, column),
    )

    if (!missingColumn) {
      return {
        error: result.error,
        removedColumns,
      }
    }

    removedColumns.push(missingColumn)

    payload = payload.map((row) => {
      const next = { ...row }
      delete next[missingColumn]
      return next
    })
  }

  return {
    error: new Error('Unable to save site section.'),
    removedColumns,
  }
}
export async function saveSectionAction(key, content, isVisible = true) {
  if (!allowedKeys.has(key)) {
    return {
      ok: false,
      message: 'Unknown section.',
    }
  }

  const { supabase, userId } = await requireAdmin()

  const metaIndex = SECTION_DEFINITIONS.findIndex(
    ([sectionKey]) => sectionKey === key,
  )

  const label = SECTION_DEFINITIONS[metaIndex]?.[1] || key

  const row = {
    key,
    label,
    content,
    is_visible: Boolean(isVisible),
    sort_order: metaIndex + 1,
    updated_by: userId,
    updated_at: new Date().toISOString(),
  }

  const { error, removedColumns } =
    await upsertSiteSectionsCompat(supabase, row)

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin', 'layout')
  revalidatePath('/admin/sections', 'page')
  revalidatePath(`/admin/sections/${key}`, 'page')

  return {
    ok: true,
    message: removedColumns.length
      ? 'Saved. Database schema compatibility mode is active.'
      : 'Saved successfully.',
  }
}

export async function seedDefaultsAction() {
  const { supabase, userId } = await requireAdmin()

  const rows = SECTION_DEFINITIONS.map(
    ([key, label], index) => ({
      key,
      label,
      content: defaultSiteContent[key],
      is_visible: true,
      sort_order: index + 1,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }),
  )

  const { error, removedColumns } =
    await upsertSiteSectionsCompat(supabase, rows)

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin', 'layout')
  revalidatePath('/admin/sections', 'page')

  return {
    ok: true,
    message: removedColumns.length
      ? 'Default content saved in database compatibility mode.'
      : 'Default portfolio content has been initialized.',
  }
}

export async function logoutAction() {
  const { supabase } = await requireAdmin()

  await supabase.auth.signOut()

  redirect('/admin/login')
}