import AdminPageHeader from '../../../../components/admin/AdminPageHeader'
import SeedButton from '../../../../components/admin/SeedButton'
import SectionsBrowser from '../../../../components/admin/SectionsBrowser'
import { SECTION_DEFINITIONS } from '../../../../data/default-site-content'
import { getAdminSections } from '../../../../lib/content'

export default async function SectionsPage() {
  const rows = await getAdminSections()

  return (
    <div className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        eyebrow="CMS"
        title="Nội dung website"
        description="Chọn một section để chỉnh. Bạn có thể tìm kiếm, ẩn/hiện và chỉnh dữ liệu mà không cần đụng vào JSX."
      />

      {!rows.length && (
        <div className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:p-5">
          <strong className="block text-sm text-sky-900">Chưa có dữ liệu CMS</strong>
          <p className="mt-1 text-sm text-sky-700">
            Khởi tạo nội dung mặc định để bắt đầu.
          </p>
          <div className="mt-4">
            <SeedButton />
          </div>
        </div>
      )}

      <SectionsBrowser definitions={SECTION_DEFINITIONS} rows={rows} />
    </div>
  )
}
