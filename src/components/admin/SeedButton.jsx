'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { seedDefaultsAction } from '../../actions/admin'
import AdminIcon from './AdminIcon'

export default function SeedButton({ compact = false, danger = false }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  function seed() {
    const confirmed = window.confirm(
      'Thao tác này sẽ ghi lại toàn bộ nội dung mặc định vào Supabase. Bạn có chắc muốn tiếp tục?',
    )
    if (!confirmed) return

    startTransition(async () => {
      const result = await seedDefaultsAction()
      setMessage(result.message)
      if (result.ok) router.refresh()
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={seed}
        disabled={pending}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          danger
            ? 'border border-rose-200 bg-white text-rose-700 hover:bg-rose-50'
            : 'bg-slate-950 text-white hover:bg-slate-800'
        } ${compact ? 'px-3.5 text-xs' : 'px-4 text-sm'}`}
      >
        <AdminIcon name={danger ? 'warning' : 'plus'} className="h-4 w-4" />
        {pending ? 'Đang xử lý…' : danger ? 'Khôi phục nội dung mặc định' : 'Khởi tạo nội dung'}
      </button>
      {message && <span className="text-xs text-slate-500">{message}</span>}
    </div>
  )
}
