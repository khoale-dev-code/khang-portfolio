'use client'

import { useState } from 'react'
import AdminIcon from './AdminIcon'
import MediaPicker from './MediaPicker'

export default function ImageSlotCard({
  eyebrow,
  title,
  description,
  value,
  onChange,
}) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          {eyebrow && (
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
              {eyebrow}
            </span>
          )}
          <h3 className="mt-1 text-sm font-bold text-slate-900">{title}</h3>
          {description && (
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {value ? (
              <img
                src={value}
                alt=""
                className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]"
              />
            ) : (
              <div className="grid aspect-[4/3] place-items-center text-sm text-slate-400 sm:aspect-[16/9]">
                Chưa chọn ảnh
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-xs font-bold text-white"
            >
              <AdminIcon name="media" className="h-4 w-4" />
              {value ? 'Đổi ảnh' : 'Chọn ảnh'}
            </button>

            <button
              type="button"
              disabled={!value}
              onClick={() => {
                if (window.confirm('Bỏ ảnh khỏi vị trí này?')) onChange('')
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30"
            >
              <AdminIcon name="trash" className="h-4 w-4" />
              Bỏ ảnh
            </button>
          </div>

          {value && (
            <p className="mt-2 truncate text-[10px] text-slate-400">
              {value}
            </p>
          )}
        </div>
      </article>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange(url)}
        title={title}
      />
    </>
  )
}
