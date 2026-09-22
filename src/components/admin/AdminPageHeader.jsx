import Link from 'next/link'
import AdminIcon from './AdminIcon'

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = 'Quay lại',
  actions,
}) {
  return (
    <header className="mb-5 sm:mb-7">
      {backHref && (
        <Link
          href={backHref}
          className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
        >
          <AdminIcon name="back" className="h-4 w-4" />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1.5 text-[28px] font-bold leading-tight tracking-[-.045em] text-slate-950 sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
