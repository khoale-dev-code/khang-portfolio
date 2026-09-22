'use client'

import { useId, useMemo, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AdminIcon from './AdminIcon'
import MediaPicker from './MediaPicker'

const metadataKeys = ['kicker', 'label', 'title', 'note', 'description', 'alt']

function makeItem(template, url) {
  if (!template || typeof template !== 'object') {
    return { src: url }
  }

  const next = structuredClone(template)

  Object.keys(next).forEach((key) => {
    if (key === 'src') {
      next[key] = url
      return
    }

    if (typeof next[key] === 'string') next[key] = ''
  })

  next.src = url
  return next
}

function SortableCard({
  item,
  id,
  index,
  onChange,
  onDelete,
  onDuplicate,
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const dndContextId = useId()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    opacity: isDragging ? 0.78 : 1,
  }

  return (
    <>
      <article
        ref={setNodeRef}
        style={style}
        className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
          isDragging ? 'border-slate-500 shadow-xl' : 'border-slate-200'
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {item.src ? (
            <img
              src={item.src}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs text-slate-400">
              Chưa có ảnh
            </div>
          )}

          <div className="absolute left-2 top-2 rounded-lg bg-slate-950/80 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-white">
            {String(index + 1).padStart(2, '0')}
          </div>

          <button
            type="button"
            {...attributes}
            {...listeners}
            className="absolute right-2 top-2 grid h-10 w-10 touch-none place-items-center rounded-xl bg-white/95 text-slate-700 shadow-md backdrop-blur active:cursor-grabbing"
            aria-label="Kéo để thay đổi thứ tự"
            title="Kéo để thay đổi thứ tự"
          >
            <span className="grid grid-cols-2 gap-0.5">
              {Array.from({ length: 6 }).map((_, dot) => (
                <i
                  key={dot}
                  className="h-1 w-1 rounded-full bg-current"
                />
              ))}
            </span>
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <div className="grid gap-3">
            {metadataKeys
              .filter((key) => Object.prototype.hasOwnProperty.call(item, key))
              .map((key) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.08em] text-slate-400">
                    {key === 'label'
                      ? 'Nhãn'
                      : key === 'title'
                        ? 'Tiêu đề'
                        : key === 'description'
                          ? 'Mô tả'
                          : key === 'note'
                            ? 'Ghi chú'
                            : key === 'kicker'
                              ? 'Kicker'
                              : 'Alt'}
                  </span>

                  {key === 'description' || key === 'note' ? (
                    <textarea
                      rows={2}
                      value={item[key] || ''}
                      onChange={(event) =>
                        onChange({ ...item, [key]: event.target.value })
                      }
                      className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-xs leading-5 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  ) : (
                    <input
                      value={item[key] || ''}
                      onChange={(event) =>
                        onChange({ ...item, [key]: event.target.value })
                      }
                      className="min-h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  )}
                </label>
              ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="min-h-10 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
            >
              Đổi ảnh
            </button>

            <button
              type="button"
              onClick={onDuplicate}
              className="grid min-h-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              aria-label="Nhân bản"
            >
              <AdminIcon name="duplicate" className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Xóa ảnh khỏi vị trí hiển thị này?')) {
                  onDelete()
                }
              }}
              className="grid min-h-10 place-items-center rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50"
              aria-label="Xóa"
            >
              <AdminIcon name="trash" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange({ ...item, src: url })}
        title={`Đổi ảnh số ${index + 1}`}
      />
    </>
  )
}

export default function SortableImageCollection({
  title,
  description,
  value,
  onChange,
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const dndContextId = useId()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 140,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const ids = useMemo(
    () => value.map((_, index) => `image-${index}`),
    [value],
  )

  function handleDragEnd(event) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)

    if (oldIndex < 0 || newIndex < 0) return

    onChange(arrayMove(value, oldIndex, newIndex))
  }

  const template = value[0] || { src: '', title: '', description: '' }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
              Kéo thả · {value.length} ảnh
            </span>
            <h3 className="mt-1 text-base font-bold tracking-[-.02em]">
              {title}
            </h3>
            {description && (
              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white"
          >
            <AdminIcon name="plus" className="h-4 w-4" />
            Thêm ảnh
          </button>
        </header>

        <div className="p-3 sm:p-4">
          <DndContext
            id={dndContextId}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {value.map((item, index) => (
                  <SortableCard
                    key={ids[index]}
                    id={ids[index]}
                    item={item}
                    index={index}
                    onChange={(next) => {
                      const copy = [...value]
                      copy[index] = next
                      onChange(copy)
                    }}
                    onDelete={() =>
                      onChange(value.filter((_, itemIndex) => itemIndex !== index))
                    }
                    onDuplicate={() => {
                      const copy = [...value]
                      copy.splice(index + 1, 0, structuredClone(item))
                      onChange(copy)
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {!value.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <strong className="block text-sm text-slate-600">
                Chưa có ảnh trong khu vực này
              </strong>
              <p className="mt-1 text-xs text-slate-400">
                Chọn “Thêm ảnh” để lấy ảnh từ Public hoặc Cloudinary.
              </p>
            </div>
          )}
        </div>
      </section>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange([...value, makeItem(template, url)])}
        title={`Thêm ảnh vào ${title}`}
      />
    </>
  )
}
