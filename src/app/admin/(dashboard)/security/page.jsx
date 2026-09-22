import AdminPageHeader from '../../../../components/admin/AdminPageHeader'
import ChangePasswordForm from '../../../../components/admin/ChangePasswordForm'

export default function AdminSecurityPage() {
  return (
    <div className="mx-auto max-w-[980px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        eyebrow="Tài khoản"
        title="Bảo mật"
        description="Quản lý mật khẩu dùng để truy cập Portfolio CMS."
      />

      <ChangePasswordForm />

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <strong className="block text-sm font-bold text-slate-800">
          Đăng nhập chỉ bằng mật khẩu
        </strong>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Email quản trị được giữ ở phía server. Màn hình đăng nhập chỉ yêu cầu mật khẩu, nhưng Supabase Auth vẫn chịu trách nhiệm xác thực.
        </p>
      </section>
    </div>
  )
}
