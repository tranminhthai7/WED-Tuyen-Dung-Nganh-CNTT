import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { ShieldCheck, Users, Briefcase, FileCheck, Check, X, Clock3, AlertTriangle, Sparkles, ArrowRight, RefreshCw, Search, ExternalLink, Filter, Eye, PartyPopper, Layers, TrendingUp, MessageSquare, ArrowUpCircle } from 'lucide-react';
import Header from '../components/Header';
import { fetchDashboardStats, fetchAdminCompanies, verifyCompany, fetchAdminJobs, moderateJob, fetchSkills, createSkill, deleteSkill, fetchContactRequests, updateContactRequestStatus, adminUpdateCompanyPackage } from '../services/jobsApi';

export default function AdminDashboardPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [jobStatus, setJobStatus] = useState('pending');
  const [jobSearch, setJobSearch] = useState('');
  const [toast, setToast] = useState('');
  const [preview, setPreview] = useState(null);

  const { data: stats = { candidates: 9, employers: 7, jobs: 20, applications: 20 }, refetch: refetchStats, isFetching: statsLoading } = useQuery({ queryKey: ['adminStats'], queryFn: fetchDashboardStats });
  const { data: companies = [], refetch: refetchCompanies } = useQuery({ queryKey: ['adminCompanies'], queryFn: fetchAdminCompanies });
  const { data: allAdminJobs = [], refetch: refetchAdminJobs } = useQuery({ queryKey: ['adminJobs'], queryFn: () => fetchAdminJobs() });
  const { data: skills = [] } = useQuery({ queryKey: ['adminSkills'], queryFn: fetchSkills, enabled: tab === 'skills' });
  const { data: requests = [], refetch: refetchRequests } = useQuery({ queryKey: ['adminRequests'], queryFn: fetchContactRequests });

  const [newSkill, setNewSkill] = useState({ name: '', category: 'Other' });
  const [enterpriseModal, setEnterpriseModal] = useState(null);
  const [entForm, setEntForm] = useState({ amount: '', durationDays: '365', maxJobPosts: '999', contractNote: '' });

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(''), 2600); };
  const mVerify = useMutation({ mutationFn: ({ id, v }) => verifyCompany(id, v), onSuccess: (r) => { qc.invalidateQueries({ queryKey: ['adminCompanies'] }); refetchCompanies(); showToast(r.message||'Đã cập nhật'); } });
  const mJob = useMutation({ mutationFn: ({ id, s }) => moderateJob(id, s), onSuccess: (r) => { qc.invalidateQueries({ queryKey: ['adminJobs'] }); qc.invalidateQueries({ queryKey: ['adminStats'] }); qc.invalidateQueries({ queryKey: ['jobs'] }); refetchAdminJobs(); refetchStats(); showToast(r.message||'Đã cập nhật'); } });
  const mAddSkill = useMutation({ mutationFn: createSkill, onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminSkills'] }); setNewSkill({ name: '', category: 'Other' }); } });
  const mDelSkill = useMutation({ mutationFn: deleteSkill, onSuccess: () => qc.invalidateQueries({ queryKey: ['adminSkills'] }) });

  const mReqStatus = useMutation({ mutationFn: ({ id, s }) => updateContactRequestStatus(id, s), onSuccess: (r) => { qc.invalidateQueries({ queryKey: ['adminRequests'] }); refetchRequests(); showToast(r.message||'Đã xử lý yêu cầu'); } });
  const mUpgrade = useMutation({ mutationFn: ({ id, p, ent }) => adminUpdateCompanyPackage(id, p, ent), onSuccess: (r) => { qc.invalidateQueries({ queryKey: ['adminCompanies'] }); refetchCompanies(); showToast(r.message||'Đã nâng cấp gói'); setEnterpriseModal(null); } });

  const pendingCompanies = companies.filter(c => !c.isVerified).length;
  const pendingJobs = allAdminJobs.filter(j=>j.status==='pending');
  const activeJobs = allAdminJobs.filter(j=>j.status==='active');
  const rejectedJobs = allAdminJobs.filter(j=>j.status==='rejected');
  const closedJobs = allAdminJobs.filter(j=>j.status==='closed');
  const pendingRequests = requests.filter(r=>r.status==='pending').length;
  const totalPending = pendingJobs.length + pendingCompanies + pendingRequests;

  const filteredJobs = useMemo(()=>{
    let list = allAdminJobs;
    if(jobStatus!=='all') list = list.filter(j=>j.status===jobStatus);
    if(jobSearch.trim()){
      const q = jobSearch.toLowerCase();
      list = list.filter(j=> (j.title+j.company+j.location+(j.tags||[]).join(' ')).toLowerCase().includes(q));
    }
    return list;
  }, [allAdminJobs, jobStatus, jobSearch]);

  return (
    <div className="min-h-screen bg-[#f6fbf9] flex flex-col">
      <Header />
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-bold px-5 py-3 rounded-full shadow-2xl border border-white/10 animate-[slideDown_0.3s_ease]">{toast}</div>}

      {/* HERO premium — dark gradient like header */}
      <div className="relative overflow-hidden bg-[#0f2a2e] text-white border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#16423f]/60 via-transparent to-teal-500/10" />
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize:'22px 22px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase text-teal-200 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur"><span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Hệ thống · Admin Workspace <Sparkles size={12} className="text-teal-200" /></p>
              <h1 className="text-[30px] font-black tracking-tight mt-3 leading-none">Dashboard quản trị</h1>
              <p className="text-sm text-teal-100/80 mt-2 max-w-2xl">Dữ liệu thật từ MongoDB · phê duyệt doanh nghiệp & tin đăng — vận hành như production. <span className="text-white font-bold">{totalPending===0 ? 'Hệ thống sạch, không tồn đọng ✨' : `${totalPending} việc chờ xử lý`}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-full border backdrop-blur ${totalPending>0?'bg-amber-400 text-[#0f2a2e] border-amber-300 shadow-lg shadow-amber-500/20':'bg-emerald-400 text-[#0f2a2e] border-emerald-300 shadow-lg shadow-emerald-500/20'}`}>
                {totalPending>0 ? <><Clock3 size={14}/> {totalPending} chờ xử lý</> : <><PartyPopper size={14}/> Không có việc tồn đọng</>}
              </span>
              <button onClick={()=>{refetchStats();refetchAdminJobs();refetchCompanies();refetchRequests();}} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#0f2a2e] rounded-full text-xs font-black hover:bg-teal-50 transition-colors shadow"><RefreshCw size={14} className={statsLoading?'animate-spin':''}/> Làm mới</button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { k: 'overview', l: 'Tổng quan', icon: Layers },
              { k: 'companies', l: `Doanh nghiệp`, badge: pendingCompanies, icon: ShieldCheck },
              { k: 'requests', l: `Yêu cầu tư vấn`, badge: pendingRequests, icon: MessageSquare },
              { k: 'jobs', l: `Quản lý tin`, badge: pendingJobs.length, icon: Briefcase },
              { k: 'skills', l: `Kỹ năng`, badge: skills.length, icon: Sparkles },
            ].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black border transition-all ${tab === t.k ? 'bg-white text-[#0f2a2e] border-white shadow-lg scale-[1.02]' : 'bg-white/10 text-white border-white/15 hover:bg-white/15 backdrop-blur'}`}>
                <t.icon size={14}/> {t.l} {t.badge>0 && <span className={`min-w-[20px] h-5 grid place-items-center px-1.5 rounded-full text-[11px] font-black ${tab===t.k?'bg-[#0f2a2e] text-white':'bg-amber-400 text-[#0f2a2e]'}`}>{t.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'overview' && (
          <>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { label:'Ứng viên', value:stats.candidates, icon:Users, grad:'from-blue-500 to-cyan-500', sub:'Tài khoản candidate' },
                { label:'Nhà tuyển dụng', value:stats.employers, icon:ShieldCheck, grad:'from-teal-500 to-emerald-500', sub:'Tài khoản employer' },
                { label:'Việc làm đang mở', value:activeJobs.length, icon:Briefcase, grad:'from-emerald-500 to-teal-500', sub:`${pendingJobs.length} pending · ${closedJobs.length} closed` },
                { label:'Đơn ứng tuyển', value:stats.applications, icon:FileCheck, grad:'from-amber-500 to-orange-500', sub:'Tổng application' },
              ].map(card=>(
                <div key={card.label} className="group bg-white border border-slate-200 rounded-[22px] p-5 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`size-11 grid place-items-center rounded-2xl bg-gradient-to-br ${card.grad} text-white shadow-lg`}><card.icon size={20}/></div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">{card.sub}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-4 flex items-center gap-1"><TrendingUp size={12}/> {card.label}</p>
                  <p className="text-[28px] font-black tracking-tight text-slate-900 mt-1 leading-none">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
              <div className="p-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-black text-slate-900 flex items-center gap-2 text-[15px]"><span className="size-7 grid place-items-center rounded-xl bg-amber-100 text-amber-600 border border-amber-200"><AlertTriangle size={14}/></span> Yêu cầu cần phê duyệt</h2>
                  <p className="text-xs text-slate-500 mt-1">Duyệt xong tin chuyển <b className="text-slate-700">pending → active</b> và hiện ngay ở <a href="/jobs" className="underline font-bold text-blue-600">/jobs</a> · <b>closed</b> là hết hạn ẩn khỏi /jobs.</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"><span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"/> Production-ready</span>
              </div>
              <div className="px-6 pb-6 grid sm:grid-cols-4 gap-4">
                <button onClick={()=>{setTab('jobs');setJobStatus('pending');}} className="col-span-1 group text-left p-4 rounded-2xl border flex flex-col justify-between gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <div><p className="text-xs font-black tracking-widest uppercase text-amber-700">Tin pending</p><p className="text-[28px] font-black text-amber-900 mt-1 leading-none">{pendingJobs.length}</p></div>
                  <div className="flex items-center justify-between mt-2"><p className="text-[11px] font-bold text-amber-700/60">Chưa duyệt</p><span className="size-8 grid place-items-center rounded-full bg-white border border-amber-200 text-amber-700 shadow-sm group-hover:scale-110 transition-transform"><ArrowRight size={14}/></span></div>
                </button>
                <button onClick={()=>{setTab('requests');}} className="col-span-1 group text-left p-4 rounded-2xl border flex flex-col justify-between gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <div><p className="text-xs font-black tracking-widest uppercase text-blue-700">Y/C Tư vấn</p><p className="text-[28px] font-black text-blue-900 mt-1 leading-none">{pendingRequests}</p></div>
                  <div className="flex items-center justify-between mt-2"><p className="text-[11px] font-bold text-blue-700/60">Cần liên hệ</p><span className="size-8 grid place-items-center rounded-full bg-white border border-blue-200 text-blue-700 shadow-sm group-hover:scale-110 transition-transform"><MessageSquare size={14}/></span></div>
                </button>
                <button onClick={()=>{setTab('jobs');setJobStatus('active');}} className="col-span-1 group text-left p-4 rounded-2xl border flex flex-col justify-between gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                  <div><p className="text-xs font-black tracking-widest uppercase text-emerald-700">Đã duyệt (active)</p><p className="text-[28px] font-black text-emerald-900 mt-1 leading-none">{activeJobs.length}</p></div>
                  <div className="flex items-center justify-between mt-2"><p className="text-[11px] font-bold text-emerald-700/60">Đang hiện ở /jobs</p><span className="size-8 grid place-items-center rounded-full bg-white border border-emerald-200 text-emerald-700 shadow-sm group-hover:scale-110 transition-transform"><ExternalLink size={14}/></span></div>
                </button>
                <button onClick={()=>{setTab('jobs');setJobStatus('rejected');}} className="col-span-1 group text-left p-4 rounded-2xl border flex flex-col justify-between gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all bg-slate-50 border-slate-200">
                  <div><p className="text-xs font-black tracking-widest uppercase text-slate-600">Từ chối + Closed</p><p className="text-[28px] font-black text-slate-900 mt-1 leading-none">{rejectedJobs.length + closedJobs.length}</p></div>
                  <div className="flex items-center justify-between mt-2"><p className="text-[11px] font-bold text-slate-500">Đã ẩn khỏi /jobs</p><span className="size-8 grid place-items-center rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm group-hover:scale-110 transition-transform"><X size={14}/></span></div>
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'companies' && (
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center gap-2"><span className="size-8 grid place-items-center rounded-xl bg-teal-600 text-white"><ShieldCheck size={16}/></span><div><h2 className="font-black text-slate-900">Quản lý Doanh nghiệp</h2><p className="text-xs text-slate-500">Duyệt và cấu hình thủ công gói dịch vụ của doanh nghiệp.</p></div></div>
            {companies.length === 0 ? <p className="text-sm text-slate-400 mt-6">Chưa có DN nào.</p> : (
              <div className="mt-5 space-y-3">
                {companies.map(c => (
                  <div key={c._id || c.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-2xl transition-all hover:shadow-sm ${!c.isVerified?'bg-amber-50/50 border-amber-200':'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      {c.logo ? <img src={c.logo} alt="" className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow bg-white" /> : <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-teal-700 border-2 border-white shadow flex items-center justify-center text-xs font-black text-white">{c.name?.[0]}</div>}
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate flex items-center gap-2">
                          {c.name}
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${c.isVerified?'bg-emerald-100 text-emerald-700 border-emerald-200':'bg-amber-100 text-amber-700 border-amber-200'}`}>{c.isVerified?'Đã duyệt':'Chờ duyệt'}</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border ${c.packageType==='Enterprise'?'bg-violet-100 text-violet-700 border-violet-200':c.packageType==='Pro'?'bg-teal-100 text-teal-700 border-teal-200':'bg-slate-100 text-slate-600 border-slate-200'}`}>{c.packageType || 'Free'}</span>
                        </p>
                        <p className="text-xs text-slate-500 truncate">{c.ownerId?.email || ''} · {c.address || c.industry || ''}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button onClick={() => mUpgrade.mutate({ id: c._id, p: 'Free', ent: {} })} className={`px-2 py-1 text-[10px] font-bold rounded ${c.packageType==='Free'?'bg-white shadow text-slate-800':'text-slate-500'}`}>Free</button>
                        <button onClick={() => mUpgrade.mutate({ id: c._id, p: 'Pro', ent: {} })} className={`px-2 py-1 text-[10px] font-bold rounded ${c.packageType==='Pro'?'bg-white shadow text-teal-600':'text-slate-500'}`}>Pro</button>
                        <button onClick={() => { setEnterpriseModal(c); setEntForm({ amount: '', durationDays: '365', maxJobPosts: '999', contractNote: '' }); }} className={`px-2 py-1 text-[10px] font-bold rounded ${c.packageType==='Enterprise'?'bg-white shadow text-violet-600':'text-slate-500'}`}>Enterprise</button>
                      </div>
                      {!c.isVerified ? <button onClick={() => mVerify.mutate({ id: c._id, v: true })} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black inline-flex items-center gap-1 shadow"><Check size={14}/> Duyệt</button> : <button onClick={() => mVerify.mutate({ id: c._id, v: false })} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-black hover:bg-slate-50">Hủy duyệt</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center gap-2"><span className="size-8 grid place-items-center rounded-xl bg-violet-600 text-white"><MessageSquare size={16}/></span><div><h2 className="font-black text-slate-900">Yêu cầu tư vấn gói Doanh nghiệp</h2><p className="text-xs text-slate-500">Khách hàng để lại thông tin cần liên hệ thủ công, sau đó cấp quyền bằng tay.</p></div></div>
            {requests.length === 0 ? <p className="text-sm text-slate-400 mt-6">Chưa có yêu cầu nào.</p> : (
              <div className="mt-5 grid md:grid-cols-2 gap-4">
                {requests.map(r => (
                  <div key={r._id} className={`p-4 border rounded-2xl ${r.status==='pending'?'bg-blue-50/50 border-blue-200 shadow-sm':'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${r.status==='pending'?'bg-amber-100 text-amber-700 border-amber-200 animate-pulse':'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>{r.status==='pending'?'Mới':'Đã xử lý'}</span>
                        <p className="text-xs text-slate-500 mt-1.5">{new Date(r.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      {r.status==='pending' && (
                        <button onClick={() => mReqStatus.mutate({ id: r._id, s: 'completed' })} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[11px] font-black flex items-center gap-1 shadow-sm"><Check size={12}/> Đánh dấu Đã xử lý</button>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="text-slate-500">Tên KH:</span> <strong className="text-slate-900">{r.name}</strong></p>
                      <p className="text-sm"><span className="text-slate-500">SĐT:</span> <a href={`tel:${r.phone}`} className="font-bold text-blue-600 underline">{r.phone}</a></p>
                      <p className="text-sm"><span className="text-slate-500">Công ty:</span> <strong className="text-slate-900">{r.companyName}</strong></p>
                      {r.note && <div className="mt-2 p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">{r.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-6 text-center">Luồng thực tế: Khách điền form → Hệ thống gửi email cho Sale & lưu vào đây → Sale gọi điện chốt hợp đồng → Quay lại tab <strong>Doanh nghiệp</strong> để nâng cấp lên Enterprise.</p>
          </div>
        )}

        {tab === 'jobs' && (
          <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
            <div className="px-6 pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-3"><span className="size-9 grid place-items-center rounded-xl bg-[#0f2a2e] text-white"><Filter size={16}/></span><div><h2 className="font-black text-slate-900">Quản lý tin tuyển dụng</h2><p className="text-xs text-slate-500">Bấm <b>Chi tiết</b> để xem pending (không mở /jobs) · <b>Đã duyệt</b> thì <b>Xem /jobs</b> như user thật.</p></div></div>
              <a href="/jobs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-black hover:bg-slate-50 shadow-sm">Xem /jobs <ExternalLink size={14}/></a>
            </div>
            {/* segmented filter */}
            <div className="px-6 mt-4">
              <div className="flex items-center gap-2 flex-wrap p-1.5 bg-slate-100 border border-slate-200 rounded-full w-fit">
                {[
                  {k:'pending', l:`Chờ duyệt`, n:pendingJobs.length, dot:'bg-amber-500'},
                  {k:'active', l:`Đã duyệt`, n:activeJobs.length, dot:'bg-emerald-500'},
                  {k:'rejected', l:`Từ chối`, n:rejectedJobs.length, dot:'bg-red-500'},
                  {k:'closed', l:`Hết hạn`, n:closedJobs.length, dot:'bg-slate-400'},
                  {k:'all', l:`Tất cả`, n:allAdminJobs.length, dot:'bg-slate-900'},
                ].map(f=>(
                  <button key={f.k} onClick={()=>setJobStatus(f.k)} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${jobStatus===f.k ? 'bg-[#0f2a2e] text-white shadow' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`}>
                    <span className={`size-2 rounded-full ${f.dot} ${jobStatus===f.k?'animate-pulse':''}`} /> {f.l} <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${jobStatus===f.k?'bg-white/15 text-white':'bg-white border border-slate-200'}`}>{f.n}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 mt-4">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={jobSearch} onChange={e=>setJobSearch(e.target.value)} placeholder="Tìm theo tên tin, công ty, địa điểm, tag..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-teal-300 focus:ring-4 focus:ring-teal-500/10 shadow-sm placeholder:text-slate-400"/>
              </div>
            </div>

            <div className="p-6">
              {filteredJobs.length===0 ? (
                <div className="py-14 text-center border-2 border-dashed border-slate-200 rounded-[22px] bg-slate-50/50">
                  <div className="size-14 mx-auto grid place-items-center rounded-2xl bg-white border border-slate-200 shadow-sm text-emerald-600"><PartyPopper size={22}/></div>
                  <p className="font-black text-slate-900 mt-3">{jobStatus==='pending' ? 'Tuyệt — không có tin chờ duyệt ✨' : 'Không có tin nào khớp'}</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{jobStatus==='pending' ? 'Hệ thống sạch. Tin mới đăng từ CTY chưa verified sẽ vào đây để bạn duyệt.' : 'Thử đổi filter hoặc từ khóa tìm kiếm.'}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    {jobStatus==='pending' && <button onClick={()=>setJobStatus('active')} className="px-4 py-2 bg-[#0f2a2e] text-white rounded-full text-xs font-black">Xem Đã duyệt ({activeJobs.length}) →</button>}
                    <button onClick={()=>{setJobSearch(''); setJobStatus('all');}} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-black">Xóa lọc</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredJobs.map(j => (
                    <div key={j._id} className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-[18px] hover:shadow-md hover:-translate-y-px transition-all ${j.status==='pending'?'bg-gradient-to-br from-amber-50/60 to-white border-amber-200':j.status==='active'?'bg-white border-emerald-200/60 hover:border-emerald-300':j.status==='closed'?'bg-slate-50 border-slate-200 opacity-90':'bg-white border-red-200'}`}>
                      <div className="min-w-0 flex-1 cursor-pointer" onClick={()=>setPreview(j)} role="button" title="Bấm để xem chi tiết">
                        <p className="text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                          <span className={`size-2 rounded-full ${j.status==='pending'?'bg-amber-500 animate-pulse':j.status==='active'?'bg-emerald-500':j.status==='closed'?'bg-slate-400':'bg-red-500'}`} />
                          {j.title}
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${j.status==='pending'?'bg-amber-100 text-amber-700 border-amber-200':j.status==='active'?'bg-emerald-100 text-emerald-700 border-emerald-200':j.status==='closed'?'bg-slate-100 text-slate-600 border-slate-200':'bg-red-50 text-red-600 border-red-200'}`}>{j.status}{j.status==='closed'?' · hết hạn':''}</span>
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full group-hover:bg-white group-hover:border-slate-300 transition-colors"><Eye size={11}/> Chi tiết</span>
                        </p>
                        <p className="text-xs text-slate-600 mt-1 truncate">{j.company} · {j.location} · {j.level||''} · {(j.tags||[]).slice(0,4).join(' · ')} · {j.salary||''}</p>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{j.description||''}</p>
                      </div>
                      <div className="flex gap-2 shrink-0 flex-wrap">
                        <button onClick={()=>setPreview(j)} className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-black inline-flex items-center gap-1 shadow-sm"><Eye size={14}/>Chi tiết</button>
                        {j.status==='pending' && (<><button onClick={() => mJob.mutate({ id: j._id, s: 'active' })} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-black inline-flex items-center gap-1 shadow"><Check size={14}/>Duyệt → active</button><button onClick={() => mJob.mutate({ id: j._id, s: 'rejected' })} className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-full text-xs font-black inline-flex items-center gap-1"><X size={14}/>Từ chối</button></>)}
                        {j.status==='active' && (<><a href={`/jobs/${j.slug}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full text-xs font-black inline-flex items-center gap-1 shadow-sm"><ExternalLink size={14}/>Xem /jobs</a><button onClick={() => mJob.mutate({ id: j._id, s: 'rejected' })} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-black hover:bg-slate-50">Ẩn</button></>)}
                        {j.status==='closed' && <span className="px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs font-black text-slate-500">Hết hạn · không hiện /jobs</span>}
                        {j.status==='rejected' && (<><button onClick={() => mJob.mutate({ id: j._id, s: 'active' })} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-black inline-flex items-center gap-1 shadow"><Check size={14}/>Duyệt lại</button><span className="px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs font-black text-slate-500">Đã ẩn</span></>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-4 text-center">Luồng thật: <b className="text-slate-600">Employer đăng → pending</b> (ẩn) → <b className="text-emerald-700">Admin duyệt → active</b> (hiện /jobs) → hết hạn <b>closed</b> / từ chối <b>rejected</b> (ẩn). Bấm <b>Chi tiết</b> để preview cả tin chưa duyệt.</p>
            </div>
          </div>
        )}
        {tab === 'skills' && (
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <h2 className="font-black text-slate-900">Quản lý kỹ năng</h2>
            <p className="text-xs text-slate-500 mt-1">Dùng cho matching score & bộ lọc ứng viên.</p>
            <form onSubmit={e => { e.preventDefault(); if (!newSkill.name.trim()) return; mAddSkill.mutate(newSkill); }} className="flex gap-2 mt-4">
              <input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="Tên kỹ năng (VD: Rust)" className="flex-1 px-3 py-2.5 bg-[#f6fbf9] border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-300 focus:ring-4 focus:ring-teal-500/10" />
              <select value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })} className="px-3 py-2.5 bg-[#f6fbf9] border border-slate-200 rounded-xl text-sm"><option>Frontend</option><option>Backend</option><option>Database</option><option>DevOps</option><option>Mobile</option><option>Design</option><option>Other</option></select>
              <button type="submit" className="px-4 py-2.5 bg-[#0f2a2e] text-white rounded-xl text-xs font-black hover:bg-black transition-colors shadow">Thêm</button>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">{skills.map(s => (<span key={s._id} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-700">{s.name}<span className="text-[10px] font-bold text-slate-400 border border-slate-200 bg-white px-1.5 py-0.5 rounded-full">{s.category}</span><button onClick={() => mDelSkill.mutate(s._id)} className="ml-1 size-5 grid place-items-center rounded-full hover:bg-white text-slate-500 hover:text-red-600 transition-colors"><X size={12} /></button></span>))}</div>
          </div>
        )}
        {preview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={()=>setPreview(null)}>
            <div onClick={e=>e.stopPropagation()} className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-auto border border-slate-200 shadow-2xl">
              <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-3">
                <div><p className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border bg-slate-900 text-white">{preview.status} {preview.status==='pending'?'· chưa hiện ở /jobs':preview.status==='active'?'· đang hiện ở /jobs':preview.status==='closed'?'· hết hạn':'· đã ẩn'}</p><h3 className="text-lg font-black text-slate-900 mt-2 leading-tight">{preview.title}</h3><p className="text-sm text-slate-500">{preview.company} · {preview.location} · {preview.level} · {preview.salary}</p></div>
                <button onClick={()=>setPreview(null)} className="size-9 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"><X size={18}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap gap-1.5">{(preview.tags||[]).map(t=><span key={t} className="px-2.5 py-1 bg-slate-900 text-white rounded-full text-xs font-bold">{t}</span>)}</div>
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4"><p className="text-xs font-black tracking-widest uppercase text-slate-500">Mô tả</p><p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed">{preview.description||'Không có mô tả'}</p></div>
                <div className="grid grid-cols-2 gap-3 text-xs"><div className="bg-white border border-slate-200 rounded-2xl p-3.5"><p className="font-black text-slate-500 tracking-widest uppercase">Yêu cầu</p><p className="mt-1.5 text-slate-700 leading-relaxed">{(preview.requirements||[]).join(' · ')||'—'}</p></div><div className="bg-white border border-slate-200 rounded-2xl p-3.5"><p className="font-black text-slate-500 tracking-widest uppercase">Hạn & số lượng</p><p className="mt-1.5 text-slate-700">{preview.deadline? new Date(preview.deadline).toLocaleDateString('vi-VN'):'—'} · SL: {preview.quantity||1} · {preview.mode||''} · Views: {preview.views||0}</p></div></div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {preview.status==='pending' && (<><button onClick={()=>{mJob.mutate({id:preview._id,s:'active'}); setPreview(null);}} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-black inline-flex items-center gap-1.5 shadow"><Check size={16}/>Duyệt → hiện ở /jobs</button><button onClick={()=>{mJob.mutate({id:preview._id,s:'rejected'}); setPreview(null);}} className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-full text-sm font-black">Từ chối</button></>)}
                  {preview.status==='active' && <a href={`/jobs/${preview.slug}`} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-full text-sm font-black inline-flex items-center gap-1.5 shadow-sm"><ExternalLink size={16}/>Mở /jobs xem như user</a>}
                  {preview.status==='closed' && <button onClick={()=>{mJob.mutate({id:preview._id,s:'active'}); setPreview(null);}} className="px-5 py-2.5 bg-[#0f2a2e] hover:bg-black text-white rounded-full text-sm font-black">Mở lại (active)</button>}
                  {preview.status==='rejected' && <button onClick={()=>{mJob.mutate({id:preview._id,s:'active'}); setPreview(null);}} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-black">Duyệt lại</button>}
                  <button onClick={()=>setPreview(null)} className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-black">Đóng</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Contract Modal */}
        {enterpriseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={()=>setEnterpriseModal(null)}>
            <div onClick={e=>e.stopPropagation()} className="bg-white rounded-[24px] max-w-lg w-full border border-slate-200 shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="size-10 grid place-items-center rounded-2xl bg-violet-100 text-violet-600"><ArrowUpCircle size={20}/></span>
                <div>
                  <h3 className="font-black text-slate-900">Nâng cấp Enterprise</h3>
                  <p className="text-xs text-slate-500">Công ty: <strong>{enterpriseModal.name}</strong></p>
                </div>
                <button onClick={()=>setEnterpriseModal(null)} className="ml-auto size-9 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"><X size={18}/></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); mUpgrade.mutate({ id: enterpriseModal._id, p: 'Enterprise', ent: { amount: Number(entForm.amount), durationDays: Number(entForm.durationDays), maxJobPosts: Number(entForm.maxJobPosts), contractNote: entForm.contractNote } }); }} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">Số tiền hợp đồng (VNĐ) *</label>
                  <input required type="number" min="0" value={entForm.amount} onChange={e=>setEntForm({...entForm, amount: e.target.value})} placeholder="VD: 5000000" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 text-sm" />
                  <p className="text-[11px] text-slate-400 mt-1">Giá đã đàm phán với khách hàng</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 mb-1.5 block">Thời hạn (ngày)</label>
                    <input type="number" min="1" value={entForm.durationDays} onChange={e=>setEntForm({...entForm, durationDays: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 text-sm" />
                    <p className="text-[11px] text-slate-400 mt-1">365 = 1 năm, 180 = 6 tháng</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-700 mb-1.5 block">Giới hạn tin đăng</label>
                    <input type="number" min="1" value={entForm.maxJobPosts} onChange={e=>setEntForm({...entForm, maxJobPosts: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 text-sm" />
                    <p className="text-[11px] text-slate-400 mt-1">999 = không giới hạn</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">Ghi chú hợp đồng (tùy chọn)</label>
                  <textarea value={entForm.contractNote} onChange={e=>setEntForm({...entForm, contractNote: e.target.value})} rows={2} placeholder="VD: Hợp đồng 6 tháng, ưu đãi 20%..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 text-sm" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={mUpgrade.isPending} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-black py-3 rounded-xl shadow-md transition-colors text-sm">{mUpgrade.isPending ? 'Đang xử lý...' : 'Xác nhận nâng cấp Enterprise'}</button>
                  <button type="button" onClick={()=>setEnterpriseModal(null)} className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-black">Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    </div>
  );
}
