import App from '../../App.jsx'
import { getPublicSiteContent } from '../../lib/content'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage({ params }) {
  const resolved = await params
  const segments = resolved?.path || []
  const initialPath = segments.length ? `/${segments.join('/')}` : '/'
  const content = await getPublicSiteContent()

  return <App initialContent={content} initialPath={initialPath} />
}
