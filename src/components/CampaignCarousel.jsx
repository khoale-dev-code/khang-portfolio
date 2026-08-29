import { useEffect, useMemo, useState } from 'react'

const slides = [
  {
    src: '/vexere-activation.png',
    kicker: 'Activation',
    title: 'Partnership activation',
    description: 'On-site partnership campaign execution.',
  },
  {
    src: '/vexere-booth.png',
    kicker: 'On-site',
    title: 'Brand presence',
    description: 'Vexere brand presence during campaign activation.',
  },
  {
    src: '/vexere-team-studio.png',
    kicker: 'Team',
    title: 'Campaign collaboration',
    description: 'Team collaboration behind partnership marketing work.',
  },
]

export default function CampaignCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (paused || reduceMotion) return undefined

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 4200)

    return () => window.clearInterval(id)
  }, [paused, reduceMotion])

  const previous = () => {
    setActive((current) => (current - 1 + slides.length) % slides.length)
  }

  const next = () => {
    setActive((current) => (current + 1) % slides.length)
  }

  return (
    <div
      className="vexere-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="vexere-carousel__viewport">
        {slides.map((slide, index) => (
          <figure
            className={`vexere-carousel__slide ${index === active ? 'is-active' : ''}`}
            key={slide.src}
            aria-hidden={index !== active}
          >
            <img
              className="vexere-carousel__blur"
              src={slide.src}
              alt=""
              aria-hidden="true"
            />

            <img
              className="vexere-carousel__image"
              src={slide.src}
              alt={slide.title}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            <div className="vexere-carousel__shade" aria-hidden="true" />

            <figcaption className="vexere-carousel__caption">
              <span>{slide.kicker}</span>
              <strong>{slide.title}</strong>
              <p>{slide.description}</p>
            </figcaption>
          </figure>
        ))}

        <div className="vexere-carousel__top">
          <span className="vexere-carousel__counter">
            {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>

          <div className="vexere-carousel__dots" aria-label="Campaign gallery">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.src}
                className={index === active ? 'is-active' : ''}
                onClick={() => setActive(index)}
                aria-label={`Show campaign image ${index + 1}`}
                aria-current={index === active ? 'true' : undefined}
              >
                <span />
              </button>
            ))}
          </div>
        </div>

        <div className="vexere-carousel__controls">
          <button type="button" onClick={previous} aria-label="Previous image">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button type="button" onClick={next} aria-label="Next image">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {!reduceMotion && !paused && (
          <div className="vexere-carousel__progress" key={active} aria-hidden="true" />
        )}
      </div>
    </div>
  )
}