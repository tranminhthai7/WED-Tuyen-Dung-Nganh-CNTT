import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, UserRound, Phone, FileText, Briefcase, GraduationCap, Github, Linkedin, Sparkles, AlertCircle, Camera, UploadCloud, X, Award, Target, TrendingUp, Search, ChevronDown, Trash2, Eye, Download, Crown } from 'lucide-react';
import Header from '../components/Header';
import { getProfile, updateProfile, uploadAvatar, uploadCv } from '../services/authApi';
import { fetchSkills } from '../services/jobsApi';
import useAuthStore from '../store/authStore';

export default function ProfilePage() {
  const { updateUser } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', phone: '', cvUrl: '', experience: '', education: '', bio: '', github: '', linkedin: '', avatar: '' });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [saveStatus, setSaveStatus] = useState({ kind: 'idle', message: '' });
  const [upAvatar, setUpAvatar] = useState(false);
  const [upCv, setUpCv] = useState(false);
  const [cvFullscreen, setCvFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [openCats, setOpenCats] = useState({});

  const { data: profileData, isLoading: profileLoading } = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  const { data: skills = [], isLoading: skillsLoading } = useQuery({ queryKey: ['skills'], queryFn: fetchSkills });

  useEffect(() => {
    if (profileData?.user) {
      const u = profileData.user;
      setFormData({ name: u.name || '', phone: u.phone || '', cvUrl: u.cvUrl || '', experience: u.experience || '', education: u.education || '', bio: u.bio || '', github: u.github || '', linkedin: u.linkedin || '', avatar: u.avatar || '' });
      setSelectedSkills(u.skills || []);
    }
  }, [profileData]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => { setSaveStatus({ kind: 'success', message: data.message || 'Cập nhật hồ sơ thành công!' }); updateUser(data.user); setTimeout(() => setSaveStatus({ kind: 'idle', message: '' }), 3000); },
    onError: (err) => setSaveStatus({ kind: 'error', message: err.message || 'Đã xảy ra lỗi khi lưu' }),
  });

  const completeness = useMemo(() => {
    const checks = [
      !!formData.name.trim(),
      !!formData.phone.trim(),
      !!formData.avatar,
      !!formData.cvUrl,
      !!formData.experience.trim(),
      !!formData.education.trim(),
      !!formData.bio.trim() && formData.bio.length > 20,
      !!(formData.github || formData.linkedin),
      selectedSkills.length >= 3,
      selectedSkills.length >= 5,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [formData, selectedSkills]);

  const checks = [
    { ok: !!formData.avatar, label: 'Avatar' },
    { ok: !!formData.cvUrl, label: 'CV PDF' },
    { ok: selectedSkills.length >= 3, label: `Kỹ năng (${selectedSkills.length}/3)` },
    { ok: !!formData.bio.trim(), label: 'Giới thiệu' },
    { ok: !!(formData.github || formData.linkedin), label: 'GitHub/LinkedIn' },
  ];

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSkillToggle = (name) => setSelectedSkills((p) => p.includes(name) ? p.filter(s => s !== name) : [...p, name]);
  const handleAddCustomSkill = () => {
    const v = customSkill.trim(); if (!v) return;
    if (selectedSkills.some(s => s.toLowerCase() === v.toLowerCase())) { setCustomSkill(''); return; }
    setSelectedSkills(p => [...p, v]); setCustomSkill('');
  };
  const handleSubmit = (e) => { e.preventDefault(); setSaveStatus({ kind: 'idle', message: '' }); updateMutation.mutate({ ...formData, skills: selectedSkills }); };
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return; setUpAvatar(true);
    try { const r = await uploadAvatar(file); setFormData(p => ({ ...p, avatar: r.url })); updateUser(r.user); setSaveStatus({ kind: 'success', message: 'Avatar đã cập nhật!' }); } catch (err) { setSaveStatus({ kind: 'error', message: err.message }); } finally { setUpAvatar(false); }
  };
  const handleCvFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return; setUpCv(true);
    try { const r = await uploadCv(file); setFormData(p => ({ ...p, cvUrl: r.url })); updateUser(r.user); setSaveStatus({ kind: 'success', message: 'CV đã tải lên!' }); setShowPreview(true); } catch (err) { setSaveStatus({ kind: 'error', message: err.message }); } finally { setUpCv(false); }
  };
  const handleDownloadCv = async () => {
    if (!formData.cvUrl) return;
    try { const res = await fetch(formData.cvUrl); const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'CV.pdf'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); } catch { window.open(formData.cvUrl, '_blank'); }
  };

  if (profileLoading) return (
    <div className="min-h-screen bg-[#f6fbf9]"><Header /><div className="max-w-6xl mx-auto px-4 py-10 animate-pulse"><div className="h-32 bg-white rounded-3xl mb-6" /><div className="grid lg:grid-cols-[1fr_340px] gap-6"><div className="h-96 bg-white rounded-3xl" /><div className="h-96 bg-white rounded-3xl" /></div></div></div>
  );

  const categories = {}; skills.forEach(s => { if (!categories[s.category]) categories[s.category] = []; categories[s.category].push(s); });
  const filteredCats = {};
  Object.entries(categories).forEach(([cat, list]) => {
    const f = list.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()));
    if (f.length) filteredCats[cat] = f;
  });

  return (
    <div className="min-h-screen bg-[#f6fbf9] flex flex-col">
      <Header />

      <div className="relative overflow-hidden bg-[#0f2a2e] text-white">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur">
                  {formData.avatar ? <img src={formData.avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-xl font-black text-white/80">{(formData.name || 'U').slice(0, 1).toUpperCase()}</span>}
                </div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white text-[#0f2a2e] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition">
                  <Camera size={12} /><input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} disabled={upAvatar} />
                </label>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-white/10 border border-white/15 rounded-full px-2.5 py-1 backdrop-blur"><Crown size={10} className="text-amber-300" /> Hồ sơ ứng viên</div>
                <h1 className="text-[26px] font-black tracking-tight mt-2">{formData.name || 'Chưa đặt tên'}</h1>
                <p className="text-xs text-white/60 mt-0.5 flex items-center gap-2">{formData.bio ? formData.bio.slice(0, 56) + (formData.bio.length > 56 ? '…' : '') : 'Thêm giới thiệu để nhà tuyển dụng hiểu bạn hơn'} {selectedSkills.length > 0 && <span className="hidden sm:inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><Sparkles size={10} />{selectedSkills.length} kỹ năng</span>}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 lg:min-w-[360px]">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                  <circle cx="22" cy="22" r="18" fill="none" stroke={completeness >= 80 ? '#10b981' : completeness >= 50 ? '#f59e0b' : '#f87171'} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${completeness * 1.13} 113`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black leading-none">{completeness}%</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">Hoàn thiện</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold flex items-center gap-1"><TrendingUp size={12} className="text-emerald-300" /> {completeness >= 80 ? 'Hồ sơ rất tốt — sẵn sàng ứng tuyển!' : completeness >= 50 ? 'Sắp xong — thêm CV & kỹ năng' : 'Cần bổ sung để tăng matching'}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {checks.map(c => (
                    <span key={c.label} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${c.ok ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/10 text-white/70 border-white/15'}`}>
                      {c.ok ? <CheckCircle2 size={10} /> : <span className="w-2 h-2 rounded-full bg-white/40" />} {c.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {saveStatus.kind !== 'idle' && (
          <div className={`mb-4 flex items-center gap-2 p-3 rounded-2xl text-xs font-semibold border ${saveStatus.kind === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'}`}>
            {saveStatus.kind === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-red-600" />} {saveStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200/70 rounded-[22px] shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <h2 className="font-black text-gray-900 flex items-center gap-2"><span className="w-8 h-8 rounded-xl bg-[#0f2a2e] text-white grid place-items-center"><UserRound size={14} /></span> Thông tin cá nhân</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400"><span className="text-red-500">*</span> bắt buộc</span>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-gray-700">Họ và tên <span className="text-red-500">*</span></span>
                  <div className="mt-1.5 flex items-center gap-2 px-3.5 py-3 bg-white border border-gray-200 rounded-xl focus-within:border-[#0f2a2e] focus-within:ring-2 focus-within:ring-[#0f2a2e]/10 transition">
                    <UserRound size={16} className="text-gray-400" />
                    <input name="name" value={formData.name} onChange={handleChange} required placeholder="Nguyễn Văn A" className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400" />
                  </div>
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-bold text-gray-700">Số điện thoại</span>
                    <div className="mt-1.5 flex items-center gap-2 px-3.5 py-3 bg-white border border-gray-200 rounded-xl focus-within:border-[#0f2a2e] focus-within:ring-2 focus-within:ring-[#0f2a2e]/10 transition">
                      <Phone size={16} className="text-gray-400" />
                      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="09xx xxx xxx" className="w-full bg-transparent outline-none text-sm" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-gray-700">Avatar</span>
                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="relative group">
                        {formData.avatar ? (
                          <img src={formData.avatar} alt="avatar" className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-sm" />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 grid place-items-center text-gray-400 text-[10px] font-bold">No img</div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl grid place-items-center cursor-pointer transition">
                          <Camera size={14} className="text-white" /><input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                        </label>
                      </div>
                      <label className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 bg-[#0f2a2e] text-white rounded-xl hover:bg-black cursor-pointer shadow-sm">{upAvatar ? 'Đang tải…' : 'Chọn ảnh'}<input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} disabled={upAvatar} /></label>
                      {formData.avatar && <button type="button" onClick={() => setFormData(p => ({ ...p, avatar: '' }))} className="text-xs font-bold text-red-600 hover:underline">Xóa</button>}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/70 rounded-[22px] shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <h2 className="font-black text-gray-900 flex items-center gap-2"><span className="w-8 h-8 rounded-xl bg-blue-600 text-white grid place-items-center"><FileText size={14} /></span> CV & hồ sơ</h2>
                <span className="text-[11px] font-semibold text-gray-500">PDF ≤ 10MB</span>
              </div>
              <div className="px-6 pb-6 space-y-3">
                <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleCvFile({ target: { files: [f] } }); }} className={`rounded-2xl border-2 border-dashed p-5 flex flex-col sm:flex-row items-center gap-4 ${formData.cvUrl ? 'bg-emerald-50/60 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:border-[#0f2a2e]/30 hover:bg-white transition'}`}>
                  <div className={`w-12 h-12 rounded-xl grid place-items-center shrink-0 ${formData.cvUrl ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}><FileText size={18} /></div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <p className="text-sm font-bold text-gray-900">{formData.cvUrl ? 'Đã có CV — kéo PDF mới vào để thay thế' : 'Kéo & thả CV PDF vào đây'}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{formData.cvUrl || 'hoặc bấm nút bên phải để chọn file'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 bg-[#0f2a2e] text-white rounded-xl hover:bg-black cursor-pointer"><UploadCloud size={14} /> {upCv ? 'Đang tải…' : 'Chọn PDF'}<input type="file" accept=".pdf" className="hidden" onChange={handleCvFile} disabled={upCv} /></label>
                  </div>
                </div>
                {formData.cvUrl && (
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={formData.cvUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"><Eye size={14} />Mở tab mới</a>
                    <button type="button" onClick={handleDownloadCv} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"><Download size={14} />Tải về</button>
                    <button type="button" onClick={() => setShowPreview(v => !v)} className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border ${showPreview ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>{showPreview ? 'Ẩn xem trước' : 'Xem trước inline'}</button>
                    <button type="button" onClick={() => setCvFullscreen(true)} className="text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">⛶ Toàn màn hình</button>
                    <button type="button" onClick={() => { setFormData(p => ({ ...p, cvUrl: '' })); setShowPreview(false); setSaveStatus({ kind: 'success', message: 'Đã xóa CV ở form — bấm Lưu hồ sơ để lưu.' }); }} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50"><Trash2 size={14} />Xóa</button>
                  </div>
                )}
                <input name="cvUrl" value={formData.cvUrl} onChange={handleChange} placeholder="https://.../cv.pdf  — dán link nếu đã có sẵn" className="w-full px-3.5 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#0f2a2e] focus:ring-2 focus:ring-[#0f2a2e]/10 text-sm" />
                {formData.cvUrl?.startsWith('http') && showPreview && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <iframe key={formData.cvUrl} title="CV preview" src={`https://docs.google.com/gview?url=${encodeURIComponent(formData.cvUrl)}&embedded=true`} className="w-full border-0 h-[560px]" />
                  </div>
                )}
                {cvFullscreen && formData.cvUrl && (
                  <div className="fixed inset-0 z-50 bg-black/70 flex flex-col p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <button type="button" onClick={() => setCvFullscreen(false)} className="text-sm font-bold px-3 py-2 bg-white rounded-xl hover:bg-gray-100 inline-flex items-center gap-1"><X size={14} />Thu nhỏ</button>
                      <button type="button" onClick={handleDownloadCv} className="text-sm px-3 py-2 bg-blue-600 text-white rounded-xl inline-flex items-center gap-1"><Download size={14} />Tải PDF</button>
                    </div>
                    <iframe title="CV fullscreen" src={`https://docs.google.com/gview?url=${encodeURIComponent(formData.cvUrl)}&embedded=true`} className="flex-1 w-full border-0 rounded-xl bg-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200/70 rounded-[22px] shadow-sm p-6 space-y-4">
              <h2 className="font-black text-gray-900 flex items-center gap-2"><span className="w-8 h-8 rounded-xl bg-amber-500 text-white grid place-items-center"><Award size={14} /></span> Kinh nghiệm & học vấn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-gray-700">Kinh nghiệm</span>
                  <div className="mt-1.5 flex items-center gap-2 px-3.5 py-3 bg-white border border-gray-200 rounded-xl focus-within:border-[#0f2a2e] focus-within:ring-2 focus-within:ring-[#0f2a2e]/10 transition">
                    <Briefcase size={16} className="text-gray-400" /><input name="experience" value={formData.experience} onChange={handleChange} placeholder="VD: 2 năm React" className="w-full bg-transparent outline-none text-sm" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-700">Học vấn / Bằng cấp</span>
                  <div className="mt-1.5 flex items-center gap-2 px-3.5 py-3 bg-white border border-gray-200 rounded-xl focus-within:border-[#0f2a2e] focus-within:ring-2 focus-within:ring-[#0f2a2e]/10 transition">
                    <GraduationCap size={16} className="text-gray-400" /><input name="education" value={formData.education} onChange={handleChange} placeholder="VD: ĐH Bách Khoa" className="w-full bg-transparent outline-none text-sm" />
                  </div>
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Giới thiệu tóm tắt</span>
                <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} placeholder="Mục tiêu nghề nghiệp, stack bạn thích, dự án nổi bật…" className="mt-1.5 w-full px-3.5 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#0f2a2e] focus:ring-2 focus:ring-[#0f2a2e]/10 text-sm resize-none" />
                <span className="text-[11px] text-gray-400 mt-1 block">{formData.bio.length}/300 — càng chi tiết, matching càng chuẩn</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-gray-700">GitHub</span>
                  <div className="mt-1.5 flex items-center gap-2 px-3.5 py-3 bg-white border border-gray-200 rounded-xl focus-within:border-[#0f2a2e] focus-within:ring-2 focus-within:ring-[#0f2a2e]/10 transition">
                    <Github size={16} className="text-gray-400" /><input name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/you" className="w-full bg-transparent outline-none text-sm" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-700">LinkedIn</span>
                  <div className="mt-1.5 flex items-center gap-2 px-3.5 py-3 bg-white border border-gray-200 rounded-xl focus-within:border-[#0f2a2e] focus-within:ring-2 focus-within:ring-[#0f2a2e]/10 transition">
                    <Linkedin size={16} className="text-gray-400" /><input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/you" className="w-full bg-transparent outline-none text-sm" />
                  </div>
                </label>
              </div>
              <button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0f2a2e] hover:bg-black disabled:bg-gray-400 text-white font-black py-3.5 px-8 rounded-xl shadow-sm transition text-sm">
                {updateMutation.isPending ? 'Đang lưu…' : 'Lưu hồ sơ'} {!updateMutation.isPending && <CheckCircle2 size={16} />}
              </button>
              <p className="text-[11px] text-gray-400">Lưu xong sẽ cập nhật <span className="font-bold text-gray-600">Matching Score</span> ở /jobs ngay (cache 5 phút).</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/70 rounded-[22px] shadow-sm p-5 lg:sticky lg:top-6 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-1.5"><span className="w-7 h-7 rounded-lg bg-blue-600 text-white grid place-items-center"><Target size={12} /></span> Kỹ năng</h3>
              <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${selectedSkills.length >= 5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : selectedSkills.length >= 3 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{selectedSkills.length} đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-[#0f2a2e] transition">
                <Search size={14} className="text-gray-400" /><input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Tìm kỹ năng…" className="w-full bg-transparent outline-none text-xs" />
              </div>
              <button type="button" onClick={() => setSelectedSkills([])} className="text-[11px] font-bold px-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 whitespace-nowrap">Xóa hết</button>
            </div>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-blue-50/50 border border-blue-100 rounded-xl">
                {selectedSkills.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-200 rounded-full text-xs font-bold text-blue-700 shadow-sm">
                    {s}<button type="button" onClick={() => setSelectedSkills(p => p.filter(x => x !== s))} className="w-4 h-4 rounded-full bg-blue-600 text-white grid place-items-center hover:bg-red-600 transition"><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
            {skillsLoading ? (
              <div className="space-y-3 animate-pulse"><div className="h-4 bg-gray-100 rounded w-1/2" /><div className="h-20 bg-gray-100 rounded-xl" /></div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 -mr-1">
                {Object.entries(filteredCats).map(([cat, list]) => {
                  const isOpen = openCats[cat] ?? true;
                  return (
                    <div key={cat} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button type="button" onClick={() => setOpenCats(p => ({ ...p, [cat]: !isOpen }))} className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition text-left">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">{cat} <span className="ml-1 font-normal text-gray-400">({list.length})</span></span>
                        <ChevronDown size={12} className={`text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="p-2 grid grid-cols-1 gap-1">
                          {list.map(skill => {
                            const on = selectedSkills.includes(skill.name);
                            return (
                              <label key={skill.name} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer border text-xs transition ${on ? 'bg-[#0f2a2e] text-white border-[#0f2a2e]' : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'}`}>
                                <input type="checkbox" checked={on} onChange={() => handleSkillToggle(skill.name)} className="sr-only" />
                                <span className={`w-4 h-4 rounded flex items-center justify-center border ${on ? 'bg-white text-[#0f2a2e] border-white' : 'bg-white border-gray-300'}`}>{on && <CheckCircle2 size={10} />}</span>
                                <span className={`${on ? 'font-bold' : 'font-medium'}`}>{skill.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {Object.keys(filteredCats).length === 0 && <p className="text-xs text-gray-500 text-center py-6">Không tìm thấy “{skillSearch}”.</p>}
              </div>
            )}
            <div className="flex gap-2">
              <input value={customSkill} onChange={e => setCustomSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill(); } }} placeholder="Thêm kỹ năng khác, vd: Jira" className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#0f2a2e] focus:ring-2 focus:ring-[#0f2a2e]/10 text-xs" />
              <button type="button" onClick={handleAddCustomSkill} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700">Thêm</button>
            </div>
            <div className="text-[11px] leading-relaxed flex gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-900">
              <Sparkles size={14} className="shrink-0 text-amber-600 mt-0.5" />
              <span>Chọn <b>≥5 kỹ năng</b> để <b>Matching Score</b> ở <b>/jobs</b> chính xác nhất. Thêm tay nếu không thấy trong danh sách.</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
