'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveSectionAction } from '../../actions/admin'
import AdminIcon from './AdminIcon'
import ImageSlotCard from './ImageSlotCard'
import MediaLibrary from './MediaLibrary'
import SortableImageCollection from './SortableImageCollection'

function clone(value) {
  return structuredClone(value ?? {})
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function findProject(content, key) {
  return asArray(content?.items).find((item) => item?.key === key)
}

function updateProject(content, key, updater) {
  const next = clone(content)
  next.items = asArray(next.items)

  const index = next.items.findIndex(
    (item) => item?.key === key,
  )

  if (index < 0) return next

  next.items[index] = updater(next.items[index])
  return next
}

function findWorkCard(content, key) {
  return asArray(content?.cards).find(
    (item) => item?.projectKey === key,
  )
}

function updateWorkCard(content, key, updater) {
  const next = clone(content)
  next.cards = asArray(next.cards)

  const index = next.cards.findIndex(
    (item) => item?.projectKey === key,
  )

  if (index < 0) return next

  next.cards[index] = updater(next.cards[index])
  return next
}

export default function ImageManagerWorkspace({
  initialSections,
  cloudAssets,
  localAssets,
}) {
  const router = useRouter()
  const [tab, setTab] = useState('placement')
  const [sections, setSections] = useState(initialSections)
  const [saved, setSaved] = useState(() => JSON.stringify(initialSections))
  const [message, setMessage] = useState(null)
  const [pending, startTransition] = useTransition()

  const dirty = useMemo(
    () => JSON.stringify(sections) !== saved,
    [saved, sections],
  )

  const vexere = findProject(sections.projects, 'vexere')
  const eventProject = findProject(sections.projects, 'event')
  const generali = findWorkCard(sections.work, 'generali')

  function updateSection(key, updater) {
    setSections((current) => ({
      ...current,
      [key]: updater(current[key]),
    }))
    setMessage(null)
  }

  function save() {
    if (!dirty || pending) return

    startTransition(async () => {
      const keys = ['site', 'work', 'projects', 'campaignOps']

      for (const key of keys) {
        const result = await saveSectionAction(key, sections[key], true)

        if (!result?.ok) {
          setMessage({
            ok: false,
            message: result?.message || `Không thể lưu ${key}.`,
          })
          return
        }
      }

      setSaved(JSON.stringify(sections))
      setMessage({
        ok: true,
        message: 'Đã lưu bố cục hình ảnh.',
      })
      router.refresh()
    })
  }

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        {[
          ['placement', 'Đang hiển thị'],
          ['library', 'Thư viện ảnh'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`min-h-11 rounded-xl px-3 text-xs font-bold transition ${
              tab === value
                ? 'bg-slate-950 text-white'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'placement' ? (
        <div className="space-y-5 pb-28">
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
                <AdminIcon name="media" className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-sm text-blue-950">
                  Bố cục ảnh trực quan
                </strong>
                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Kéo biểu tượng chấm trên từng ảnh để đổi thứ tự. Thứ tự trong Admin chính là thứ tự xuất hiện trên website.
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <ImageSlotCard
              eyebrow="Hero / Profile"
              title="Ảnh đại diện"
              description="Ảnh chân dung xuất hiện ở khu vực Hero."
              value={sections.site?.avatarUrl || ''}
              onChange={(url) =>
                updateSection('site', (current) => ({
                  ...current,
                  avatarUrl: url,
                }))
              }
            />

            <ImageSlotCard
              eyebrow="Selected Work"
              title="Ảnh Generali"
              description="Ảnh chính trong case Generali."
              value={generali?.image || ''}
              onChange={(url) =>
                updateSection('work', (current) =>
                  updateWorkCard(current, 'generali', (card) => ({
                    ...card,
                    image: url,
                  })),
                )
              }
            />
          </div>

          <SortableImageCollection
            title="Vexere · Gallery case study"
            description="Các ảnh xuất hiện trong gallery của trang case study Vexere."
            value={vexere?.gallery || []}
            onChange={(next) =>
              updateSection('projects', (current) =>
                updateProject(current, 'vexere', (project) => ({
                  ...project,
                  gallery: next,
                })),
              )
            }
          />

          <SortableImageCollection
            title="Vexere · Slider Selected Work"
            description="Thứ tự ảnh trong slider Vexere ở trang chính."
            value={vexere?.sliderSlides || []}
            onChange={(next) =>
              updateSection('projects', (current) =>
                updateProject(current, 'vexere', (project) => ({
                  ...project,
                  sliderSlides: next,
                })),
              )
            }
          />

          <SortableImageCollection
            title="Academic event · Gallery case study"
            description="Các ảnh trong gallery của case study UFM."
            value={eventProject?.gallery || []}
            onChange={(next) =>
              updateSection('projects', (current) =>
                updateProject(current, 'event', (project) => ({
                  ...project,
                  gallery: next,
                })),
              )
            }
          />

          <SortableImageCollection
            title="Academic event · Slider Selected Work"
            description="Thứ tự ảnh trong slider dự án học thuật ở trang chính."
            value={eventProject?.sliderSlides || []}
            onChange={(next) =>
              updateSection('projects', (current) =>
                updateProject(current, 'event', (project) => ({
                  ...project,
                  sliderSlides: next,
                })),
              )
            }
          />

          <SortableImageCollection
            title="Campaign operating system · Carousel"
            description="Ảnh carousel ở phần quy trình campaign."
            value={sections.campaignOps?.slides || []}
            onChange={(next) =>
              updateSection('campaignOps', (current) => ({
                ...current,
                slides: next,
              }))
            }
          />

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

          <div
            className="fixed inset-x-0 z-30 border-t border-slate-200 bg-white/96 px-3 py-2.5 shadow-[0_-8px_28px_rgba(15,23,42,.08)] backdrop-blur-xl lg:left-[268px] lg:bottom-0 lg:px-6"
            style={{ bottom: 'calc(74px + env(safe-area-inset-bottom))' }}
          >
            <div className="mx-auto flex max-w-[1440px] items-center gap-3">
              <div className="hidden min-w-0 flex-1 sm:block">
                <strong
                  className={`block text-xs ${
                    dirty ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {dirty
                    ? 'Bố cục ảnh có thay đổi chưa lưu'
                    : 'Bố cục ảnh đã được lưu'}
                </strong>
                <span className="mt-0.5 block text-[11px] text-slate-400">
                  Kéo thả xong hãy bấm lưu để cập nhật website.
                </span>
              </div>

              <button
                type="button"
                onClick={save}
                disabled={!dirty || pending}
                className="ml-auto inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-bold text-white disabled:opacity-35 sm:flex-none"
              >
                <AdminIcon name="save" className="h-4 w-4" />
                {pending
                  ? 'Đang lưu…'
                  : dirty
                    ? 'Lưu bố cục ảnh'
                    : 'Đã lưu'}
              </button>
            </div>
          </div>

          <style jsx global>{`
            @media (min-width: 1024px) {
              .fixed[style*='74px'] {
                bottom: 0 !important;
              }
            }
          `}</style>
        </div>
      ) : (
        <MediaLibrary
          initialCloudAssets={cloudAssets}
          localAssets={localAssets}
        />
      )}
    </div>
  )
}
