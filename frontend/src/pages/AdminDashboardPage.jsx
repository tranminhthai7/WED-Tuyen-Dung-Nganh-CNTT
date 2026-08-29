import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Users, Briefcase, FileCheck, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import { fetchDashboardStats } from '../services/jobsApi';

export default function AdminDashboardPage() {
  const { data: stats = { candidates: 4520, employers: 320, jobs: 1840, applications: 9680 }, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchDashboardStats,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Hệ thống</p>
          <h1 className="text-3xl font-black text-gray-900 mt-1">Dashboard quản trị Admin</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium">Ứng viên</span>
              <strong className="block text-2xl font-black text-gray-900 mt-0.5">{stats.candidates}</strong>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium">Nhà tuyển dụng</span>
              <strong className="block text-2xl font-black text-gray-900 mt-0.5">{stats.employers}</strong>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium">Việc làm đang mở</span>
              <strong className="block text-2xl font-black text-gray-900 mt-0.5">{stats.jobs}</strong>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
              <FileCheck size={20} />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium">Đơn ứng tuyển</span>
              <strong className="block text-2xl font-black text-gray-900 mt-0.5">{stats.applications}</strong>
            </div>
          </div>
        </div>

        {/* Moderation Panel */}
        <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-8">
          <h2 className="font-black text-gray-900 text-lg mb-6">Yêu cầu cần phê duyệt</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  <th className="px-6 py-4">Nội dung yêu cầu</th>
                  <th className="px-6 py-4">Số lượng chờ duyệt</th>
                  <th className="px-6 py-4">Hành động cần làm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">Tin đăng mới chờ duyệt</td>
                  <td className="px-6 py-4 font-semibold text-amber-600">24 tin đăng</td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Xem danh sách</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">Tài khoản doanh nghiệp chưa xác thực</td>
                  <td className="px-6 py-4 font-semibold text-amber-600">17 doanh nghiệp</td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Xác thực ngay</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">Hồ sơ ứng viên báo xấu (Report)</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">0 hồ sơ</td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400 italic">Đã xử lý xong</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-16 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          © 2026 itmatch. Một sản phẩm tuyển dụng công nghệ độc lập cho sinh viên CNTT.
        </div>
      </footer>
    </div>
  );
}
