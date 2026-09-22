'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveSectionAction } from '../../actions/admin'
import CloudinaryUpload from './CloudinaryUpload'
import AdminIcon from './AdminIcon'
import MediaPicker from './MediaPicker'
import SortableImageCollection from './SortableImageCollection'

const imageKey = /(image|img|photo|avatar|cover|src|url)/i
const longKey = /(description|intro|summary|copy|note|paragraph|statement|body|disclaimer|bullets?)/i

const friendlyLabels = {
  name: 'Tên',
  role: 'Vai trò',
  location: 'Địa điểm',
  year: 'Năm',
  email: 'Email',
  phoneDisplay: 'Số điện thoại hiển thị',
  phoneHref: 'Số điện thoại liên kết',
  cvUrl: 'Đường dẫn CV',
  avatarUrl: 'Ảnh đại diện',
  label: 'Nhãn',
  href: 'Liên kết',
  section: 'Section',
  ctaLabel: 'Nút CTA',
  status: 'Trạng thái',
  availability: 'Tình trạng',
  kicker: 'Dòng giới thiệu',
  copy: 'Nội dung mô tả',
  description: 'Mô tả',
  title: 'Tiêu đề',
  text: 'Nội dung',
  accent: 'Nhấn mạnh',
  value: 'Giá trị',
  sub: 'Chú thích',
  period: 'Thời gian',
  company: 'Công ty / Đơn vị',
  bullets: 'Các ý chính',
  items: 'Danh sách',
  stats: 'Số liệu',
  metrics: 'Chỉ số',
  gallery: 'Thư viện ảnh',
  slides: 'Slides',
  sliderSlides: 'Slides',
  sliderMetrics: 'Chỉ số slider',
  responsibilities: 'Trách nhiệm',
  outcomes: 'Kết quả',
  facts: 'Thông tin nhanh',
  groups: 'Nhóm',
  education: 'Học vấn',
  certifications: 'Chứng chỉ',
  primaryCta: 'Nút chính',
  secondaryCta: 'Nút phụ',
  proofItems: 'Số liệu nổi bật',
  titleLines: 'Các dòng tiêu đề',
  floatingCards: 'Thẻ nổi',
  stageBottom: 'Thông tin cuối khung',
  paragraphs: 'Đoạn giới thiệu',
  featureNotes: 'Điểm nổi bật',
  summary: 'Tóm tắt',
  cards: 'Thẻ dự án',
  flow: 'Quy trình',
  overview: 'Tổng quan',
  focus: 'Trọng tâm',
}

function humanize(value) {
  if (friendlyLabels[value]) return friendlyLabels[value]
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function cloneValue(value) {
  if (Array.isArray(value)) return []
  if (value && typeof value === 'object') return structuredClone(value)
  if (typeof value === 'boolean') return false
  if (typeof value === 'number') return 0
  return ''
}

function getAtPath(source, path) {
  let cursor = source

  for (const segment of path) {
    if (cursor === undefined || cursor === null) {
      return undefined
    }

    cursor = cursor[segment]
  }

  return cursor
}
function setAtPath(source, path, value) {
  if (!path.length) return value
  const next = structuredClone(source)
  let cursor = next
  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = cursor[path[index]]
  }
  cursor[path[path.length - 1]] = value
  return next
}

function FieldLabel({ label, technical }) {
  return (
    <div className="mb-2">
      <span className="block text-xs font-bold text-slate-700">{humanize(label)}</span>
      {technical && humanize(label) !== technical && (
        <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
          {technical}
        </span>
      )}
    </div>
  )
}

