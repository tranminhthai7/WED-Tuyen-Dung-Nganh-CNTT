import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, Calendar, Clock3, Eye, FileText, MapPin, Sparkles, Users, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import { fetchJobDetail, submitApplication, aiCoverLetter, aiMatch } from '../services/jobsApi';
import useAuthStore from '../store/authStore';

export default function JobDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyStatus, setApplyStatus] = useState({ kind: 'idle', message: '' });
  const [aiCoverLoading, setAiCoverLoading] = useState(false);
  const [aiScore, setAiScore] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch job details dynamically
  const { data: job, isLoading, error, refetch } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => fetchJobDetail(slug),
  });

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: (data) => {
      setApplyStatus({ kind: 'success', message: data.message || 'Ứng tuyển thành công!' });
      refetch(); // Reload job detail to update applicants count
      setTimeout(() => {
        setShowApplyForm(false);
        setApplyStatus({ kind: 'idle', message: '' });
      }, 3000);
    },
    onError: (err) => {
      setApplyStatus({ kind: 'error', message: err.message || 'Đã xảy ra lỗi khi nộp đơn' });
    },
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!user?.cvUrl) {
      setApplyStatus({ kind: 'error', message: 'Bạn chưa có CV. Vui lòng vào Hồ sơ để tải CV trước khi ứng tuyển.' });
      return;
    }
    applyMutation.mutate({
      jobId: job.id,
      cvUrl: user.cvUrl,
      coverLetter,
    });
  };

  const handleDownloadMyCv = async () => {
    if (!user?.cvUrl) return;
    try {
      const res = await fetch(user.cvUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'CV.pdf'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch { window.open(user.cvUrl, '_blank'); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6fbf9] flex flex-col justify-between">
        <Header />
        <div className="max-w-4xl w-full mx-auto px-4 py-20 flex-grow">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-2/3" />
            <div className="h-20 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#f6fbf9] flex flex-col justify-between">
        <Header />
        <div className="max-w-xl w-full mx-auto px-4 py-20 text-center flex-grow">
          <h2 className="text-2xl font-black text-gray-900">Không tìm thấy việc làm</h2>
          <p className="text-gray-500 mt-2">Đường link có thể đã hết hạn hoặc bị xóa.</p>
          <Link to="/jobs" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const isCandidate = isAuthenticated && user?.role === 'candidate';
  const score = job.matchingScore;
  const missing = job.missingSkills || [];
  const matched = job.matchedSkills || [];

  let scoreBadgeColor = 'bg-red-50 text-red-700 border-red-100';
  let scoreColorText = 'Đỏ';
  if (score >= 70) {
    scoreBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    scoreColorText = 'Xanh';
  } else if (score >= 40) {
    scoreBadgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
    scoreColorText = 'Vàng';
  }

  return (
    <div className="min-h-screen bg-[#f6fbf9] flex flex-col justify-between">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft size={14} /> Quay lại danh sách việc làm
        </Link>

        {/* Job Header */}
        <section className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4 min-w-0">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl text-xl font-black bg-blue-50 text-blue-700">
                {job.logo || job.company?.charAt(0).toUpperCase() || 'J'}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                  {job.title}
                </h1>
                <p className="mt-1.5 text-base text-gray-500 font-semibold">{job.company}</p>

                <div className="flex flex-wrap gap-y-2 gap-x-4 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1 font-semibold text-gray-700"><BriefcaseBusiness size={14} /> {job.salary}</span>
                  <span className="flex items-center gap-1"><Clock3 size={14} /> Đăng {job.posted}</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {job.views} lượt xem</span>
                </div>
              </div>
            </div>

            {(!isAuthenticated || isCandidate) && (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/auth');
                  } else {
                    setShowApplyForm(true);
                  }
                }}
                disabled={showApplyForm}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-md text-sm shrink-0 text-center"
              >
                Ứng tuyển ngay
              </button>
            )}
          </div>

          {/* Unique Matching Score Section */}
          {isCandidate && typeof score === 'number' && (
            <div className={`mt-6 p-4 border rounded-2xl flex flex-col gap-2 ${scoreBadgeColor}`}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <Sparkles size={16} className="animate-pulse" />
                  <span>{score}% Kỹ năng phù hợp với bạn ({scoreColorText})</span>
                </div>
                <button disabled={aiLoading} onClick={async () => { setAiLoading(true); try { const r = await aiMatch(user?.skills || [], job.requirements || []); setAiScore(r); } catch {} finally { setAiLoading(false); } }} className="text-[11px] font-bold px-2.5 py-1 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50">{aiLoading ? 'Đang tính...' : aiScore ? 'Tính lại AI' : '✨ Tính bằng AI'}</button>
              </div>
              {aiScore && (
                <div className={`text-xs rounded-xl px-3 py-2 border ${aiScore.source === 'ai' ? 'bg-violet-50 border-violet-200 text-violet-800' : 'bg-[#f6fbf9] border-gray-200 text-gray-600'}`}>
                  <span className="font-bold">AI: {aiScore.score}%</span> · {aiScore.reason} <span className="text-[10px]">({aiScore.source === 'ai' ? 'Gemini' : 'fallback'})</span>
                  {aiScore.aliasMatches?.length > 0 && <span className="block text-[11px] opacity-75">Alias: {aiScore.aliasMatches.join(', ')}</span>}
                </div>
              )}
              {score === 0 && (
                <p className="text-xs font-medium opacity-80">Bạn chưa chọn kỹ năng nào ở <Link to="/candidate/profile" className="underline font-bold">Hồ sơ</Link> nên chưa tính được độ khớp.</p>
              )}
              <div className="grid sm:grid-cols-2 gap-3 text-xs mt-1">
                <div>
                  <span className="font-semibold block text-gray-700 mb-1">Kỹ năng khớp:</span>
                  {matched.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {matched.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold">{s}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Không có</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold block text-gray-700 mb-1">Kỹ năng còn thiếu:</span>
                  {missing.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {missing.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-semibold">{s}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Không có (Đã khớp hoàn toàn!)</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Apply Form Overlay */}
        {showApplyForm && (
          <section className="bg-white border-2 border-blue-500 rounded-3xl p-6 sm:p-8 shadow-lg mb-6 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                <span>Nộp đơn ứng tuyển</span>
              </h2>
              <button onClick={() => setShowApplyForm(false)} className="text-xs text-gray-400 hover:text-gray-600 font-semibold">
                Đóng
              </button>
            </div>

            {applyStatus.kind === 'success' && (
              <div className="mb-4 flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold border border-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>{applyStatus.message}</span>
              </div>
            )}

            {applyStatus.kind === 'error' && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-2xl text-xs font-semibold border border-red-100">
                <span>{applyStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700">CV của bạn (từ Hồ sơ)</span>
                {user?.cvUrl ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <span className="flex items-center gap-2 text-sm font-semibold text-blue-700"><FileText size={16} className="shrink-0" /> CV.pdf</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" onClick={handleDownloadMyCv} className="inline-flex items-center justify-center text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 leading-none">Tải CV.pdf</button>
                      <a href={`https://docs.google.com/gview?url=${encodeURIComponent(user.cvUrl)}&embedded=true`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center text-xs font-bold px-3 py-2 bg-white border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 leading-none">Xem</a>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-800">Bạn chưa tải CV. <Link to="/candidate/profile" className="font-bold underline">Vào Hồ sơ để tải CV</Link> trước khi ứng tuyển.</div>
                )}
              </div>

              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-700">Thư giới thiệu (Cover Letter)</span>
                  <button type="button" disabled={aiCoverLoading} onClick={async () => { setAiCoverLoading(true); setApplyStatus({ kind: 'idle', message: '' }); try { const r = await aiCoverLetter(job.slug); setCoverLetter(r.text); } catch (e) { setApplyStatus({ kind: 'error', message: e.message }); } finally { setAiCoverLoading(false); } }} className="text-[11px] font-bold px-2.5 py-1 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center gap-1"><Sparkles size={12} />{aiCoverLoading ? 'Đang viết...' : '✨ Viết bằng AI'}</button>
                </div>
                <textarea
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Giới thiệu bản thân và lý do bạn phù hợp với công việc này..."
                  className="px-3 py-2 bg-[#f6fbf9] border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800"
                />
              </label>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-[#f6fbf9]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm"
                >
                  {applyMutation.isPending ? 'Đang gửi...' : 'Nộp đơn tuyển'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Job Content Body */}
        <section className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm grid md:grid-cols-[1fr_250px] gap-8">
          {/* Main Description */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-gray-900 border-l-4 border-blue-600 pl-2">Mô tả công việc</h3>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description || `Chúng tôi đang tìm kiếm một ${job.title} gia nhập đội ngũ. Bạn sẽ tham gia vào việc phát triển hệ thống và phối hợp cùng các bộ phận thiết kế, sản phẩm để mang đến trải nghiệm tuyệt vời cho người dùng.`}
              </p>
            </div>

            <div>
              <h3 className="text-base font-black text-gray-900 border-l-4 border-blue-600 pl-2">Yêu cầu kỹ năng</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.requirements?.map((req) => (
                  <span key={req} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Meta Info */}
          <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 space-y-5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-400" />
              <div>
                <span className="block font-semibold text-gray-800">{job.applicants} Ứng viên</span>
                <span className="block opacity-75">Đã nộp đơn qua itmatch</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness size={16} className="text-gray-400" />
              <div>
                <span className="block font-semibold text-gray-800">{job.type}</span>
                <span className="block opacity-75">Loại hình làm việc</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gray-400" />
              <div>
                <span className="block font-semibold text-gray-800">{job.level}</span>
                <span className="block opacity-75">Cấp bậc công việc</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <div>
                <span className="block font-semibold text-gray-800">
                  {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                </span>
                <span className="block opacity-75">Hạn nộp hồ sơ</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
