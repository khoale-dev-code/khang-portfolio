'use client'

import { useMemo, useState } from 'react'
import CloudinaryUpload from './CloudinaryUpload'
import AdminIcon from './AdminIcon'

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function MediaLibrary({
  initialCloudAssets = [],
  localAssets = [],
}) {
  const [cloudAssets, setCloudAssets] = useState(initialCloudAssets)
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('all')
  const [copied, setCopied] = useState('')
  const [preview, setPreview] = useState(null)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  const allAssets = useMemo(
    () => [
      ...localAssets.map((asset) => ({ ...asset, source: 'public' })),
      ...cloudAssets.map((asset) => ({
        ...asset,
        source: asset.source || 'cloudinary',
      })),
    ],
    [cloudAssets, localAssets],
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return allAssets.filter((asset) => {
      if (source !== 'all' && asset.source !== source) return false
      if (!normalized) return true

      return `${asset.original_filename || ''} ${asset.public_id || ''}`
        .toLowerCase()
        .includes(normalized)
    })
  }, [allAssets, query, source])

  async function refreshCloud() {
    const response = await fetch('/api/media', { cache: 'no-store' })
    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload?.error || 'Không thể tải lại thư viện.')
    }

    setCloudAssets(
      (payload.assets || []).filter((asset) => asset.source === 'cloudinary'),
    )
  }

  async function copy(url) {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    window.setTimeout(() => setCopied(''), 1500)
  }

  async function rename(asset) {
    if (asset.source !== 'cloudinary') return

    const nextName = window.prompt(
      'Tên hiển thị mới:',
      asset.original_filename || '',
    )

    if (!nextName?.trim()) return

    setBusyId(asset.id)
    setError('')

    try {
      const response = await fetch(`/api/media/${asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalFilename: nextName.trim(),
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Không thể đổi tên.')
      }

      setCloudAssets((current) =>
        current.map((item) =>
          item.id === asset.id ? payload.asset : item,
        ),
      )
    } catch (renameError) {
      setError(renameError.message)
    } finally {
      setBusyId('')
    }
  }

  async function remove(asset) {
    if (asset.source !== 'cloudinary') return

    const confirmed = window.confirm(
      `Xóa "${asset.original_filename || asset.public_id}" khỏi Cloudinary và Media Library?`,
    )

    if (!confirmed) return

    setBusyId(asset.id)
    setError('')

    try {
      const response = await fetch(`/api/media/${asset.id}`, {
        method: 'DELETE',
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Không thể xóa ảnh.')
      }

      setCloudAssets((current) =>
        current.filter((item) => item.id !== asset.id),
      )

      if (preview?.id === asset.id) setPreview(null)
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setBusyId('')
    }
  }

  return (
    <div>
      <section className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">
              Public + Cloudinary
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-[-.03em]">
              Tất cả hình ảnh
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
              Ảnh Cloudinary có thể thêm, đổi tên và xóa. Ảnh Public là file đi cùng source code nên được giữ ở chế độ chỉ đọc.
            </p>
          </div>

          <CloudinaryUpload
            onUploaded={() => {
              refreshCloud().catch((refreshError) =>
                setError(refreshError.message),
              )
            }}
          />
        </div>

        <div className="border-t border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <AdminIcon
                name="search"
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên ảnh..."
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
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
                  className={`min-h-10 rounded-lg px-3 text-xs font-bold transition ${
                    source === value
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">
          {filtered.length} / {allAssets.length} ảnh
        </span>
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((asset) => (
            <article
              key={`${asset.source}:${asset.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]"
            >
              <button
                type="button"
                onClick={() => setPreview(asset)}
                className="relative block aspect-square w-full overflow-hidden bg-slate-100 text-left"
              >
                <img
                  src={asset.secure_url}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />

                <span
                  className={`absolute left-2 top-2 rounded-lg px-2 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-white ${
                    asset.source === 'public'
                      ? 'bg-slate-950/80'
                      : 'bg-blue-600/90'
                  }`}
                >
                  {asset.source === 'public' ? 'Public' : 'Cloud'}
                </span>
              </button>

              <div className="p-3">
                <strong className="block truncate text-xs font-bold text-slate-800 sm:text-sm">
                  {asset.original_filename || asset.public_id}
                </strong>

                <span className="mt-1 block truncate text-[10px] text-slate-400">
                  {asset.width && asset.height
                    ? `${asset.width} × ${asset.height}`
                    : asset.source === 'public'
                      ? 'File trong public/'
                      : 'Cloudinary'}
                  {asset.bytes ? ` · ${formatBytes(asset.bytes)}` : ''}
                </span>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => copy(asset.secure_url)}
                    className={`min-h-10 rounded-xl border text-[10px] font-bold transition ${
                      copied === asset.secure_url
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {copied === asset.secure_url ? 'Đã copy' : 'Copy URL'}
                  </button>

                  {asset.source === 'cloudinary' ? (
                    <button
                      type="button"
                      disabled={busyId === asset.id}
                      onClick={() => rename(asset)}
                      className="min-h-10 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      Đổi tên
                    </button>
                  ) : (
                    <span className="grid min-h-10 place-items-center rounded-xl bg-slate-100 text-[9px] font-bold uppercase text-slate-400">
                      Chỉ đọc
                    </span>
                  )}
                </div>

                {asset.source === 'cloudinary' && (
                  <button
                    type="button"
                    disabled={busyId === asset.id}
                    onClick={() => remove(asset)}
                    className="mt-2 min-h-10 w-full rounded-xl border border-rose-100 text-[10px] font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                  >
                    {busyId === asset.id ? 'Đang xử lý…' : 'Xóa khỏi Cloudinary'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <strong className="block text-sm text-slate-700">
            Không tìm thấy ảnh phù hợp
          </strong>
          <p className="mt-1 text-sm text-slate-400">
            Thử từ khóa khác hoặc tải ảnh mới lên.
          </p>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/70 backdrop-blur-sm sm:items-center sm:p-6">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Đóng preview"
            onClick={() => setPreview(null)}
          />

          <div className="relative z-10 max-h-[92vh] w-full overflow-auto rounded-t-[28px] bg-white p-4 shadow-2xl sm:max-w-3xl sm:rounded-[28px] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <strong className="block truncate text-sm">
                  {preview.original_filename || preview.public_id}
                </strong>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {preview.source === 'public'
                    ? 'Public / source code'
                    : 'Cloudinary'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPreview(null)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"
              >
                <AdminIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={preview.secure_url}
                alt=""
                className="max-h-[58vh] w-full object-contain"
              />
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => copy(preview.secure_url)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white"
              >
                <AdminIcon name="copy" className="h-4 w-4" />
                Sao chép URL
              </button>

              <a
                href={preview.secure_url}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700"
              >
                Mở ảnh gốc
                <AdminIcon name="external" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
