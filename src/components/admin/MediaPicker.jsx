'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminIcon from './AdminIcon'
import CloudinaryUpload from './CloudinaryUpload'

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  title = 'Chọn hình ảnh',
}) {
  const [assets, setAssets] = useState([])
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/media', {
        cache: 'no-store',
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Không thể tải thư viện ảnh.')
      }

      setAssets(payload.assets || [])
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    load()
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return assets.filter((asset) => {
      if (source !== 'all' && asset.source !== source) return false
      if (!normalized) return true

      return `${asset.original_filename || ''} ${asset.public_id || ''}`
        .toLowerCase()
        .includes(normalized)
    })
  }, [assets, query, source])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Đóng thư viện"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-[#f6f7f9] shadow-2xl sm:max-w-5xl sm:rounded-[28px]">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
              Media picker
            </span>
            <h2 className="mt-1 truncate text-lg font-bold tracking-[-.03em]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"
            aria-label="Đóng"
          >
            <AdminIcon name="close" className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <AdminIcon
                name="search"
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm tên ảnh..."
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </label>

            <div className="grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {[
                ['all', 'Tất cả'],
                ['public', 'Public'],
                ['cloudinary', 'Cloudinary'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSource(value)}
                  className={`min-h-9 rounded-lg px-3 text-[11px] font-bold transition ${
                    source === value
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <CloudinaryUpload
              compact
              onUploaded={() => {
                load()
              }}
            />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-slate-400">
            Ảnh trong <strong>public/</strong> là ảnh đi cùng source code. Ảnh Cloudinary có thể quản lý động mà không cần deploy lại.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Đang tải thư viện…
            </div>
          ) : filtered.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((asset) => (
                <button
                  type="button"
                  key={asset.id}
                  onClick={() => {
                    onSelect?.(asset.secure_url, asset)
                    onClose?.()
                  }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-[0_1px_2px_rgba(15,23,42,.03)] transition hover:border-slate-400 hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={asset.secure_url}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />

                    <span
                      className={`absolute left-2 top-2 rounded-lg px-2 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] ${
                        asset.source === 'public'
                          ? 'bg-slate-950/80 text-white'
                          : 'bg-blue-600/90 text-white'
                      }`}
                    >
                      {asset.source === 'public' ? 'Public' : 'Cloud'}
                    </span>
                  </div>

                  <div className="p-2.5">
                    <strong className="block truncate text-[11px] font-bold text-slate-700">
                      {asset.original_filename || asset.public_id}
                    </strong>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <strong className="block text-sm text-slate-700">
                Không tìm thấy ảnh
              </strong>
              <p className="mt-1 text-sm text-slate-400">
                Thử từ khóa khác hoặc tải ảnh mới lên.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
