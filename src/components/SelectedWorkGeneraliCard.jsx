import { motion } from 'framer-motion'

const metrics = [
  {
    value: '10-15',
    label: 'Daily lead engagements',
  },
  {
    value: '20-30',
    label: 'Weekly CRM / Excel updates',
  },
]

const tags = [
  'Customer communication',
  'CRM & Excel',
  'Customer insights',
  'Campaign coordination',
]

const ease = [0.22, 0.61, 0.36, 1]

export default function SelectedWorkGeneraliCard() {
  return (
    <motion.article
      className="project-card project-card-generali"
      initial={{
        opacity: 0,
        y: 26,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.14,
      }}
      transition={{
        duration: 0.65,
        ease,
      }}
    >
      <div className="project-card-grid generali-work-grid">

        <div className="generali-work-copy">

          <div className="generali-work-meta">
            <span>03 / 03</span>
            <span>MARKETING & SALES / GENERALI</span>
          </div>


          <div className="generali-work-copy-main">

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.48,
                delay: 0.08,
                ease,
              }}
            >
              <span className="generali-work-role">
                Marketing & Sales Intern / Mar 2023 - Jul 2023
              </span>

              <h3>
                10-15 daily engagements.
                <br />
                <span>20-30 weekly updates.</span>
              </h3>

              <p>
                Supported customer engagement, CRM and Excel updates,
                customer insight collection, campaign coordination and
                engagement tracking at Generali Vietnam.
              </p>
            </motion.div>


            <a
              href="#experience"
              className="generali-work-link"
            >
              <span>VIEW ROLE DETAILS</span>

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M7 17 17 7M9 7h8v8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

          </div>

        </div>


        <div className="generali-work-visual">

          <div className="generali-work-panel">

            <div className="generali-work-panel-head">
              <div>
                <span>GENERALI VIETNAM</span>
                <strong>Customer engagement support</strong>
              </div>

              <span>2023</span>
            </div>


            <motion.div
              className="generali-work-media"
              whileHover={{
                scale: 0.995,
              }}
              transition={{
                duration: 0.28,
              }}
            >
              <img
                src="/generali-team.png"
                alt=""
                aria-hidden="true"
                className="generali-work-bg"
              />

              <div
                className="generali-work-wash"
                aria-hidden="true"
              />

              <motion.img
                src="/generali-team.png"
                alt="Generali Vietnam team"
                className="generali-work-photo"
                initial={{
                  opacity: 0,
                  scale: 0.97,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.7,
                  ease,
                }}
              />
            </motion.div>


            <motion.div
              className="generali-work-results"
              initial="hidden"
              whileInView="show"
              viewport={{
                once: true,
              }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.12,
                  },
                },
              }}
            >

              {metrics.map((metric) => (
                <motion.div
                  className="generali-work-metric"
                  key={metric.label}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 8,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                        ease,
                      },
                    },
                  }}
                  whileHover={{
                    y: -3,
                  }}
                >
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </motion.div>
              ))}

            </motion.div>


            <div className="generali-work-tags">
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{
                    y: -2,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

          </div>

        </div>

      </div>
    </motion.article>
  )
}