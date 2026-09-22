'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import SelectedWorkGeneraliCard from './components/SelectedWorkGeneraliCard'
import SelectedWorkAcademicSlider from './components/SelectedWorkAcademicSlider'
import CampaignCarousel from './components/CampaignCarousel'
import SelectedWorkVexereSlider from './components/SelectedWorkVexereSlider'
import { defaultSiteContent } from './data/default-site-content'
import { deepMerge, isSectionVisible, projectByKey, projectBySlug, splitLines } from './lib/cms'

const CmsContext = createContext(defaultSiteContent)
const useCms = () => useContext(CmsContext)

function getSiteAvatarUrl(site) {
  const value =
    typeof site?.avatarUrl === 'string'
      ? site.avatarUrl.trim()
      : ''

  return value || defaultSiteContent.site.avatarUrl
}

function handleAvatarError(event) {
  const image = event.currentTarget

  if (image.dataset.fallbackApplied === 'true') return

  image.dataset.fallbackApplied = 'true'
  image.src = defaultSiteContent.site.avatarUrl
}

const ArrowUpRight = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const ArrowLeft = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path d="m15 18-6-6 6-6M9 12h11" />
  </svg>
)

const MenuIcon = ({ open }) => (
  <span className="relative block h-4 w-5" aria-hidden="true">
    <span className={`absolute left-0 top-1 h-px w-5 bg-current transition-transform duration-300 ${open ? 'translate-y-1 rotate-45' : ''}`} />
    <span className={`absolute left-0 top-3 h-px w-5 bg-current transition-transform duration-300 ${open ? '-translate-y-1 -rotate-45' : ''}`} />
  </span>
)

