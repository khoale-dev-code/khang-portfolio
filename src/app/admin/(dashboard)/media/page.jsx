import AdminPageHeader from '../../../../components/admin/AdminPageHeader'
import ImageManagerWorkspace from '../../../../components/admin/ImageManagerWorkspace'
import { defaultSiteContent } from '../../../../data/default-site-content'
import { localMediaAssets } from '../../../../data/local-media-assets'
import {
  getAdminSection,
  getMediaAssets,
} from '../../../../lib/content'

export const dynamic = 'force-dynamic'

function deepMerge(base, override) {
  if (override === undefined || override === null) {
    return structuredClone(base)
  }

  if (Array.isArray(base)) {
    return Array.isArray(override)
      ? structuredClone(override)
      : structuredClone(base)
  }

  if (
    base &&
    typeof base === 'object' &&
    !Array.isArray(base)
  ) {
    const result = structuredClone(base)

    if (
      override &&
      typeof override === 'object' &&
      !Array.isArray(override)
    ) {
      for (const [key, value] of Object.entries(override)) {
        result[key] =
          key in result
            ? deepMerge(result[key], value)
            : structuredClone(value)
      }
    }

    return result
  }

  return structuredClone(override)
}

export default async function MediaPage() {
  const [site, work, projects, campaignOps, cloudAssets] = await Promise.all([
    getAdminSection('site'),
    getAdminSection('work'),
    getAdminSection('projects'),
    getAdminSection('campaignOps'),
    getMediaAssets(),
  ])

  const initialSections = {
    site: deepMerge(defaultSiteContent.site, site?.content),
    work: deepMerge(defaultSiteContent.work, work?.content),
    projects: deepMerge(defaultSiteContent.projects, projects?.content),
    campaignOps: deepMerge(defaultSiteContent.campaignOps, campaignOps?.content),
  }

  return (
    <div className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        eyebrow="Hình ảnh"
        title="Quản lý hình ảnh"
        description="Xem ảnh đang dùng, kéo thả để đổi thứ tự hiển thị, thay ảnh và quản lý thư viện Public + Cloudinary."
      />

      <ImageManagerWorkspace
        initialSections={initialSections}
        cloudAssets={cloudAssets}
        localAssets={localMediaAssets}
      />
    </div>
  )
}
