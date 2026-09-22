'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutAction } from '../../actions/admin'
import AdminIcon from './AdminIcon'

const links = [
  { href: '/admin', label: 'Tổng quan', short: 'Trang chủ', icon: 'dashboard' },
  { href: '/admin/sections', label: 'Nội dung', short: 'Nội dung', icon: 'content' },
  { href: '/admin/media', label: 'Hình ảnh', short: 'Hình ảnh', icon: 'media' },
  { href: '/admin/security', label: 'Bảo mật', short: 'Bảo mật', icon: 'security' },
]

function isActive(pathname, href) {
  return href === '/admin' ? pathname === href : pathname.startsWith(href)
}

export default function AdminShell({ admin, children }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
    setAccountOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] flex-col border-r border-slate-800/80 bg-[#111821] text-white lg:flex">
        <div className="px-5 pb-4 pt-6">
          <Link href="/admin" className="block rounded-2xl px-3 py-2 transition hover:bg-white/[.04]">
            <span className="block text-[10px] font-bold uppercase tracking-[.22em] text-white/35">
              KHANG / CMS
            </span>
            <strong className="mt-1.5 block text-lg font-semibold tracking-[-.03em]">
              Portfolio Admin
            </strong>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-3">
          {links.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${
                  active
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-white/62 hover:bg-white/[.06] hover:text-white'
                }`}
              >
                <AdminIcon
                  name={item.icon}
                  className={`h-5 w-5 ${active ? 'text-slate-700' : 'text-white/45'}`}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/8 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex min-h-11 items-center justify-between rounded-xl px-3.5 text-sm font-semibold text-white/62 transition hover:bg-white/[.06] hover:text-white"
          >
            <span>Xem website</span>
            <AdminIcon name="external" className="h-4 w-4" />
          </a>

          <div className="rounded-2xl bg-white/[.05] p-3.5">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white/60">
                <AdminIcon name="user" className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[.14em] text-white/30">
                  Đang đăng nhập
                </span>
                <strong className="mt-0.5 block truncate text-sm font-semibold">
                  {admin?.display_name || 'Administrator'}
                </strong>
              </div>
            </div>

            <form action={logoutAction} className="mt-3">
              <button className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 text-xs font-bold text-white/55 transition hover:bg-white/[.06] hover:text-white">
                <AdminIcon name="logout" className="h-4 w-4" />
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[268px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/92 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                aria-label="Mở menu"
              >
                <AdminIcon name="menu" className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <span className="hidden text-[10px] font-bold uppercase tracking-[.16em] text-slate-400 sm:block">
                  Portfolio CMS
                </span>
                <strong className="block truncate text-sm font-semibold tracking-[-.02em] text-slate-800 sm:mt-0.5">
                  {links.find((item) => isActive(pathname, item.href))?.label || 'Admin'}
                </strong>
              </div>
            </div>

            <div className="relative flex items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex"
              >
                Xem website
                <AdminIcon name="external" className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => setAccountOpen((current) => !current)}
                className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white shadow-sm transition hover:bg-slate-800"
                aria-label="Tài khoản"
                aria-expanded={accountOpen}
              >
                <AdminIcon name="user" className="h-4.5 w-4.5" />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="px-3 py-2.5">
                    <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
                      Tài khoản
                    </span>
                    <strong className="mt-1 block truncate text-sm">
                      {admin?.display_name || 'Administrator'}
                    </strong>
                  </div>
                  <Link
                    href="/admin/security"
                    className="flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <AdminIcon name="security" className="h-4 w-4" />
                    Đổi mật khẩu
                  </Link>
                  <form action={logoutAction}>
                    <button className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50">
                      <AdminIcon name="logout" className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-w-0 pb-[92px] lg:pb-0">
          {children}
        </main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,330px)] flex-col bg-[#111821] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-5">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[.2em] text-white/35">
                  KHANG / CMS
                </span>
                <strong className="mt-1 block text-lg">Portfolio Admin</strong>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/[.07] text-white/70"
                aria-label="Đóng menu"
              >
                <AdminIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
              {links.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex min-h-13 items-center gap-3 rounded-xl px-4 text-sm font-semibold ${
                      active ? 'bg-white text-slate-950' : 'text-white/65 hover:bg-white/[.06]'
                    }`}
                  >
                    <AdminIcon name={item.icon} className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-white/8 p-4">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold text-white/65 hover:bg-white/[.06]"
              >
                Xem website
                <AdminIcon name="external" className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'max(.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto grid max-w-xl grid-cols-4 gap-1">
          {links.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold transition ${
                  active ? 'bg-slate-950 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <AdminIcon name={item.icon} className="h-5 w-5" />
                <span className="max-w-full truncate">{item.short}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
