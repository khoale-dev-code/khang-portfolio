import { motion } from 'framer-motion'

const workAreas = [
  'CRM & Excel',
  'Customer insights',
  'Campaign coordination',
  'Engagement tracking',
]

const responsibilities = [
  'Supported 10-15 daily lead engagements across customer touchpoints.',
  'Updated 20-30 weekly lead records in CRM and Excel.',
  'Collected customer insights and feedback for targeted communication.',
  'Assisted with campaign coordination and engagement tracking.',
]

const ease = [0.22, 0.61, 0.36, 1]

export default function GeneraliExperienceSpotlight() {
  return (
    <section
      id="generali-highlight"
      className="genx-section"
    >
      <div className="genx-shell">

        <motion.div
          className="genx-top"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.55,
            ease,
          }}
        >
          <div className="genx-label">
            <span>05.1</span>
            <i />
            <span>Experience highlight</span>
          </div>

          <div className="genx-top-note">
            Marketing & Sales / Customer Engagement
          </div>
        </motion.div>


        <div className="genx-card">

          <motion.div
            className="genx-media"
            initial={{
              opacity: 0,
              x: -18,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.62,
              ease,
            }}
          >
            <div className="genx-photo-stage">

              <img
                src="/generali-team.png"
                alt=""
                aria-hidden="true"
                className="genx-photo-bg"
              />

              <div
                className="genx-photo-wash"
                aria-hidden="true"
              />

              <motion.img
                src="/generali-team.png"
                alt="Generali Vietnam team"
                className="genx-photo"
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

              <div className="genx-photo-caption">
                <span>Team environment</span>
                <strong>Generali Vietnam</strong>
              </div>

            </div>
          </motion.div>


          <div className="genx-content">

            <motion.div
              className="genx-heading"
              initial={{
                opacity: 0,
                y: 14,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                ease,
              }}
            >
              <div className="genx-meta">
                <span>MARKETING & SALES INTERN</span>
                <span>MAR 2023 - JUL 2023</span>
              </div>

              <h2>
                Customer touchpoints,
                <br />
                <span>organized follow-up.</span>
              </h2>

              <p>
                At Generali Vietnam, I supported lead engagement,
                customer-data updates, feedback collection and campaign
                coordination across day-to-day marketing and sales activities.
              </p>
            </motion.div>


            <motion.div
              className="genx-numbers"
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
                  },
                },
              }}
            >

              <motion.article
                className="genx-number-card"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 10,
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
                  y: -4,
                }}
              >
                <span>Daily</span>

                <strong>
                  10-15
                </strong>

                <p>
                  lead engagements supported across customer touchpoints
                </p>
              </motion.article>


              <motion.article
                className="genx-number-card"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 10,
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
                  y: -4,
                }}
              >
                <span>Weekly</span>

                <strong>
                  20-30
                </strong>

                <p>
                  lead records updated in CRM and Excel
                </p>
              </motion.article>

            </motion.div>


            <div className="genx-bottom">

              <motion.div
                className="genx-responsibilities"
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
                  duration: 0.5,
                  delay: 0.08,
                  ease,
                }}
              >
                <span className="genx-subtitle">
                  What I supported
                </span>

                <div className="genx-list">
                  {responsibilities.map((item, index) => (
                    <div
                      className="genx-list-item"
                      key={item}
                    >
                      <span>
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <p>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>


              <motion.div
                className="genx-stack"
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
                  duration: 0.5,
                  delay: 0.15,
                  ease,
                }}
              >
                <span className="genx-subtitle">
                  Working areas
                </span>

                <div className="genx-tags">
                  {workAreas.map((item) => (
                    <motion.span
                      key={item}
                      whileHover={{
                        y: -2,
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}