function PrimitiveField({ label, value, path, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const leafKey = String(path[path.length - 1] ?? label)
  const setValue = (next) => onChange(path, next)

  if (typeof value === 'boolean') {
    return (
      <div className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div>
          <span className="block text-sm font-bold text-slate-700">{humanize(label)}</span>
          <span className="mt-0.5 block text-[11px] text-slate-400">
            {value ? 'Đang bật' : 'Đang tắt'}
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => setValue(!value)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            value ? 'bg-slate-950' : 'bg-slate-200'
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
              value ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>
    )
  }

  const isImage =
    typeof value === 'string' &&
    (imageKey.test(leafKey) ||
      /^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value))

  const useTextarea =
    typeof value === 'string' &&
    (longKey.test(leafKey) || value.length > 100 || value.includes('\n'))

  return (
    <div>
      <FieldLabel label={label} technical={leafKey} />

      {useTextarea ? (
        <textarea
          value={value ?? ''}
          rows={Math.max(4, Math.min(9, String(value || '').split('\n').length + 3))}
          onChange={(event) => setValue(event.target.value)}
          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] leading-6 text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      ) : (
        <input
          type={typeof value === 'number' ? 'number' : 'text'}
          value={value ?? ''}
          onChange={(event) =>
            setValue(typeof value === 'number' ? Number(event.target.value) : event.target.value)
          }
          className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      )}

      {isImage && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {value ? (
              <img
                src={value}
                alt=""
                className="h-28 w-full rounded-xl border border-slate-200 bg-white object-cover sm:h-20 sm:w-28"
              />
            ) : (
              <div className="grid h-24 w-full place-items-center rounded-xl border border-dashed border-slate-300 bg-white text-xs text-slate-400 sm:h-20 sm:w-28">
                Chưa có ảnh
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-xs font-bold text-white"
                >
                  <AdminIcon name="media" className="h-4 w-4" />
                  Chọn từ thư viện
                </button>
                <CloudinaryUpload compact onUploaded={(url) => setValue(url)} />
              </div>
              <p className="mt-2 truncate text-[10px] text-slate-400">
                {value || 'Bạn cũng có thể dán URL trực tiếp ở ô phía trên.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => setValue(url)}
        title={humanize(label)}
      />
    </div>
  )
}

function ObjectField({ label, value, path, onChange, depth, templateRoot }) {
  const entries = Object.entries(value)
  const content = (
    <div className="grid gap-4">
      {entries.map(([key, child]) => (
        <Field
          key={key}
          label={key}
          value={child}
          path={[...path, key]}
          onChange={onChange}
          depth={depth + 1}
          templateRoot={templateRoot}
        />
      ))}
    </div>
  )

  if (depth === 0) return content

  return (
    <details open={depth < 2} className="group rounded-2xl border border-slate-200 bg-slate-50/70">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div>
          <strong className="block text-sm font-bold text-slate-800">{humanize(label)}</strong>
          <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
            {entries.length} trường
          </span>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-slate-400 shadow-sm transition group-open:rotate-90">
          <AdminIcon name="chevron" className="h-4 w-4" />
        </span>
      </summary>
      <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
        {content}
      </div>
    </details>
  )
}

function ArrayField({ label, value, path, onChange, depth, templateRoot }) {
  const setValue = (next) => onChange(path, next)
  const defaultArray = getAtPath(templateRoot, path)
  const itemTemplate =
    value[0] !== undefined
      ? value[0]
      : Array.isArray(defaultArray) && defaultArray[0] !== undefined
        ? defaultArray[0]
        : ''

  const imageCollection =
    value.length > 0 &&
    value.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.src === 'string',
    )

  if (imageCollection) {
    return (
      <SortableImageCollection
        title={humanize(label)}
        description="Kéo thả ảnh để thay đổi thứ tự hiển thị trên website."
        value={value}
        onChange={setValue}
      />
    )
  }

  function move(index, offset) {
    const target = index + offset
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    setValue(next)
  }

  function duplicate(index) {
    const next = [...value]
    next.splice(index + 1, 0, structuredClone(value[index]))
    setValue(next)
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">
            Danh sách · {value.length} mục
          </span>
          <h3 className="mt-1 text-sm font-bold text-slate-800">{humanize(label)}</h3>
        </div>
        <button
          type="button"
          onClick={() => setValue([...value, cloneValue(itemTemplate)])}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800"
        >
          <AdminIcon name="plus" className="h-4 w-4" />
          Thêm mục
        </button>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {value.map((item, index) => (
          <article
            key={`${path.join('.')}-${index}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5 sm:px-4">
              <span className="text-[11px] font-extrabold uppercase tracking-[.12em] text-slate-400">
                Mục {String(index + 1).padStart(2, '0')}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-25"
                  aria-label="Di chuyển lên"
                >
                  <AdminIcon name="up" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index === value.length - 1}
                  onClick={() => move(index, 1)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-25"
                  aria-label="Di chuyển xuống"
                >
                  <AdminIcon name="down" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => duplicate(index)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                  aria-label="Nhân bản"
                >
                  <AdminIcon name="duplicate" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Xóa mục ${index + 1}?`)) {
                      setValue(value.filter((_, itemIndex) => itemIndex !== index))
                    }
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-rose-100 text-rose-500 transition hover:bg-rose-50"
                  aria-label="Xóa"
                >
                  <AdminIcon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <Field
                label={`${label} ${index + 1}`}
                value={item}
                path={[...path, index]}
                onChange={onChange}
                depth={depth + 1}
              />
            </div>
          </article>
        ))}

        {!value.length && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <strong className="block text-sm text-slate-600">Danh sách đang trống</strong>
            <p className="mt-1 text-xs text-slate-400">Nhấn “Thêm mục” để tạo nội dung đầu tiên.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function Field({ label, value, path, onChange, depth = 0, templateRoot }) {
  if (Array.isArray(value)) {
    return (
      <ArrayField
        label={label}
        value={value}
        path={path}
        onChange={onChange}
        depth={depth}
        templateRoot={templateRoot}
      />
    )
  }

  if (value && typeof value === 'object') {
    return (
      <ObjectField
        label={label}
        value={value}
        path={path}
        onChange={onChange}
        depth={depth}
        templateRoot={templateRoot}
      />
    )
  }

  return (
    <PrimitiveField
      label={label}
      value={value}
      path={path}
      onChange={onChange}
    />
  )
}

export default function SectionEditor({
  sectionKey,
  initialContent,
  initialVisible,
  templateContent = initialContent,
}) {
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [visible, setVisible] = useState(initialVisible)
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify({ content: initialContent, visible: initialVisible }),
  )
  const [message, setMessage] = useState(null)
  const [pending, startTransition] = useTransition()

  const currentSnapshot = useMemo(
    () => JSON.stringify({ content, visible }),
    [content, visible],
  )

  const dirty = currentSnapshot !== savedSnapshot
  const fieldCount = useMemo(() => JSON.stringify(content).length, [content])

  useEffect(() => {
    const beforeUnload = (event) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [dirty])

  const onChange = (path, value) => {
    setContent((current) => setAtPath(current, path, value))
    setMessage(null)
  }

  function save() {
    if (!dirty || pending) return

    startTransition(async () => {
      const result = await saveSectionAction(sectionKey, content, visible)
      setMessage(result)
      if (result.ok) {
        setSavedSnapshot(JSON.stringify({ content, visible }))
        router.refresh()
      }
    })
  }

  function discard() {
    if (!dirty) return
    if (!window.confirm('Bỏ toàn bộ thay đổi chưa lưu trong section này?')) return
    setContent(initialContent)
    setVisible(initialVisible)
    setMessage(null)
  }

  return (
    <div className="pb-36 lg:pb-28">
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-slate-500">
                {sectionKey}
              </span>
              <span
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold ${
                  dirty
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {dirty ? 'Có thay đổi chưa lưu' : 'Đã lưu'}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              {fieldCount.toLocaleString('vi-VN')} ký tự dữ liệu · Thay đổi chỉ xuất hiện sau khi bấm Lưu.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className={`min-h-11 rounded-xl px-4 text-xs font-bold transition ${
                visible
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border border-slate-200 bg-slate-100 text-slate-500'
              }`}
            >
              {visible ? '● Đang hiển thị' : '○ Đang ẩn'}
            </button>

            <button
              type="button"
              onClick={save}
              disabled={!dirty || pending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <AdminIcon name="save" className="h-4 w-4" />
              {pending ? 'Đang lưu…' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
            message.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {message.message}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <Field
          label={sectionKey}
          value={content}
          path={[]}
          onChange={(path, value) =>
            path.length ? onChange(path, value) : setContent(value)
          }
          templateRoot={templateContent}
        />
      </section>

      <div
        className="fixed inset-x-0 z-30 border-t border-slate-200 bg-white/96 px-3 py-2.5 shadow-[0_-8px_28px_rgba(15,23,42,.08)] backdrop-blur-xl lg:left-[268px] lg:bottom-0 lg:px-6"
        style={{ bottom: 'calc(74px + env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-2">
          <div className="hidden min-w-0 flex-1 sm:block">
            <strong className={`block text-xs ${dirty ? 'text-amber-700' : 'text-emerald-700'}`}>
              {dirty ? 'Bạn có thay đổi chưa lưu' : 'Mọi thay đổi đã được lưu'}
            </strong>
            <span className="mt-0.5 block truncate text-[11px] text-slate-400">
              Lưu để cập nhật dữ liệu trên website.
            </span>
          </div>

          {dirty && (
            <button
              type="button"
              onClick={discard}
              className="min-h-11 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
            >
              Hoàn tác
            </button>
          )}

          <button
            type="button"
            onClick={save}
            disabled={!dirty || pending}
            className="ml-auto inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-bold text-white disabled:opacity-35 sm:flex-none"
          >
            <AdminIcon name="save" className="h-4 w-4" />
            {pending ? 'Đang lưu…' : dirty ? 'Lưu section' : 'Đã lưu'}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 1024px) {
          .fixed[style*="74px"] {
            bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
