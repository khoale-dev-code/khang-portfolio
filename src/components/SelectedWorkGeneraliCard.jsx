'use client'

export default function SelectedWorkGeneraliCard({ content = {} }) {
  const metrics = content.metrics || []
  const tags = content.tags || []
  const image = content.image || '/generali-team.png'

  return (
    <article
      className="project-card project-card-generali"
      data-reveal
    >
      <div className="project-card-grid generali-work-grid">
        <div className="generali-work-copy">
          <div className="generali-work-meta">
            <span>{content.number || '03 / 03'}</span>
            <span>{content.type || 'MARKETING & SALES / GENERALI'}</span>
          </div>

          <div className="generali-work-copy-main">
            <div className="generali-work-copy-content">
              <span className="generali-work-role">
                {content.role}
              </span>

              <h3>
                {content.title}
                <br />
                <span>{content.titleAccent}</span>
              </h3>

              <p>{content.description}</p>
            </div>

            <a
              href={content.linkHref || '#experience'}
              className="generali-work-link"
            >
              <span>{content.linkLabel || 'VIEW ROLE DETAILS'}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
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
            <div
              className="generali-work-panel-glow"
              aria-hidden="true"
            />

            <div className="generali-work-panel-head">
              <div>
                <span>{content.panelKicker}</span>
                <strong>{content.panelTitle}</strong>
              </div>
              <span>{content.year}</span>
            </div>

            <div className="generali-work-media">
              <img
                src={image}
                alt=""
                aria-hidden="true"
                className="generali-work-bg"
              />

              <div
                className="generali-work-wash"
                aria-hidden="true"
              />

              <div className="generali-work-photo-frame">
                <img
                  src={image}
                  alt="Generali Vietnam team"
                  className="generali-work-photo"
                />
              </div>

              <div className="generali-work-media-badge">
                <span>TEAM / GENERALI VIETNAM</span>
              </div>
            </div>

            <div className="generali-work-results">
              {metrics.map((metric) => (
                <div
                  className="generali-work-metric"
                  key={metric.label}
                >
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="generali-work-tags">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
