import Link from 'next/link'
import AdminIcon from '../../../components/admin/AdminIcon'
import AdminPageHeader from '../../../components/admin/AdminPageHeader'
import SeedButton from '../../../components/admin/SeedButton'
import { getAdminSections, getMediaAssets } from '../../../lib/content'

export default async function AdminDashboardPage() {
  const [sections, media] = await Promise.all([
    getAdminSections(),
    getMediaAssets(),
  ])

  const published = sections.filter((item) => item.is_visible).length
  const hidden = sections.filter((item) => item.is_visible === false).length
  const needsSetup = sections.length === 0

  const stats = [
    {
      label: 'Sections',
      value: sections.length,
      note: 'Khối nội dung có thể chỉnh sửa',
      icon: 'content',
    },
    {
      label: 'Đang hiển thị',
      value: published,
      note: 'Đang xuất hiện trên website',
      icon: 'eye',
    },
    {
      label: 'Đang ẩn',
      value: hidden,
      note: 'Không hiển thị ngoài website',
      icon: 'security',
    },
    {
      label: 'Media',
      value: media.length,
      note: 'Tệp đã lưu trong thư viện',
      icon: 'media',
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        eyebrow="Tổng quan"
        title="Quản lý portfolio"
        description="Chỉnh nội dung, hình ảnh và trạng thái hiển thị mà không cần sửa code."
        actions={
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Xem website
            <AdminIcon name="external" className="h-4 w-4" />
          </a>
        }
      />

      {needsSetup && (
        <section className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:p-5">
          <strong className="block text-sm text-sky-900">
            CMS chưa có dữ liệu trong Supabase
          </strong>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-sky-700">
            Khởi tạo dữ liệu mặc định một lần để bắt đầu chỉnh sửa từ Admin.
          </p>
          <div className="mt-4">
            <SeedButton />
          </div>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold text-slate-400">{item.label}</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-400">
                <AdminIcon name={item.icon} className="h-4 w-4" />
              </div>
            </div>
            <strong className="mt-4 block text-3xl font-bold tracking-[-.05em] text-slate-950 sm:text-4xl">
              {String(item.value).padStart(2, '0')}
            </strong>
            <p className="mt-2 hidden text-xs leading-5 text-slate-400 sm:block">
              {item.note}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          {
            href: '/admin/sections',
            icon: 'content',
            title: 'Sửa nội dung',
            note: 'Hero, Experience, Projects, Skills...',
          },
          {
            href: '/admin/media',
            icon: 'media',
            title: 'Quản lý hình ảnh',
            note: 'Upload, preview và sao chép URL.',
          },
          {
            href: '/admin/security',
            icon: 'security',
            title: 'Bảo mật',
            note: 'Đổi mật khẩu quản trị.',
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[106px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,.03)] transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white">
              <AdminIcon name={item.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold">{item.title}</strong>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                {item.note}
              </p>
            </div>
            <AdminIcon
              name="chevron"
              className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
            />
          </Link>
        ))}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
                Nội dung
              </span>
              <h2 className="mt-1 text-lg font-bold tracking-[-.025em]">
                Sections gần đây
              </h2>
            </div>
            <Link
              href="/admin/sections"
              className="inline-flex min-h-10 items-center gap-1 rounded-xl px-3 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            >
              Xem tất cả
              <AdminIcon name="chevron" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 px-4 sm:px-5">
            {sections.slice(0, 6).map((item) => (
              <Link
                key={item.key}
                href={`/admin/sections/${item.key}`}
                className="group flex min-h-[72px] items-center gap-3 py-3"
              >
                <div
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    item.is_visible ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-bold">
                    {item.label}
                  </strong>
                  <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                    {item.key}
                  </span>
                </div>
                <span className="hidden text-[10px] font-bold text-slate-400 sm:block">
                  {item.is_visible ? 'Đang hiển thị' : 'Đang ẩn'}
                </span>
                <AdminIcon
                  name="chevron"
                  className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1"
                />
              </Link>
            ))}

            {!sections.length && (
              <div className="py-10 text-center text-sm text-slate-400">
                Chưa có dữ liệu section.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-[#111821] p-5 text-white shadow-sm sm:p-6">
          <span className="text-[10px] font-bold uppercase tracking-[.16em] text-white/35">
            Quy trình gợi ý
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.04em]">
            Sửa → Lưu → Kiểm tra.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Mỗi section có nút lưu riêng và cảnh báo khi còn thay đổi chưa lưu.
          </p>

          <div className="mt-6 space-y-2">
            {[
              ['01', 'Chọn section cần chỉnh'],
              ['02', 'Sửa text, danh sách hoặc hình ảnh'],
              ['03', 'Bấm Lưu section'],
              ['04', 'Mở website để kiểm tra'],
            ].map(([number, label]) => (
              <div
                key={number}
                className="flex min-h-12 items-center gap-3 rounded-xl bg-white/[.05] px-3.5 text-sm text-white/70"
              >
                <span className="text-[10px] font-bold text-white/30">{number}</span>
                {label}
              </div>
            ))}
          </div>
        </section>
      </div>

      {!needsSetup && (
        <details className="mt-5 rounded-2xl border border-slate-200 bg-white">
          <summary className="cursor-pointer list-none px-4 py-4 text-sm font-bold text-slate-600 sm:px-5">
            Bảo trì / khôi phục dữ liệu mặc định
          </summary>
          <div className="border-t border-slate-100 p-4 sm:p-5">
            <p className="mb-4 max-w-2xl text-sm leading-6 text-slate-500">
              Chỉ dùng khi bạn thật sự muốn ghi lại dữ liệu mặc định. Thao tác này có thể ghi đè nội dung đã chỉnh.
            </p>
            <SeedButton compact danger />
          </div>
        </details>
      )}
    </div>
  )
}
