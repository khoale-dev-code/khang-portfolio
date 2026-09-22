import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub

  if (claimsError || !userId) redirect('/admin/login')

  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('user_id,display_name')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !admin) redirect('/admin/login?error=not-authorized')
  return { ...admin, userId, supabase }
}
