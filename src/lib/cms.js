import { defaultSiteContent } from '../data/default-site-content'

export function deepMerge(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base
  if (!base || typeof base !== 'object') return override === undefined ? base : override

  const result = { ...base }
  if (!override || typeof override !== 'object' || Array.isArray(override)) return result

  Object.entries(override).forEach(([key, value]) => {
    if (value === undefined) return
    if (
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      result[key] = deepMerge(result[key], value)
    } else {
      result[key] = value
    }
  })

  return result
}

export function mergeSiteContent(databaseContent = {}, visibility = {}) {
  const merged = deepMerge(defaultSiteContent, databaseContent)
  return { ...merged, __visibility: visibility }
}

export function isSectionVisible(content, key) {
  return content?.__visibility?.[key] !== false
}

export function projectByKey(content, key) {
  return content?.projects?.items?.find((item) => item.key === key)
}

export function projectBySlug(content, slug) {
  return content?.projects?.items?.find((item) => item.slug === slug)
}

export function splitLines(value = '') {
  return String(value).split('\n')
}
