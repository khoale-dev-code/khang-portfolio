'use client'

import { useRef, useState } from 'react'
import AdminIcon from './AdminIcon'

export default function CloudinaryUpload({ onUploaded, compact = false }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function upload(file) {
    if (!file) return
    setBusy(true)
    setError('')

    try {
      const signResponse = await fetch('/api/cloudinary/sign', { method: 'POST' })
      const sign = await signResponse.json()
      if (!signResponse.ok) throw new Error(sign.error || 'Không thể tạo chữ ký upload.')

      const body = new FormData()
      body.append('file', file)
      body.append('api_key', sign.apiKey)
      body.append('timestamp', String(sign.timestamp))
      body.append('signature', sign.signature)
      body.append('folder', sign.folder)

      const cloudResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`,
        { method: 'POST', body },
      )
      const asset = await cloudResponse.json()
      if (!cloudResponse.ok) {
        throw new Error(asset?.error?.message || 'Upload Cloudinary thất bại.')
      }

      await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId: asset.public_id,
          secureUrl: asset.secure_url,
          resourceType: asset.resource_type,
          width: asset.width || null,
          height: asset.height || null,
          bytes: asset.bytes || null,
          originalFilename: asset.original_filename || file.name,
        }),
      })

      onUploaded?.(asset.secure_url, asset)
      if (inputRef.current) inputRef.current.value = ''
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => upload(event.target.files?.[0])}
      />

      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${
          compact ? 'px-3 text-xs' : 'px-4 text-sm'
        }`}
      >
        <AdminIcon name="upload" className="h-4 w-4" />
        {busy ? 'Đang tải…' : compact ? 'Đổi ảnh' : 'Tải ảnh lên'}
      </button>

      {error && (
        <span className="max-w-full text-xs font-medium text-rose-600">
          {error}
        </span>
      )}
    </div>
  )
}
