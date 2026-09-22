'use client'

import { useEffect, useState } from 'react'

const fallbackSlides = [
  { src: '/vexere-activation.png', kicker: 'Activation', title: 'Partnership activation', description: 'On-site partnership campaign execution.' },
  { src: '/vexere-booth.png', kicker: 'On-site', title: 'Brand presence', description: 'Vexere brand presence during campaign activation.' },
  { src: '/vexere-team-studio.png', kicker: 'Team', title: 'Campaign collaboration', description: 'Team collaboration behind partnership marketing work.' },
]

export default function CampaignCarousel({ slides = fallbackSlides }) {
  const safeSlides = slides?.length ? slides : fallbackSlides
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncReduceMotion = () => {
      setReduceMotion(mediaQuery.matches)
    }

    syncReduceMotion()

    mediaQuery.addEventListener?.('change', syncReduceMotion)

    return () => {
      mediaQuery.removeEventListener?.('change', syncReduceMotion)
    }
  }, [])

  useEffect(() => {
    setActive((current) => Math.min(current, safeSlides.length - 1))
  }, [safeSlides.length])

  useEffect(() => {
    if (paused || reduceMotion || safeSlides.length < 2) return undefined
    const id = window.setInterval(() => setActive((current) => (current + 1) % safeSlides.length), 4200)
    return () => window.clearInterval(id)
  }, [paused, reduceMotion, safeSlides.length])

  const previous = () => setActive((current) => (current - 1 + safeSlides.length) % safeSlides.length)
  const next = () => setActive((current) => (current + 1) % safeSlides.length)

  return (
    <div className="vexere-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="vexere-carousel__viewport">
        {safeSlides.map((slide, index) => (
          <figure className={`vexere-carousel__slide ${index === active ? 'is-active' : ''}`} key={`${slide.src}-${index}`} aria-hidden={index !== active}>
            <img className="vexere-carousel__blur" src={slide.src} alt="" aria-hidden="true" />
            <img className="vexere-carousel__image" src={slide.src} alt={slide.title} loading={index === 0 ? 'eager' : 'lazy'} />
            <div className="vexere-carousel__shade" aria-hidden="true" />
            <figcaption className="vexere-carousel__caption"><span>{slide.kicker}</span><strong>{slide.title}</strong><p>{slide.description}</p></figcaption>
          </figure>
        ))}
        <div className="vexere-carousel__top"><span className="vexere-carousel__counter">{String(active + 1).padStart(2, '0')} / {String(safeSlides.length).padStart(2, '0')}</span><div className="vexere-carousel__dots" aria-label="Campaign gallery">{safeSlides.map((slide, index) => <button type="button" key={`${slide.src}-${index}`} className={index === active ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`Show campaign image ${index + 1}`} aria-current={index === active ? 'true' : undefined}><span /></button>)}</div></div>
        <div className="vexere-carousel__controls"><button type="button" onClick={previous} aria-label="Previous image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button><button type="button" onClick={next} aria-label="Next image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
        {!reduceMotion && !paused && safeSlides.length > 1 && <div className="vexere-carousel__progress" key={active} aria-hidden="true" />}
      </div>
    </div>
  )
}
