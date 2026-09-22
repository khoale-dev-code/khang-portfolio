import { notFound } from 'next/navigation'
import AdminPageHeader from '../../../../../components/admin/AdminPageHeader'
import SectionEditor from '../../../../../components/admin/SectionEditor'
import {
  defaultSiteContent,
  SECTION_DEFINITIONS,
} from '../../../../../data/default-site-content'
import { getAdminSection } from '../../../../../lib/content'
import { deepMerge } from '../../../../../lib/cms'

export default async function SectionPage({ params }) {
  const { key } = await params
  const definition = SECTION_DEFINITIONS.find(([sectionKey]) => sectionKey === key)

  if (!definition) notFound()

  const row = await getAdminSection(key)
  const content = deepMerge(defaultSiteContent[key], row?.content || {})

  return (
    <div className="mx-auto max-w-[1180px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        eyebrow="Chỉnh sửa section"
        title={definition[1]}
        description="Các thay đổi chỉ được ghi vào Supabase khi bạn bấm Lưu. Giao diện và animation public không bị thay đổi."
        backHref="/admin/sections"
        backLabel="Tất cả nội dung"
      />

      <SectionEditor
        sectionKey={key}
        initialContent={content}
        initialVisible={row?.is_visible ?? true}
        templateContent={defaultSiteContent[key]}
      />
    </div>
  )
}
