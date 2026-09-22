'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ease = [0.22, 0.61, 0.36, 1]

export default function SelectedWorkVexereSlider({ slides = [], metrics = [] }) {
  const safeSlides = slides?.length ? slides : [{ src: '/vexere-activation.png', label: 'Activation', title: 'Partnership activation', description: 'On-site partnership activation.' }]
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [orientation, setOrientation] = useState('auto')
  const slide = safeSlides[active]

  useEffect(() => setOrientation('auto'), [active])
  useEffect(() => {
    if (paused || safeSlides.length < 2) return undefined
    const timer = window.setInterval(() => setActive((current) => (current + 1) % safeSlides.length), 4600)
    return () => window.clearInterval(timer)
  }, [paused, safeSlides.length])

  const detectOrientation = (event) => {
    const image = event.currentTarget
    if (!image.naturalWidth || !image.naturalHeight) return
    const ratio = image.naturalWidth / image.naturalHeight
    setOrientation(ratio < 0.88 ? 'portrait' : ratio > 1.16 ? 'landscape' : 'square')
  }
  const previous = () => setActive((current) => current === 0 ? safeSlides.length - 1 : current - 1)
  const next = () => setActive((current) => (current + 1) % safeSlides.length)

  return (
    <motion.div className="sw8-slider" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, ease }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <header className="sw8-header"><span>VEXERE / PARTNERSHIP MARKETING</span><span>Q2 / 2026</span></header>
      <div className="sw8-layout">
        <div className={`sw8-media is-${orientation}`}>
          <AnimatePresence mode="wait"><motion.figure key={slide.src} className="sw8-figure" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.5, ease }}><div className="sw8-photo-shell"><img src={slide.src} alt="" aria-hidden="true" className="sw8-backdrop" /><div className="sw8-light-wash" aria-hidden="true" /><motion.img src={slide.src} alt={slide.title} className="sw8-photo" onLoad={detectOrientation} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, ease }} /></div></motion.figure></AnimatePresence>
        </div>
        <aside className="sw8-info">
          <AnimatePresence mode="wait"><motion.div key={`info-${active}`} className="sw8-info-main" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.4, ease }}><div className="sw8-info-top"><span className="sw8-chip">{slide.label}</span><span className="sw8-count">{String(active + 1).padStart(2, '0')} / {String(safeSlides.length).padStart(2, '0')}</span></div><h4>{slide.title}</h4><p>{slide.description}</p></motion.div></AnimatePresence>
          <motion.div className="sw8-metrics" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>{metrics.map((metric) => <motion.div key={metric.label} className="sw8-metric" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }} whileHover={{ y: -3 }}><strong>{metric.value}</strong><span>{metric.label}</span></motion.div>)}</motion.div>
          <div className="sw8-controls"><div className="sw8-dots">{safeSlides.map((item, index) => <button key={`${item.src}-${index}`} type="button" className={active === index ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`}><span /></button>)}</div><div className="sw8-arrows"><motion.button type="button" onClick={previous} aria-label="Previous image" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></motion.button><motion.button type="button" onClick={next} aria-label="Next image" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></motion.button></div></div>
        </aside>
      </div>
      {!paused && safeSlides.length > 1 && <motion.div key={active} className="sw8-progress" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.6, ease: 'linear' }} />}
    </motion.div>
  )
}
