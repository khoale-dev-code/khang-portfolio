import 'server-only'
import { createClient } from './supabase/server'
import { mergeSiteContent } from './cms'

export async function getPublicSiteContent() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_site_sections')

    if (error) throw error
    if (!data?.length) return mergeSiteContent()

    const content = {}
    const visibility = {}

    data.forEach((row) => {
      visibility[row.key] = row.is_visible
      if (row.is_visible && row.content) content[row.key] = row.content
    })

    return mergeSiteContent(content, visibility)
  } catch (error) {
    console.warn('[cms] Falling back to bundled content:', error?.message || error)
    return mergeSiteContent()
  }
}

export async function getAdminSections() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_sections')
    .select('key,label,content,is_visible,sort_order,updated_at')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAdminSection(key) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_sections')
    .select('key,label,content,is_visible,sort_order,updated_at')
    .eq('key', key)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getMediaAssets() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
