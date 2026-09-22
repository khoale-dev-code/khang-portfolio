import AdminShell from '../../../components/admin/AdminShell'
import { requireAdmin } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardLayout({ children }) {
  const admin = await requireAdmin()

  const adminView = {
    display_name: admin.display_name || 'Administrator',
    userId: admin.userId,
  }

  return <AdminShell admin={adminView}>{children}</AdminShell>
}
