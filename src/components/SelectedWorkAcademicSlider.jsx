import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const slides = [
  {
    src: '/academic-event-booth.jpg',
    label: 'Event setup',
    title: 'Welcome and project presence',
    description:
      'A student-led marketing event centered on a succulent planting activity for 50 participants.',
  },
  {
    src: '/academic-event-team.jpg',
    label: 'Event day',
    title: 'Team and participants',
    description:
      'On-site event execution supported by team coordination and participant engagement.',
  },
]

const metrics = [
  ['05', 'Team members'],
  ['04', 'Promotion channels'],
  ['50', 'Participants'],
  ['01', 'Event delivered'],
]

const ease = [0.22, 0.61, 0.36, 1]

export default function SelectedWorkAcademicSlider() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const slide = slides[active]

  useEffect(() => {
    if (paused) return undefined

    const timer = window.setInterval(() => {
      setActive((current) => {
        return (current + 1) % slides.length
      })
    }, 4800)

    return () => {
      window.clearInterval(timer)
    }
  }, [paused])

  const previous = () => {
    setActive((current) => {
      return current === 0
        ? slides.length - 1
        : current - 1
    })
  }

  const next = () => {
    setActive((current) => {
      return (current + 1) % slides.length
    })
  }

  return (
    <motion.div
      className="acad4-slider"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        ease,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >

      <header className="acad4-header">

        <div className="acad4-header-main">
          <span>
            UFM / ACADEMIC MARKETING PROJECT
          </span>

          <strong>
            Succulent Planting Event
          </strong>
        </div>

        <span className="acad4-year">
          PROJECT / 2026
        </span>

      </header>


      <div className="acad4-layout">

        <div className="acad4-media">

          <AnimatePresence mode="wait">

            <motion.figure
              key={slide.src}
              className="acad4-figure"
              initial={{
                opacity: 0,
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.01,
              }}
              transition={{
                duration: 0.5,
                ease,
              }}
            >

              <div className="acad4-photo-stage">

                <img
                  src={slide.src}
                  alt=""
                  aria-hidden="true"
                  className="acad4-photo-bg"
                />

                <div
                  className="acad4-photo-wash"
                  aria-hidden="true"
                />

                <div className="acad4-safe-frame">

                  <motion.img
                    src={slide.src}
                    alt={slide.title}
                    className="acad4-photo"
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.55,
                      ease,
                    }}
                  />

                </div>

              </div>

            </motion.figure>

          </AnimatePresence>

        </div>


        <aside className="acad4-info">

          <AnimatePresence mode="wait">

            <motion.div
              key={`info-${active}`}
              className="acad4-copy"
              initial={{
                opacity: 0,
                x: 12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -8,
              }}
              transition={{
                duration: 0.38,
                ease,
              }}
            >

              <div className="acad4-copy-top">

                <span className="acad4-chip">
                  {slide.label}
                </span>

                <span className="acad4-counter">
                  {String(active + 1).padStart(2, '0')}
                  {' / '}
                  {String(slides.length).padStart(2, '0')}
                </span>

              </div>

              <h4>
                {slide.title}
              </h4>

              <p>
                {slide.description}
              </p>

            </motion.div>

          </AnimatePresence>


          <motion.div
            className="acad4-metrics"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},

              show: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}
          >

            {metrics.map(([value, label]) => (

              <motion.div
                key={label}
                className="acad4-metric"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 8,
                  },

                  show: {
                    opacity: 1,
                    y: 0,

                    transition: {
                      duration: 0.36,
                      ease,
                    },
                  },
                }}
                whileHover={{
                  y: -3,
                }}
              >

                <strong>
                  {value}
                </strong>

                <span>
                  {label}
                </span>

              </motion.div>

            ))}

          </motion.div>


          <div className="acad4-controls">

            <div className="acad4-dots">

              {slides.map((item, index) => (

                <button
                  type="button"
                  key={item.src}
                  className={
                    active === index
                      ? 'is-active'
                      : ''
                  }
                  onClick={() => setActive(index)}
                  aria-label={`Show project image ${index + 1}`}
                >
                  <span />
                </button>

              ))}

            </div>


            <div className="acad4-arrows">

              <motion.button
                type="button"
                onClick={previous}
                aria-label="Previous image"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.94 }}
              >

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M15 18 9 12l6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </motion.button>


              <motion.button
                type="button"
                onClick={next}
                aria-label="Next image"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.94 }}
              >

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="m9 18 6-6-6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </motion.button>

            </div>

          </div>

        </aside>

      </div>


      {!paused && (

        <motion.div
          key={active}
          className="acad4-progress"
          initial={{
            scaleX: 0,
          }}
          animate={{
            scaleX: 1,
          }}
          transition={{
            duration: 4.8,
            ease: 'linear',
          }}
        />

      )}

    </motion.div>
  )
}