function useRoute(initialPath = '/') {
  const [pathname, setPathname] = useState(initialPath)

  useEffect(() => {
    setPathname(window.location.pathname)
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (path) => {
    if (window.location.pathname === path) return
    window.history.pushState({}, '', path)
    setPathname(path)
    window.scrollTo(0, 0)
  }

  return { pathname, navigate }
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}

function useRevealObserver(dependency) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = [...document.querySelectorAll('[data-reveal]')]
    if (reduceMotion) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.13, rootMargin: '0px 0px -8% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [dependency])
}

function CustomCursor() {
  const cursorRef = useRef(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    document.body.classList.add('has-custom-cursor')

    let frame
    const move = (event) => {
      if (!cursorRef.current) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      })
      const target = event.target.closest?.('[data-cursor]')
      setLabel(target?.dataset.cursor || '')
    }

    const leave = () => cursorRef.current?.classList.add('cursor-hidden')
    const enter = () => cursorRef.current?.classList.remove('cursor-hidden')

    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    return () => {
      cancelAnimationFrame(frame)
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [])

  return (
    <div ref={cursorRef} className={`custom-cursor ${label ? 'cursor-expanded' : ''}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}

function SectionLabel({ index, children, inverse = false }) {
  return (
    <div className={`section-label ${inverse ? 'text-white/45' : 'text-neutral-500'}`} data-reveal>
      <span>{index}</span>
      <span className={`h-px w-9 ${inverse ? 'bg-white/20' : 'bg-neutral-300'}`} />
      <span>{children}</span>
    </div>
  )
}

function WordLoop() {
  const { hero } = useCms()
  const words = useMemo(() => hero.rotationWords?.length ? hero.rotationWords : ['STRATEGY'], [hero.rotationWords])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % words.length), 1900)
    return () => window.clearInterval(timer)
  }, [words])

  return (
    <span className="word-window" aria-live="polite">
      <span key={words[index]} className="word-swap">{words[index]}</span>
    </span>
  )
}

function VexereProjectPreview({ project }) {
  const gallery = project?.gallery || []
  const metrics = project?.sliderMetrics || []
  return (
    <div className="vexere-preview is-case" aria-label="Vexere partnership marketing photo preview">
      <div className="vexere-preview-head"><span>{project?.eyebrow}</span><span>Q2 / 2026</span></div>
      <div className="vexere-photo-grid">
        <figure className="vexere-photo vexere-photo-main">
          <img src={gallery[0]?.src || '/vexere-activation.png'} alt={gallery[0]?.title || 'Vexere partnership marketing activation'} />
          <figcaption><span>Activation</span><strong>{gallery[0]?.title || 'Selected work environment'}</strong></figcaption>
        </figure>
        <div className="vexere-photo-stack">
          <figure className="vexere-photo vexere-photo-portrait"><img src={gallery[2]?.src || '/vexere-team-studio.png'} alt={gallery[2]?.title || 'Vexere internship team'} /></figure>
          <figure className="vexere-photo vexere-photo-booth"><img src={gallery[1]?.src || '/vexere-booth.png'} alt={gallery[1]?.title || 'Vexere branded booth'} /></figure>
        </div>
      </div>
      <div className="vexere-metric-row">
        {metrics.slice(0, 4).map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}
      </div>
    </div>
  )
}

function AcademicProjectPreview({ project }) {
  const gallery = project?.gallery || []
  const teamMetric = project?.sliderMetrics?.find((item) => /team/i.test(item.label))
  const projectName = project?.facts?.find((item) => item.label === 'Project')?.value || 'Succulent Planting Event'
  return (
    <div className="academic-preview is-case" aria-label="Academic project photo preview">
      <div className="academic-preview-main">
        <img src={gallery[0]?.src || '/academic-event-booth.jpg'} alt={gallery[0]?.title || 'Succulent planting event booth'} />
      </div>
      <div className="academic-preview-side">
        <div className="academic-preview-card metric-card"><span>Team</span><strong>{teamMetric?.value || '05'}</strong><small>members led</small></div>
        <div className="academic-preview-card image-card"><img src={gallery[1]?.src || '/academic-event-team.jpg'} alt={gallery[1]?.title || 'Succulent planting event group photo'} /></div>
      </div>
      <div className="academic-preview-badge badge-a"><span>Project</span><strong>{projectName}</strong></div>
      <div className="academic-preview-badge badge-b"><span>Promotion</span><strong>4 channels / 50 participants</strong></div>
    </div>
  )
}

function VexereProjectGallery({ gallery = [] }) {
  if (!gallery.length) return null
  return (
    <section className="vexere-gallery-section">
      <div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <SectionLabel index="02">Selected campaign photos</SectionLabel>
        <div className="vexere-gallery-intro" data-reveal>
          <h2>From reporting numbers to real activation moments.</h2>
          <p>Selected photos add context to the internship experience while the case study keeps the measurable outcomes front and center.</p>
        </div>
        <div className="vexere-gallery-grid">
          {gallery.map((item, index) => (
            <figure className={`vexere-gallery-item vexere-gallery-item-${index + 1}`} key={`${item.src}-${index}`} data-reveal>
              <div className="vexere-gallery-media"><img src={item.src} alt={item.title} /></div>
              <figcaption><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.title}</strong><p>{item.note}</p></div></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function AcademicProjectGallery({ gallery = [] }) {
  if (!gallery.length) return null
  return (
    <section className="case-gallery-section">
      <div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <SectionLabel index="02">Event gallery</SectionLabel>
        <div className="academic-gallery-grid">
          {gallery.map((item, index) => (
            <figure className={`academic-gallery-item ${index === 0 ? 'is-large' : 'is-small'}`} key={`${item.src}-${index}`} data-reveal>
              <div className="academic-gallery-media"><img src={item.src} alt={item.title} /></div>
              <figcaption><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><p>{item.note}</p></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function PhoneCampaignMockup({ project }) {
  const stats = project?.stats || []
  const campaign = stats.find((item) => /campaign/i.test(item.label))?.value || '16'
  const reach = stats.find((item) => /reach/i.test(item.label))?.value || '39.8K'
  const kpi = stats.find((item) => /kpi/i.test(item.label))?.value || '167%'
  return (
    <div className="phone-stage" aria-label="Conceptual social campaign mobile mockup">
      <div className="phone-shell">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-brand"><span>VK / CAMPAIGN</span><span>•••</span></div>
          <div className="phone-visual"><span className="phone-no">{campaign}</span><span className="phone-label">PARTNERSHIP<br />ACTIVATIONS</span></div>
          <div className="phone-copy"><strong>Build the connection.<br />Measure the outcome.</strong><span>PARTNERSHIP / PERFORMANCE / 2026</span></div>
        </div>
      </div>
      <div className="floating-note note-a"><span>REACH</span><strong>{reach}</strong></div>
      <div className="floating-note note-b"><span>KPI</span><strong>{kpi}</strong></div>
    </div>
  )
}

function Header({ progress, menuOpen, setMenuOpen }) {
  const content = useCms()
  const { navigation, site } = content
  const [scrolled, setScrolled] = useState(false)
  const navItems = (navigation.items || []).filter((item) => !item.section || isSectionVisible(content, item.section))

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="header-progress" style={{ transform: `scaleX(${progress})` }} />
        <div className="mx-auto flex h-[74px] max-w-[1540px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="brand-mark" data-cursor="TOP" onClick={() => setMenuOpen(false)}>
            <span className="brand-orb brand-avatar"><img src={getSiteAvatarUrl(site)} onError={handleAvatarError} alt={`${site.name} avatar`} /></span>
            <span className="hidden sm:block">{site.name}</span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => <a key={item.label} href={item.href} data-cursor="GO" className="nav-link">{item.label}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <a href={`mailto:${site.email}`} data-cursor="MAIL" className="magnetic-button hidden sm:inline-flex">{navigation.ctaLabel} <ArrowUpRight /></a>
            <button type="button" className="menu-button lg:hidden" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><MenuIcon open={menuOpen} /></button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mx-auto flex h-full max-w-[1540px] flex-col justify-between px-5 pb-8 pt-28 sm:px-8">
          <nav aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="mobile-nav-link"><span>{item.label}</span><span>{String(index + 1).padStart(2, '0')}</span></a>
            ))}
          </nav>
          <div className="flex items-end justify-between border-t border-neutral-300 pt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500"><span>{site.role}</span><span>{site.location} / {site.year}</span></div>
        </div>
      </div>
    </>
  )
}

function HeroProofCard({ value, label }) {
  return <div className="hero-proof-card" data-reveal><span>{label}</span><strong>{value}</strong></div>
}

function Hero() {
  const { hero, site } = useCms()
  const avatarUrl = site.avatarUrl || '/cvimg-000.png'

  return (
    <section id="top" className="hero-section hero-section-v84">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow-a" aria-hidden="true" />
      <div className="hero-glow hero-glow-b" aria-hidden="true" />

      <div className="hero-layout-v84 relative mx-auto max-w-[1540px] px-5 pb-8 pt-[104px] sm:px-8 sm:pb-10 lg:px-12 lg:pb-12 lg:pt-[112px]">
        <div className="hero-content-v84">
          <div>
            <div className="hero-meta hero-enter hero-enter-1">
              <span className="status-dot status-dot-coral" />
              <span>{hero.status}</span>
              <span className="hidden md:inline">{hero.availability}</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 hero-enter hero-enter-2">
              {hero.pills?.map((item) => (
                <span className="hero-pill" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="hero-message-v84">
              <div className="hero-kicker hero-enter hero-enter-2">
                {hero.kicker}
              </div>

              <h1
                className="hero-title marketing-title"
                aria-label={hero.titleLines?.map((line) => line.text).join(' ')}
              >
                {hero.titleLines?.map((line) => (
                  <span
                    key={line.text}
                    className={`hero-line ${line.accent ? 'hero-line-accent' : ''}`}
                  >
                    <span>{line.text}</span>
                  </span>
                ))}
              </h1>

              <p className="hero-rotation hero-enter hero-enter-3">
                {hero.rotationPrefix} <WordLoop /> {hero.rotationSuffix}
              </p>

              <p className="hero-copy hero-enter hero-enter-4">
                {hero.copy}
              </p>
            </div>

            <div className="hero-actions-v84 flex flex-wrap gap-4 hero-enter hero-enter-5">
              <a
                href={hero.primaryCta?.href || '#work'}
                className="primary-cta"
                data-cursor={hero.primaryCta?.cursor || 'VIEW'}
              >
                {hero.primaryCta?.label}
                <ArrowUpRight />
              </a>

              <a
                href={hero.secondaryCta?.href || site.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="secondary-cta"
                data-cursor={hero.secondaryCta?.cursor || 'PDF'}
              >
                {hero.secondaryCta?.label}
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>

        <div className="hero-visual-v84">
          <div
            className="hero-stage hero-enter hero-enter-3"
            data-cursor="HELLO"
          >
            <div className="hero-stage-top">
              <span>{hero.stageTopLeft}</span>
              <span>{hero.stageTopRight}</span>
            </div>

            <div className="hero-stage-photo">
              <img
                src={avatarUrl}
                alt={site.name}
                className="portrait-image"
                onError={(event) => {
                  if (!event.currentTarget.src.endsWith('/cvimg-000.png')) {
                    event.currentTarget.src = '/cvimg-000.png'
                  }
                }}
              />

              <div className="portrait-soft" />

              {hero.floatingCards?.map((item, index) => (
                <div
                  key={item.label}
                  className={`hero-floating-card ${index === 0 ? 'card-one' : 'card-two'}`}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="hero-stage-bottom">
              {hero.stageBottom?.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-stats-v84">
          {hero.proofItems?.map((item) => (
            <HeroProofCard
              key={item.label}
              value={item.value}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SelectedProjectCard({ card, index, openCase }) {
  const content = useCms()
  if (card.projectKey === 'generali') return <SelectedWorkGeneraliCard content={card} />

  const project = projectByKey(content, card.projectKey)
  if (!project) return null

  const isDark = card.theme === 'dark'
  return (
    <article className={`project-card ${isDark ? 'project-card-dark' : 'project-card-light'}`} style={{ '--stack-index': index }}>
      <div className="project-card-grid">
        <div className="project-copy">
          <div><span className="project-no">{card.number}</span><span className="project-type">{card.type}</span></div>
          <div>
            <h3>{card.titleLines?.map((line) => <span key={line}>{line}<br /></span>)}<em>{card.accent}</em></h3>
            <p>{card.description}</p>
            <button type="button" onClick={() => openCase(project.slug)} className={`project-link ${isDark ? '' : 'dark-link'}`} data-cursor="OPEN">View case study <ArrowUpRight className="size-5" /></button>
          </div>
        </div>
        <div className={`project-visual ${card.projectKey === 'vexere' ? 'project-visual-dashboard selected-vexere-visual' : 'selected-academic-visual'}`}>
          {card.projectKey === 'vexere' ? <SelectedWorkVexereSlider slides={project.sliderSlides} metrics={project.sliderMetrics} /> : <SelectedWorkAcademicSlider slides={project.sliderSlides} metrics={project.sliderMetrics} />}
        </div>
      </div>
    </article>
  )
}

function normalizeCredentialText(value, fallback = '') {
  const normalized = String(value ?? '').trim()
  return normalized || String(fallback ?? '').trim()
}

function mergeCredentialObject(defaultValue, currentValue) {
  if (
    currentValue &&
    typeof currentValue === 'object' &&
    !Array.isArray(currentValue)
  ) {
    return {
      ...defaultValue,
      ...currentValue,
    }
  }

  return {
    ...defaultValue,
  }
}

function CredentialsProof({ skills }) {
  const defaultSkills = defaultSiteContent.skills || {}

  const education = mergeCredentialObject(
    defaultSkills.education || {},
    skills?.education,
  )

  const certifications = mergeCredentialObject(
    defaultSkills.certifications || {},
    skills?.certifications,
  )

  const shortName = normalizeCredentialText(
    education.shortName,
    defaultSkills.education?.shortName,
  )

  let school = normalizeCredentialText(
    education.school,
    defaultSkills.education?.school,
  )

  if (
    shortName &&
    school.toUpperCase().endsWith(shortName.toUpperCase())
  ) {
    school = school
      .slice(0, -shortName.length)
      .trim()
  }

  const degree = normalizeCredentialText(
    education.degree,
    defaultSkills.education?.degree,
  )

  const period = normalizeCredentialText(
    education.period,
    defaultSkills.education?.period,
  )

  const primaryCertification = normalizeCredentialText(
    certifications.primary,
    defaultSkills.certifications?.primary,
  )

  const certificationTags =
    Array.isArray(certifications.tags) &&
    certifications.tags.length
      ? certifications.tags
      : defaultSkills.certifications?.tags || []

  return (
    <div
      className="skills-v2-proof credentials-proof"
      data-reveal
    >
      <article className="skills-proof-card education-card credentials-card credentials-card--education">
        <div className="credentials-card__top">
          <span className="credentials-card__index">
            {normalizeCredentialText(
              education.index,
              defaultSkills.education?.index,
            )}
          </span>

          <span className="credentials-card__kicker">
            {normalizeCredentialText(
              education.kicker,
              defaultSkills.education?.kicker,
            )}
          </span>
        </div>

        <div className="credentials-card__body">
          <span className="credentials-card__label">
            {normalizeCredentialText(
              education.label,
              defaultSkills.education?.label,
            )}
          </span>

          <h3 className="credentials-card__title">
            <span>{school}</span>
            {shortName && (
              <em>{shortName}</em>
            )}
          </h3>

          <div className="credentials-card__meta">
            <div>
              <span>Degree</span>
              <strong>{degree}</strong>
            </div>

            <div>
              <span>Period</span>
              <strong>{period}</strong>
            </div>
          </div>
        </div>
      </article>

      <article className="skills-proof-card certification-card credentials-card credentials-card--certification">
        <div className="credentials-card__top">
          <span className="credentials-card__index">
            {normalizeCredentialText(
              certifications.index,
              defaultSkills.certifications?.index,
            )}
          </span>

          <span className="credentials-card__kicker">
            {normalizeCredentialText(
              certifications.kicker,
              defaultSkills.certifications?.kicker,
            )}
          </span>
        </div>

        <div className="credentials-card__body">
          <span className="credentials-card__label">
            {normalizeCredentialText(
              certifications.label,
              defaultSkills.certifications?.label,
            )}
          </span>

          <h3 className="credentials-card__title credentials-card__title--certification">
            {primaryCertification}
          </h3>

          <div className="credentials-card__tags">
            {certificationTags.map((item, index) => (
              <span key={`${item}-${index}`}>
                <i aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div
          className="credentials-card__orb"
          aria-hidden="true"
        />
      </article>
    </div>
  )
}

function HomePage({ navigate }) {
  const content = useCms()
  const { ticker, about, impact, work, campaignOps, experience, skills, contact, site } = content
  const [menuOpen, setMenuOpen] = useState(false)
  const progress = useScrollProgress()
  useRevealObserver('home')

  const openCase = (slug) => navigate(`/case-study/${slug}`)

  return (
    <div className="min-h-screen overflow-x-clip text-neutral-950">
      <CustomCursor />
      <Header progress={progress} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />

        {isSectionVisible(content, 'ticker') && <div className="kinetic-strip" aria-hidden="true"><div className="kinetic-track">{[0, 1].map((set) => <div className="flex shrink-0 items-center" key={set}>{ticker.items?.map((item) => <span className="kinetic-item" key={`${set}-${item}`}>{item}<i className="kinetic-separator" aria-hidden="true" /></span>)}</div>)}</div></div>}

        {isSectionVisible(content, 'about') && <section id="about" className="section-shell">
          <div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
            <SectionLabel index={about.sectionIndex}>{about.sectionLabel}</SectionLabel>
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-3" data-reveal><p className="max-w-[16rem] text-sm leading-6 text-neutral-500">{about.sideNote}</p></div>
              <div className="lg:col-span-9">
                <h2 className="statement-title" data-reveal>{about.statementBefore} <span>{about.statementAccent}</span> {about.statementAfter}</h2>
                <div className="mt-12 grid gap-7 border-t border-neutral-300 pt-7 md:grid-cols-2" data-reveal>{about.featureNotes?.map((item) => <div className="feature-note" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>
                <div className="mt-7 grid gap-7 md:grid-cols-2" data-reveal>{about.paragraphs?.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}</div>
              </div>
            </div>
          </div>
        </section>}

        {isSectionVisible(content, 'impact') && <section id="impact" className="impact-section">
          <div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-36">
            <SectionLabel index={impact.sectionIndex} inverse>{impact.sectionLabel}</SectionLabel>
            <div className="impact-heading-row"><h2 data-reveal>{splitLines(impact.title).map((line, index) => <span key={`${line}-${index}`}>{line}{index < splitLines(impact.title).length - 1 && <br />}</span>)}</h2><p data-reveal>{impact.description}</p></div>
            <div className="impact-grid" data-reveal>{impact.stats?.map((item, index) => <div className="impact-stat" key={item.label}><span className="impact-index">{String(index + 1).padStart(2, '0')}</span><strong>{item.value}</strong><div><b>{item.label}</b><span>{item.sub}</span></div></div>)}</div>
          </div>
        </section>}

        {isSectionVisible(content, 'work') && <section id="work" className="work-section">
          <div className="mx-auto max-w-[1540px] px-5 pb-28 pt-24 sm:px-8 md:pb-36 md:pt-32 lg:px-12 lg:pb-44">
            <SectionLabel index={work.sectionIndex}>{work.sectionLabel}</SectionLabel>
            <div className="selected-work-head">
              <div className="selected-work-head-main" data-reveal><span className="selected-work-kicker">{work.kicker}</span><h2 className="selected-work-title">{splitLines(work.titleBefore).map((line) => <span key={line}>{line}<br /></span>)}<span>{work.titleAccent}</span></h2></div>
              <div className="selected-work-head-side" data-reveal><p>{work.description}</p><div className="selected-work-summary">{work.summary?.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{splitLines(item.label).map((line) => <span key={line}>{line}<br /></span>)}</span></div>)}</div></div>
            </div>
            <div className="project-stack">{work.cards?.map((card, index) => <SelectedProjectCard key={card.projectKey} card={card} index={index} openCase={openCase} />)}</div>
          </div>
        </section>}

        {isSectionVisible(content, 'campaignOps') && <section className="campaign-ops-section">
          <div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
            <SectionLabel index={campaignOps.sectionIndex}>{campaignOps.sectionLabel}</SectionLabel>
            <div className="campaign-ops-layout">
              <div className="campaign-ops-copy">
                <div data-reveal><span className="campaign-ops-eyebrow">{campaignOps.eyebrow}</span><h2>{splitLines(campaignOps.titleBefore).map((line) => <span key={line}>{line}<br /></span>)}<span>{campaignOps.titleAccent}</span></h2><p className="campaign-ops-intro">{campaignOps.intro}</p></div>
                <div className="campaign-flow">{campaignOps.flow?.map((step) => <article className="campaign-flow-step" data-reveal key={step.number}><div className="campaign-flow-number"><span>{step.number}</span></div><div><span className="campaign-flow-label">{step.label}</span><h3>{step.title}</h3><p>{step.description}</p></div></article>)}</div>
              </div>
              <div className="campaign-proof-panel" data-reveal>
                <div className="campaign-proof-header"><div><span>{campaignOps.panelKicker}</span><strong>{campaignOps.panelTitle}</strong></div><span className="campaign-proof-status">{campaignOps.panelStatus}</span></div>
                <CampaignCarousel slides={campaignOps.slides} />
                <div className="campaign-proof-message"><div><span>{campaignOps.proofKicker}</span><strong>{splitLines(campaignOps.proofTitle).map((line) => <span key={line}>{line}<br /></span>)}</strong></div><p>{campaignOps.proofDescription}</p></div>
                <div className="campaign-proof-metrics">{campaignOps.metrics?.map((metric) => <div className="campaign-proof-metric" key={metric.index}><span>{metric.index}</span><strong>{metric.value}</strong><small>{metric.label}</small></div>)}</div>
              </div>
            </div>
          </div>
        </section>}

        {isSectionVisible(content, 'experience') && <section id="experience" className="experience-section experience-section--redesign">
          <div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
            <SectionLabel index={experience.sectionIndex}>{experience.sectionLabel}</SectionLabel>
            <div className="experience-layout">
              <div className="experience-intro" data-reveal><div className="experience-intro__sticky"><span className="experience-kicker">{experience.kicker}</span><h2 className="experience-title">{splitLines(experience.title).map((line) => <span key={line}>{line}<br /></span>)}</h2><p className="experience-summary">{experience.summary}</p><div className="experience-overview">{experience.overview?.map((item) => <div className="experience-overview__card" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></div></div>
              <div className="experience-stack">{experience.items?.map((item, index) => <article key={`${item.company}-${index}`} className="experience-card" data-reveal><div className="experience-card__rail" aria-hidden="true"><span className="experience-card__dot" /><span className="experience-card__line" /></div><div className="experience-card__meta"><span className="experience-card__index">{String(index + 1).padStart(2, '0')}</span><span className="experience-card__period">{item.period}</span></div><div className="experience-card__body"><div className="experience-card__header"><span className="experience-card__role">{item.role}</span><h3>{item.company}</h3></div><ul className="experience-card__list">{item.bullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></article>)}</div>
            </div>
          </div>
        </section>}

        {isSectionVisible(content, 'skills') && <section id="skills" className="skills-v2-section">
          <div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
            <SectionLabel index={skills.sectionIndex}>{skills.sectionLabel}</SectionLabel>
            <div className="skills-v2-header"><div data-reveal><span className="skills-v2-eyebrow">{skills.eyebrow}</span><h2 className="skills-v2-title">{splitLines(skills.titleBefore).map((line, index, lines) => <span key={`${line}-${index}`}>{index === lines.length - 1 ? <span>{line}</span> : line}{index < lines.length - 1 && <br />}</span>)}</h2></div><div className="skills-v2-header-side" data-reveal><p>{skills.description}</p><div className="skills-v2-focus">{skills.focus?.map((item) => <span key={item}>{item}</span>)}</div></div></div>
            <div className="skills-v2-grid">{skills.groups?.map((group, index) => <article key={group.title} className={`skills-v2-card skills-v2-card-${index + 1}`} data-reveal><div className="skills-v2-card-top"><span className="skills-v2-number">{group.number}</span><span className="skills-v2-count">{String(group.items?.length || 0).padStart(2, '0')} capabilities</span></div><div><h3>{group.title}</h3><div className="skills-v2-items">{group.items?.map((item) => <span className="skills-v2-item" key={item}>{item}</span>)}</div></div></article>)}</div>
            <CredentialsProof skills={skills} />
          </div>
        </section>}

        {isSectionVisible(content, 'contact') && <section id="contact" className="contact-section contact-section--light">
          <div className="contact-grid-bg" aria-hidden="true" /><div className="contact-orb contact-orb-a" aria-hidden="true" /><div className="contact-orb contact-orb-b" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1540px] px-5 py-20 sm:px-8 md:py-24 lg:px-12 lg:py-28">
            <span className="tiny-label contact-kicker" data-reveal>{contact.sectionIndex} / {contact.sectionLabel}</span>
            <div className="contact-shell" data-reveal>
              <div className="contact-shell__left"><span className="contact-eyebrow">{contact.eyebrow}</span><h2 className="contact-title">{splitLines(contact.titleBefore).map((line) => <span key={line}>{line}<br /></span>)}<span>{contact.titleAccent}</span></h2><p className="contact-intro">{contact.intro}</p><div className="contact-chip-row">{contact.chips?.map((item) => <span key={item}>{item}</span>)}</div></div>
              <div className="contact-shell__right">
                <a href={`mailto:${site.email}`} className="contact-card" data-cursor="MAIL"><div className="contact-card__text"><span>{contact.email?.label}</span><strong>{contact.email?.value || site.email}</strong><p>{contact.email?.description}</p></div><div className="contact-card__icon" aria-hidden="true"><ArrowUpRight /></div></a>
                <a href={`tel:${site.phoneHref}`} className="contact-card" data-cursor="CALL"><div className="contact-card__text"><span>{contact.phone?.label}</span><strong>{contact.phone?.value || site.phoneDisplay}</strong><p>{contact.phone?.description}</p></div><div className="contact-card__icon" aria-hidden="true"><ArrowUpRight /></div></a>
                <a href={site.cvUrl} target="_blank" rel="noopener noreferrer" className="contact-card" data-cursor="PDF"><div className="contact-card__text"><span>{contact.cv?.label}</span><strong>{contact.cv?.value}</strong><p>{contact.cv?.description}</p></div><div className="contact-card__icon" aria-hidden="true"><ArrowUpRight /></div></a>
              </div>
            </div>
            <div className="contact-footer"><div className="contact-footer__meta"><span>{contact.footerLeft}</span><span>{contact.footerRight}</span></div><a href="#top" className="contact-toplink"><span>{contact.backToTop}</span><ArrowUpRight /></a></div>
          </div>
        </section>}
      </main>
    </div>
  )
}

function CaseStudyPage({ project, navigate }) {
  const content = useCms()
  const { caseStudy, site } = content
  const progress = useScrollProgress()
  useRevealObserver(project.slug)
  const goHome = () => navigate('/')
  const isVexere = project.key === 'vexere'

  return (
    <div className="case-page min-h-screen text-neutral-950">
      <CustomCursor />
      <header className="case-header"><div className="header-progress" style={{ transform: `scaleX(${progress})` }} /><div className="mx-auto flex h-[74px] max-w-[1540px] items-center justify-between px-5 sm:px-8 lg:px-12"><button type="button" onClick={goHome} className="case-back" data-cursor="BACK"><ArrowLeft /><span>{caseStudy.backLabel}</span></button><span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:inline">{caseStudy.headerLabel}</span><a href={`mailto:${site.email}`} className="nav-link" data-cursor="MAIL">{caseStudy.contactLabel}</a></div></header>
      <main>
        <section className="case-hero"><div className="hero-grid" aria-hidden="true" /><div className="relative mx-auto max-w-[1540px] px-5 pb-16 pt-32 sm:px-8 md:pb-24 md:pt-36 lg:px-12 lg:pb-28"><div className="case-eyebrow hero-enter hero-enter-1"><span className="status-dot" />{project.eyebrow}</div><h1 className="case-title hero-enter hero-enter-2">{project.title}</h1><div className="case-intro-grid hero-enter hero-enter-3"><p>{project.intro}</p><span>{project.company}</span></div></div></section>
        <section className="case-visual-block"><div className="mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12" data-reveal><div className="case-visual-frame">{isVexere ? <VexereProjectPreview project={project} /> : <AcademicProjectPreview project={project} />}</div><p className="case-disclaimer">{caseStudy.disclaimer}</p></div></section>
        {isVexere ? <VexereProjectGallery gallery={project.gallery} /> : <AcademicProjectGallery gallery={project.gallery} />}
        <section className="case-facts-section"><div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12"><SectionLabel index={caseStudy.overviewIndex}>{caseStudy.overviewLabel}</SectionLabel><div className="case-facts-grid" data-reveal>{project.facts?.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></div></section>
        <section className="case-dark-section"><div className="mx-auto max-w-[1540px] px-5 py-24 text-white sm:px-8 md:py-32 lg:px-12 lg:py-36"><SectionLabel index={caseStudy.outcomesIndex} inverse>{caseStudy.outcomesLabel}</SectionLabel><div className="case-stat-grid" data-reveal>{project.stats?.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></div></section>
        <section className="case-content-section"><div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40"><div className="case-content-row" data-reveal><div><span className="tiny-label">{caseStudy.ownedLabel}</span><h2>{caseStudy.ownedTitle}</h2></div><ul>{project.responsibilities?.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="case-content-row" data-reveal><div><span className="tiny-label">{caseStudy.resultLabel}</span><h2>{caseStudy.resultTitle}</h2></div><ul>{project.outcomes?.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>
        {isVexere && <section className="case-phone-section"><div className="mx-auto grid max-w-[1540px] gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-12 lg:px-12 lg:py-40"><div className="lg:col-span-5" data-reveal><span className="tiny-label">{caseStudy.visualLabel}</span><h2 className="mockup-title mt-5">{caseStudy.visualTitle}</h2><p className="mt-6 max-w-md text-sm leading-6 text-neutral-500">{caseStudy.visualDescription}</p></div><div className="lg:col-span-7" data-reveal><PhoneCampaignMockup project={project} /></div></div></section>}
        <section className="case-next-section"><div className="mx-auto max-w-[1540px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-36"><span className="tiny-label" data-reveal>{caseStudy.endLabel}</span><button type="button" onClick={goHome} className="case-next" data-cursor="BACK" data-reveal><span>{caseStudy.backToWork}</span><ArrowUpRight className="size-8" /></button></div></section>
      </main>
    </div>
  )
}

function PortfolioRouter({ initialPath }) {
  const content = useCms()
  const { pathname, navigate } = useRoute(initialPath)
  const slug = pathname.startsWith('/case-study/') ? pathname.replace('/case-study/', '') : ''
  const project = slug ? projectBySlug(content, slug) : null

  useEffect(() => {
    if (!project && pathname !== '/' && pathname.startsWith('/case-study/')) {
      window.history.replaceState({}, '', '/')
    }
  }, [pathname, project])

  if (project) return <CaseStudyPage project={project} navigate={navigate} />
  return <HomePage navigate={navigate} />
}

export default function App({ initialContent = defaultSiteContent, initialPath = '/' }) {
  const content = useMemo(() => deepMerge(defaultSiteContent, initialContent), [initialContent])
  return <CmsContext.Provider value={content}><PortfolioRouter initialPath={initialPath} /></CmsContext.Provider>
}
