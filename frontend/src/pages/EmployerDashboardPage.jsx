import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { BarChart3, BriefcaseBusiness, FilePlus2, Search, Users, Sparkles, CheckCircle2, Trash2, Edit2, Calendar } from 'lucide-react';
import Header from '../components/Header';
import {
  fetchMyPostings,
  createJob,
  fetchEmployerApplications,
  updateApplicationStatus,
  deleteJob,
  fetchDashboardStats,
  fetchMyCompany,
  updateMyCompany,
  uploadCompanyLogo,
} from '../services/jobsApi';

export default function EmployerDashboardPage() {
  const [section, setSection] = useState('dashboard'); // dashboard, jobs, candidates, post
  const [submitted, setSubmitted] = useState(false);

  // Form states for posting job
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    salary: '',
    mode: 'Hybrid',
    experience: '1+ năm',
    level: 'Junior',
    quantity: 1,
    tagsInput: '',
    description: '',
    deadline: '',
  });

  const [postStatus, setPostStatus] = useState({ kind: 'idle', message: '' });

  // Company profile
  const [company, setCompany] = useState({ name: '', website: '', industry: '', size: '', address: '', description: '', techStack: '' });
  const [logoUploading, setLogoUploading] = useState(false);
  const [companyMsg, setCompanyMsg] = useState('');

  // Recruiter notes update states
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [companyNote, setCompanyNote] = useState('');
  const [statusAction, setStatusAction] = useState('pending');

  // React Queries (employer APIs)
  const { data: postings = [], refetch: refetchJobs } = useQuery({
    queryKey: ['myPostings'],
    queryFn: fetchMyPostings,
  });

  const { data: candidates = [], refetch: refetchCandidates } = useQuery({
    queryKey: ['receivedApplications'],
    queryFn: fetchEmployerApplications,
  });

  const { data: stats = { activeJobs: 12, totalApplications: 236, interviewCandidates: 8 } } = useQuery({
    queryKey: ['employerStats'],
    queryFn: fetchDashboardStats,
  });
  const { data: myCompany } = useQuery({ queryKey: ['myCompany'], queryFn: fetchMyCompany });
  useEffect(() => { if (myCompany) setCompany({ name: myCompany.name || '', website: myCompany.website || '', industry: myCompany.industry || '', size: myCompany.size || '', address: myCompany.address || '', description: myCompany.description || '', techStack: (myCompany.techStack || []).join(', ') }); }, [myCompany]);

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      setPostStatus({ kind: 'success', message: data.message || 'Đăng tin thành công!' });
      refetchJobs();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSection('jobs');
        setJobForm({
          title: '',
          location: '',
          salary: '',
          mode: 'Hybrid',
          experience: '1+ năm',
          level: 'Junior',
          quantity: 1,
          tagsInput: '',
          description: '',
          deadline: '',
        });
        setPostStatus({ kind: 'idle', message: '' });
      }, 2000);
    },
    onError: (err) => {
      setPostStatus({ kind: 'error', message: err.message || 'Có lỗi xảy ra khi tạo tin' });
    },
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }) => updateApplicationStatus(id, payload),
    onSuccess: () => {
      refetchCandidates();
      setSelectedAppId(null);
      setCompanyNote('');
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      refetchJobs();
    },
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    setPostStatus({ kind: 'idle', message: '' });
    const tagsArray = jobForm.tagsInput
      ? jobForm.tagsInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    createJobMutation.mutate({
      ...jobForm,
      tags: tagsArray,
      requirements: tagsArray,
    });
  };

  const handleUpdateStatusSubmit = (appId) => {
    updateStatusMutation.mutate({
      id: appId,
      payload: {
        status: statusAction,
        companyNote,
      },
    });
  };

  const handleDeleteJob = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
      deleteJobMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          {/* Recruiter Sidebar */}
          <aside className="bg-white border border-gray-200/80 rounded-2xl p-4 h-fit shadow-sm flex flex-col gap-1.5">
            <div className="mb-4 px-3 py-2 border-b border-gray-100 pb-4">
              <p className="text-sm font-black text-gray-900">
                itmatch<span className="text-blue-600">.</span> Business
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Workspace tuyển dụng</p>
            </div>

            {[
              { key: 'dashboard', label: 'Tổng quan', Icon: BarChart3 },
              { key: 'company', label: 'Hồ sơ công ty', Icon: BriefcaseBusiness },
              { key: 'jobs', label: 'Tin tuyển dụng', Icon: BriefcaseBusiness },
              { key: 'candidates', label: 'Ứng viên', Icon: Users },
              { key: 'post', label: 'Đăng tin mới', Icon: FilePlus2 },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${section === key ? 'bg-blue-50 text-blue-700 shadow-sm border-l-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </aside>

          {/* Section Main Container */}
          <section className="min-h-[500px]">
            {section === 'company' && (
              <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900">Hồ sơ công ty</h1>
                <p className="text-xs text-gray-400 mt-1">Cập nhật thông tin để Admin duyệt hiển thị tin tuyển dụng.</p>
                {myCompany?.isVerified === false && <p className="mt-3 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">Đang chờ Admin duyệt — tin đăng sẽ ở trạng thái pending.</p>}
                {myCompany?.isVerified === true && <p className="mt-3 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">Đã xác thực ✓</p>}
                <div className="mt-6 flex items-center gap-4">
                  {myCompany?.logo ? <img src={myCompany.logo} alt="logo" className="w-16 h-16 rounded-2xl object-cover border" /> : <div className="w-16 h-16 rounded-2xl bg-gray-100 border flex items-center justify-center text-gray-400 text-xs">Logo</div>}
                  <label className="text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">{logoUploading ? 'Đang tải...' : 'Upload logo'}<input type="file" accept="image/*" className="hidden" disabled={logoUploading} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setLogoUploading(true); try { await uploadCompanyLogo(f); setCompanyMsg('Upload logo thành công!'); } catch (err) { setCompanyMsg(err.message); } finally { setLogoUploading(false); } }} /></label>
                </div>
                <form onSubmit={async (e) => { e.preventDefault(); try { await updateMyCompany({ ...company, techStack: company.techStack.split(',').map(s => s.trim()).filter(Boolean) }); setCompanyMsg('Đã lưu hồ sơ công ty!'); } catch (err) { setCompanyMsg(err.message); } }} className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1.5"><span className="text-xs font-bold text-gray-700">Tên công ty</span><input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" /></label>
                  <label className="flex flex-col gap-1.5"><span className="text-xs font-bold text-gray-700">Website</span><input value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" /></label>
                  <label className="flex flex-col gap-1.5"><span className="text-xs font-bold text-gray-700">Ngành</span><input value={company.industry} onChange={e => setCompany({ ...company, industry: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" /></label>
                  <label className="flex flex-col gap-1.5"><span className="text-xs font-bold text-gray-700">Quy mô</span><input value={company.size} onChange={e => setCompany({ ...company, size: e.target.value })} placeholder="50-200" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" /></label>
                  <label className="flex flex-col gap-1.5 md:col-span-2"><span className="text-xs font-bold text-gray-700">Địa chỉ</span><input value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" /></label>
                  <label className="flex flex-col gap-1.5 md:col-span-2"><span className="text-xs font-bold text-gray-700">Mô tả</span><textarea rows={3} value={company.description} onChange={e => setCompany({ ...company, description: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" /></label>
                  <label className="flex flex-col gap-1.5 md:col-span-2"><span className="text-xs font-bold text-gray-700">Tech stack (phẩy)</span><input value={company.techStack} onChange={e => setCompany({ ...company, techStack: e.target.value })} placeholder="React, Node.js, AWS" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" /></label>
                  <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm">Lưu hồ sơ công ty</button>
                  {companyMsg && <p className="md:col-span-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">{companyMsg}</p>}
                </form>
              </div>
            )}
            {/* 1. POST NEW JOB */}
            {section === 'post' && (
              <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900">Đăng tin tuyển dụng</h1>
                <p className="text-xs text-gray-400 mt-1">Tạo tin tuyển dụng hấp dẫn để tiếp cận ứng viên phù hợp.</p>

                {submitted && postStatus.kind === 'success' ? (
                  <div className="mt-8 rounded-2xl bg-emerald-50 text-emerald-800 p-5 text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-600" />
                    <span>{postStatus.message}</span>
                  </div>
                ) : (
                  <form onSubmit={handlePostSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
                    {postStatus.kind === 'error' && (
                      <div className="md:col-span-2 p-3 bg-red-50 text-red-800 rounded-xl text-xs font-semibold border border-red-100">
                        {postStatus.message}
                      </div>
                    )}

                    <label className="flex flex-col gap-1.5 md:col-span-2">
                      <span className="text-xs font-bold text-gray-700">Tên vị trí tuyển dụng</span>
                      <input
                        required
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        placeholder="Ví dụ: Senior Frontend Engineer"
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-gray-700">Mức lương</span>
                      <input
                        required
                        type="text"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                        placeholder="Ví dụ: 2,000 – 3,500 USD"
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-gray-700">Địa điểm làm việc</span>
                      <input
                        required
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        placeholder="Ví dụ: Hồ Chí Minh, Hà Nội"
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-gray-700">Hình thức</span>
                        <select
                          value={jobForm.mode}
                          onChange={(e) => setJobForm({ ...jobForm, mode: e.target.value })}
                          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800 cursor-pointer"
                        >
                          <option>Hybrid</option>
                          <option>On-site</option>
                          <option>Remote</option>
                        </select>
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-gray-700">Cấp bậc</span>
                        <select
                          value={jobForm.level}
                          onChange={(e) => setJobForm({ ...jobForm, level: e.target.value })}
                          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800 cursor-pointer"
                        >
                          <option>Intern</option>
                          <option>Fresher</option>
                          <option>Junior</option>
                          <option>Middle</option>
                          <option>Senior</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-gray-700">Số lượng tuyển</span>
                        <input
                          type="number"
                          min={1}
                          value={jobForm.quantity}
                          onChange={(e) => setJobForm({ ...jobForm, quantity: parseInt(e.target.value) || 1 })}
                          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800"
                        />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-gray-700">Hạn nộp</span>
                        <input
                          type="date"
                          value={jobForm.deadline}
                          onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800 cursor-pointer"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-1.5 md:col-span-2">
                      <span className="text-xs font-bold text-gray-700">Yêu cầu kỹ năng (Phân cách bằng dấu phẩy)</span>
                      <input
                        type="text"
                        value={jobForm.tagsInput}
                        onChange={(e) => setJobForm({ ...jobForm, tagsInput: e.target.value })}
                        placeholder="Ví dụ: React, TypeScript, Next.js, Git"
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 md:col-span-2">
                      <span className="text-xs font-bold text-gray-700">Mô tả công việc</span>
                      <textarea
                        required
                        rows={6}
                        value={jobForm.description}
                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                        placeholder="Mô tả chi tiết vai trò, yêu cầu và quyền lợi..."
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={createJobMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm text-sm md:col-span-2"
                    >
                      {createJobMutation.isPending ? 'Đang tạo...' : 'Đăng tuyển'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 2. MANAGE JOBS LIST */}
            {section === 'jobs' && (
              <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Tin đã đăng tuyển</h1>
                    <p className="text-xs text-gray-400 mt-1">Danh sách các tin tuyển dụng đang hoạt động của bạn.</p>
                  </div>
                  <button
                    onClick={() => setSection('post')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    + Đăng tin mới
                  </button>
                </div>

                {postings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-400">Bạn chưa đăng tin tuyển dụng nào.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {postings.map((job) => (
                      <div
                        key={job.id || job.slug}
                        className="flex items-center justify-between rounded-2xl border border-gray-100 p-5 hover:bg-gray-50/50 transition-colors"
                      >
                        <div>
                          <strong className="block text-sm font-bold text-gray-900">{job.title}</strong>
                          <span className="block mt-1 text-[11px] text-gray-400">
                            {job.location} · {job.mode} · Đăng {job.posted}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-100 rounded-lg">
                            {job.applicants} ứng viên
                          </span>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Xóa tin"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. MANAGE RECEIVED APPLICATIONS */}
            {section === 'candidates' && (
              <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900">Hồ sơ ứng viên</h1>
                <p className="text-xs text-gray-400 mt-1">Danh sách hồ sơ nộp vào các vị trí tuyển dụng của công ty.</p>

                {candidates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-400">Chưa có ứng viên nào nộp đơn ứng tuyển.</p>
                  </div>
                ) : (
                  <div className="space-y-4 mt-6">
                    {candidates.map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <strong className="text-sm font-black text-gray-900 block">{app.candidateName}</strong>
                            <p className="text-xs text-gray-400 mt-1 font-medium">
                              Ứng tuyển: <strong className="text-gray-700">{app.jobTitle}</strong>
                            </p>
                            <div className="flex gap-4 mt-2 text-[11px] text-gray-500 font-semibold">
                              <span>Email: {app.candidateEmail}</span>
                              <span>SĐT: {app.candidatePhone || 'Chưa cung cấp'}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {app.candidateSkills?.slice(0, 5).map((s) => (
                                <span key={s} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                              <Sparkles size={12} />
                              {app.matchScore}% Matching
                            </span>

                            <a
                              href={app.cvUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              Xem CV (PDF)
                            </a>
                          </div>
                        </div>

                        {app.coverLetter && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                            <strong>Cover Letter:</strong> {app.coverLetter}
                          </div>
                        )}

                        {app.companyNote && (
                          <div className="mt-2 p-3 bg-yellow-50/50 text-yellow-800 border border-yellow-100 rounded-xl text-xs">
                            <strong>Ghi chú:</strong> {app.companyNote}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-medium">
                            Nộp ngày {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                          </span>

                          {selectedAppId === app.id ? (
                            <div className="flex flex-col gap-2 w-full max-w-md pt-2">
                              <div className="flex gap-2">
                                <select
                                  value={statusAction}
                                  onChange={(e) => setStatusAction(e.target.value)}
                                  className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 bg-gray-50 cursor-pointer"
                                >
                                  <option value="viewed">Đã xem CV</option>
                                  <option value="interview">Mời phỏng vấn</option>
                                  <option value="accepted">Đồng ý nhận</option>
                                  <option value="rejected">Từ chối</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="Ghi chú thêm gửi ứng viên..."
                                  value={companyNote}
                                  onChange={(e) => setCompanyNote(e.target.value)}
                                  className="text-xs flex-grow px-3 py-1.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 bg-gray-50"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setSelectedAppId(null)}
                                  className="text-[10px] px-3 py-1.5 border rounded-lg text-gray-500 font-bold"
                                >
                                  Hủy
                                </button>
                                <button
                                  onClick={() => handleUpdateStatusSubmit(app.id)}
                                  className="text-[10px] px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
                                >
                                  Lưu phản hồi
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedAppId(app.id);
                                setStatusAction(app.status);
                                setCompanyNote(app.companyNote || '');
                              }}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              Phản hồi ứng viên
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. OVERVIEW DASHBOARD */}
            {section === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">TỔNG QUAN</p>
                  <h1 className="text-2xl font-black text-gray-900 mt-1">Bảng tổng quan tuyển dụng</h1>
                  <p className="text-xs text-gray-400 mt-1">Thông số và pipeline ứng tuyển của công ty trong tuần này.</p>
                </div>

                <div className="grid gap-4 grid-cols-3">
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-gray-400 font-medium">Tin đang tuyển</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{stats.activeJobs}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">+2 tuần này</p>
                  </div>
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-gray-400 font-medium">Tổng ứng viên nộp</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalApplications}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">+18% tháng này</p>
                  </div>
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-gray-400 font-medium">Lịch phỏng vấn</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{stats.interviewCandidates}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">Đang hoạt động</p>
                  </div>
                </div>

                {/* Performance Box */}
                <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
                  <h2 className="font-black text-gray-900 text-base mb-4">Hoạt động ứng tuyển theo tuần</h2>
                  <div className="flex h-40 items-end gap-3 pt-6">
                    {[35, 52, 44, 70, 58, 82, 68, 94, 78, 88, 72, 100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-lg bg-blue-600/70 hover:bg-blue-600 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-4">
                    <span>Thứ 2</span>
                    <span>Thứ 4</span>
                    <span>Thứ 6</span>
                    <span>Chủ nhật</span>
                  </div>
                </div>
              </div>
            )}
          </section>
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
