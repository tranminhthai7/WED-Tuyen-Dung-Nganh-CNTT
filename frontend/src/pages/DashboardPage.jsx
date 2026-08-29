import { useQuery } from '@tanstack/react-query';
import { Briefcase, Calendar, CheckCircle2, FileText, MessageSquare, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import { fetchMyApplications } from '../services/jobsApi';

export default function DashboardPage() {
  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications,
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'interview':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'viewed':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Được nhận';
      case 'rejected':
        return 'Từ chối';
      case 'interview':
        return 'Mời phỏng vấn';
      case 'viewed':
        return 'Đã xem CV';
      default:
        return 'Đã nộp đơn';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Ứng viên</p>
          <h1 className="text-3xl font-black text-gray-900 mt-1">Đơn ứng tuyển của tôi</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
            <strong className="block text-2xl font-black text-gray-900">{apps.length}</strong>
            <span className="block mt-1 text-xs text-gray-500 font-medium">Đơn đã nộp</span>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
            <strong className="block text-2xl font-black text-gray-900">
              {apps.filter((a) => a.status === 'pending' || a.status === 'viewed').length}
            </strong>
            <span className="block mt-1 text-xs text-gray-500 font-medium font-medium">Đang xét duyệt</span>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
            <strong className="block text-2xl font-black text-gray-900">
              {apps.filter((a) => a.status === 'interview').length}
            </strong>
            <span className="block mt-1 text-xs text-gray-500 font-medium">Lịch phỏng vấn</span>
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded-2xl w-full" />
            <div className="h-20 bg-gray-200 rounded-2xl w-full" />
          </div>
        ) : apps.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <Briefcase size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 text-lg">Chưa nộp đơn ứng tuyển nào</h3>
            <p className="text-xs text-gray-500 mt-2">
              Khám phá các việc làm đang tuyển và nộp đơn ngay để nhận được lời mời phỏng vấn!
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    <th className="px-6 py-4">Công việc</th>
                    <th className="px-6 py-4">Ngày nộp</th>
                    <th className="px-6 py-4">Matching Score</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Phản hồi của NTD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                  {apps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <strong className="block text-gray-900 font-bold">{app.jobTitle}</strong>
                          <span className="block text-xs text-gray-500 mt-0.5">{app.companyName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                          <Sparkles size={12} />
                          {app.matchScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusBadge(app.status)}`}>
                          {getStatusText(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {app.companyNote ? (
                          <span className="flex items-start gap-1 p-2 bg-yellow-50/50 rounded-xl text-yellow-800 max-w-xs leading-normal">
                            <MessageSquare size={14} className="shrink-0 mt-0.5 text-yellow-600" />
                            <span>{app.companyNote}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Chưa có phản hồi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-16 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          © 2026 itmatch. Một sản phẩm tuyển dụng công nghệ độc lập cho sinh viên CNTT.
        </div>
      </footer>
    </div>
  );
}
