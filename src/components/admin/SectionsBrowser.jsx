'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import AdminIcon from './AdminIcon'

const descriptions = {
  site: 'Thông tin chung, email, số điện thoại, CV và ảnh đại diện.',
  navigation: 'Các mục menu và nút CTA trên website.',
  hero: 'Phần mở đầu, tiêu đề, CTA, số liệu nổi bật và nội dung chính.',
  ticker: 'Danh sách từ khóa chạy ngang.',
  about: 'Giới thiệu cá nhân, mô tả và điểm nổi bật.',
  impact: 'Các chỉ số và thành tích nổi bật.',
  work: 'Khối Selected Work và các thẻ dự án.',
  projects: 'Chi tiết case study, gallery, metrics và nội dung dự án.',
  campaignOps: 'Quy trình campaign, số liệu và carousel Vexere.',
  experience: 'Kinh nghiệm làm việc, vai trò và trách nhiệm.',
  skills: 'Kỹ năng, công cụ, học vấn và chứng chỉ.',
  contact: 'Nội dung liên hệ và CTA cuối trang.',
  caseStudy: 'Nhãn và nội dung dùng chung cho trang case study.',
}

export default function SectionsBrowser({ definitions, rows }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const rowMap = useMemo(
    () => new Map(rows.map((row) => [row.key, row])),
    [rows],
  )

  const items = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return definitions
      .map(([key, label], index) => {
        const row = rowMap.get(key)
        const visible = row?.is_visible !== false
        return {
          key,
          label,
          index,
          row,
          visible,
          description: descriptions[key] || 'Nội dung có thể chỉnh sửa từ CMS.',
        }
      })
      .filter((item) => {
        if (filter === 'published' && !item.visible) return false
        if (filter === 'hidden' && item.visible) return false
        if (!normalized) return true
        return (
          item.label.toLowerCase().includes(normalized) ||
          item.key.toLowerCase().includes(normalized) ||
          item.description.toLowerCase().includes(normalized)
        )
      })
  }, [definitions, filter, query, rowMap])

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 mb-4 border-y border-slate-200 bg-[#f5f6f8]/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:mb-5 lg:border-0 lg:bg-transparent lg:p-0">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <AdminIcon
              name="search"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm section, ví dụ: Hero, Experience..."
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <div className="grid grid-cols-3 rounded-xl border border-slate-200 bg-white p-1">
            {[
              ['all', 'Tất cả'],
              ['published', 'Đang hiện'],
              ['hidden', 'Đang ẩn'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`min-h-10 rounded-lg px-3 text-xs font-bold transition ${
                  filter === value
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {items.length ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.key}
              href={`/admin/sections/${item.key}`}
              className="group flex min-h-[132px] gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,.03)] transition hover:border-slate-300 hover:shadow-md sm:p-5"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-extrabold tracking-[.08em] text-slate-500">
                {String(item.index + 1).padStart(2, '0')}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <strong className="block text-[15px] font-bold tracking-[-.02em] text-slate-900">
                      {item.label}
                    </strong>
                    <span className="mt-0.5 block text-[11px] font-semibold text-slate-400">
                      {item.key}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      item.visible
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.visible ? 'Đang hiển thị' : 'Đang ẩn'}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {item.row?.updated_at
                      ? `Đã cập nhật ${new Date(item.row.updated_at).toLocaleDateString('vi-VN')}`
                      : 'Đang dùng dữ liệu mặc định'}
                  </span>
                  <AdminIcon
                    name="chevron"
                    className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
          <strong className="block text-sm text-slate-700">Không tìm thấy nội dung</strong>
          <p className="mt-1 text-sm text-slate-400">
            Thử từ khóa khác hoặc đổi bộ lọc.
          </p>
        </div>
      )}
    </div>
  )
}
