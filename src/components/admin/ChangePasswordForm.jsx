'use client'

import { useState } from 'react'
import { changeAdminPasswordAction } from '../../actions/admin'
import AdminIcon from './AdminIcon'

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage(null)

    try {
      const result = await changeAdminPasswordAction(
        currentPassword,
        newPassword,
        confirmPassword,
      )
      setMessage(result)

      if (result?.ok) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setMessage({ ok: false, message: 'Không thể cập nhật mật khẩu.' })
    } finally {
      setBusy(false)
    }
  }

  const type = showPasswords ? 'text' : 'password'

  return (
    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">
              Xác thực
            </p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-.03em]">
              Đổi mật khẩu quản trị
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Mật khẩu được quản lý bởi Supabase Auth và không được lưu trong nội dung portfolio.
            </p>
          </div>
          <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 sm:grid">
            <AdminIcon name="security" className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-600">
            Mật khẩu hiện tại
          </span>
          <input
            type={type}
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-slate-600">
              Mật khẩu mới
            </span>
            <input
              type={type}
              autoComplete="new-password"
              required
              minLength={10}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
            <span className="mt-1.5 block text-[11px] text-slate-400">
              Tối thiểu 10 ký tự.
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-slate-600">
              Nhập lại mật khẩu mới
            </span>
            <input
              type={type}
              autoComplete="new-password"
              required
              minLength={10}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-3.5 text-xs font-semibold text-slate-500">
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={(event) => setShowPasswords(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Hiển thị mật khẩu trong các ô bên trên
        </label>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
              message.ok
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {message.message}
          </div>
        )}

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={busy}
            className="min-h-12 w-full rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
          >
            {busy ? 'Đang cập nhật…' : 'Cập nhật mật khẩu'}
          </button>
        </div>
      </div>
    </form>
  )
}
