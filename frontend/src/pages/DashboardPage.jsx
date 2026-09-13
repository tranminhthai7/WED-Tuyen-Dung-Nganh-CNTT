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
        return 'bg-[#f6fbf9] text-gray-700 border-gray-100';
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
    <div className="min-h-screen bg-[#f6fbf9] flex flex-col justify-between">
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
          <div className="space-y-4">
            {apps.map((app) => (
              <div key={app.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <strong className="text-sm font-black text-gray-900 block">{app.jobTitle}</strong>
                    <span className="text-xs text-gray-500">{app.companyName}</span>
                    <div className="flex gap-4 mt-2 text-[11px] text-gray-500 font-semibold">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(app.appliedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      <Sparkles size={12} /> {app.matchScore}% Matching
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getStatusBadge(app.status)}`}>{getStatusText(app.status)}</span>
                  </div>
                </div>

                {/* Cover Letter — giống hệt bên NTD */}
                {app.coverLetter ? (
                  <div className="mt-3 p-3 bg-[#f6fbf9] rounded-xl text-xs text-gray-600 whitespace-pre-line leading-relaxed border border-gray-100">
                    <strong className="text-gray-700">Cover Letter:</strong> {app.coverLetter}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-gray-400 italic">Không có thư giới thiệu</p>
                )}

                {app.companyNote ? (
                  <div className="mt-2 p-3 bg-yellow-50/50 text-yellow-800 border border-yellow-100 rounded-xl text-xs flex items-start gap-1.5">
                    <MessageSquare size={14} className="shrink-0 mt-0.5 text-yellow-600" />
                    <span><strong>Phản hồi NTD:</strong> {app.companyNote}</span>
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-gray-400 italic">Chưa có phản hồi</p>
                )}
                {app.interview?.date && (
                  <div className="mt-2 p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900">
                    <strong className="text-blue-700">📅 Lịch phỏng vấn:</strong> {app.interview.date}{app.interview.time ? ` lúc ${app.interview.time}` : ''} {app.interview.location ? `— ${app.interview.location}` : ''} {app.interview.interviewer ? `(gặp ${app.interview.interviewer})` : ''} {app.interview.meetLink && <a href={app.interview.meetLink} target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">{app.interview.meetLink}</a>}
                    {app.interview.note && <div className="mt-1 text-blue-700/70">{app.interview.note}</div>}
                  </div>
                )}
                {app.history?.length > 0 && (
                  <details className="mt-2 text-[11px] text-gray-500"><summary className="cursor-pointer font-bold">Lịch sử cập nhật ({app.history.length})</summary>
                    <div className="mt-1 space-y-1 border-l-2 border-gray-100 pl-3">{app.history.slice(-5).reverse().map((h,i)=>(<div key={i}>{new Date(h.at).toLocaleString('vi-VN')}: {h.from} → <b>{h.to}</b> {h.companyNote ? `— ${h.companyNote}` : ''}</div>))}</div>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
