'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { loginWithPasswordAction } from '../../../actions/admin'
import AdminIcon from '../../../components/admin/AdminIcon'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()

    if (!password) {
      setError('Vui lòng nhập mật khẩu.')
      return
    }

    setBusy(true)
    setError('')

    try {
      const result = await loginWithPasswordAction(password)

      if (!result?.ok) {
        setError(result?.message || 'Không thể đăng nhập.')
        setBusy(false)
        return
      }

      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Cấu hình đăng nhập Admin chưa chính xác.')
      setBusy(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1520] px-4 py-8 text-white sm:px-6">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[.065] shadow-2xl backdrop-blur-xl sm:rounded-[32px]">
        <div className="p-5 sm:p-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[.07] text-white/60">
            <AdminIcon name="security" className="h-5 w-5" />
          </div>

          <div className="mt-8">
            <span className="text-[10px] font-bold uppercase tracking-[.22em] text-white/35">
              KHANG / PORTFOLIO CMS
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-[34px]">
              Chào mừng trở lại
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Nhập mật khẩu quản trị để tiếp tục.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-white/55">
                Mật khẩu
              </span>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pr-20 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-white/30 focus:bg-black/25"
                  placeholder="Nhập mật khẩu"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 min-w-16 px-4 text-[10px] font-extrabold uppercase tracking-[.08em] text-white/35 transition hover:text-white/70"
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm leading-5 text-rose-100">
                {error}
              </div>
            )}

            <button
              disabled={busy}
              className="min-h-14 w-full rounded-2xl bg-white px-4 text-sm font-bold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
          </form>
        </div>

        <div className="border-t border-white/8 bg-black/10 px-5 py-4 sm:px-8">
          <a
            href="/"
            className="flex min-h-10 items-center justify-center gap-2 text-xs font-semibold text-white/35 transition hover:text-white/70"
          >
            <AdminIcon name="back" className="h-4 w-4" />
            Quay lại portfolio
          </a>
        </div>
      </div>
    </main>
  )
}
