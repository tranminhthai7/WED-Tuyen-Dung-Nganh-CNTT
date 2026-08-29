import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ShieldCheck, Users, Briefcase, FileCheck, Check, X } from 'lucide-react';
import Header from '../components/Header';
import { fetchDashboardStats, fetchAdminCompanies, verifyCompany, fetchPendingJobs, moderateJob, fetchSkills, createSkill, deleteSkill } from '../services/jobsApi';

export default function AdminDashboardPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('overview');
  const { data: stats = { candidates: 4520, employers: 320, jobs: 1840, applications: 9680 } } = useQuery({ queryKey: ['adminStats'], queryFn: fetchDashboardStats });
  const { data: companies = [] } = useQuery({ queryKey: ['adminCompanies'], queryFn: fetchAdminCompanies, enabled: tab !== 'overview' });
  const { data: pendingJobs = [] } = useQuery({ queryKey: ['pendingJobs'], queryFn: fetchPendingJobs, enabled: tab !== 'overview' });
  const { data: skills = [] } = useQuery({ queryKey: ['adminSkills'], queryFn: fetchSkills, enabled: tab === 'skills' });
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Other' });

  const mVerify = useMutation({ mutationFn: ({ id, v }) => verifyCompany(id, v), onSuccess: () => qc.invalidateQueries({ queryKey: ['adminCompanies'] }) });
  const mJob = useMutation({ mutationFn: ({ id, s }) => moderateJob(id, s), onSuccess: () => qc.invalidateQueries({ queryKey: ['pendingJobs'] }) });
  const mAddSkill = useMutation({ mutationFn: createSkill, onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminSkills'] }); setNewSkill({ name: '', category: 'Other' }); } });
  const mDelSkill = useMutation({ mutationFn: deleteSkill, onSuccess: () => qc.invalidateQueries({ queryKey: ['adminSkills'] }) });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Hệ thống</p>
            <h1 className="text-3xl font-black text-gray-900 mt-1">Dashboard quản trị Admin</h1>
          </div>
          <div className="flex gap-2">
            {[{ k: 'overview', l: 'Tổng quan' }, { k: 'companies', l: `DN chờ duyệt (${companies.filter(c => !c.isVerified).length})` }, { k: 'jobs', l: `Tin chờ duyệt (${pendingJobs.length})` }, { k: 'skills', l: `Kỹ năng (${skills.length})` }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${tab === t.k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>{t.l}</button>
            ))}
          </div>
        </div>

        {tab === 'overview' && (
          <>
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div><div><span className="block text-xs text-gray-400 font-medium">Ứng viên</span><strong className="block text-2xl font-black text-gray-900 mt-0.5">{stats.candidates}</strong></div></div>
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4"><div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ShieldCheck size={20} /></div><div><span className="block text-xs text-gray-400 font-medium">Nhà tuyển dụng</span><strong className="block text-2xl font-black text-gray-900 mt-0.5">{stats.employers}</strong></div></div>
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4"><div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Briefcase size={20} /></div><div><span className="block text-xs text-gray-400 font-medium">Việc làm đang mở</span><strong className="block text-2xl font-black text-gray-900 mt-0.5">{stats.jobs}</strong></div></div>
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4"><div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><FileCheck size={20} /></div><div><span className="block text-xs text-gray-400 font-medium">Đơn ứng tuyển</span><strong className="block text-2xl font-black text-gray-900 mt-0.5">{stats.applications}</strong></div></div>
            </div>
            <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
              <h2 className="font-black text-gray-900 mb-2">Yêu cầu cần phê duyệt</h2>
              <p className="text-xs text-gray-400 mb-6">Chọn tab Doanh nghiệp / Tin chờ duyệt ở trên để duyệt trực tiếp.</p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl"><b>{pendingJobs.length}</b> tin đăng chờ duyệt</div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl"><b>{companies.filter(c => !c.isVerified).length}</b> DN chưa xác thực</div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">0 hồ sơ báo xấu</div>
              </div>
            </div>
          </>
        )}

        {tab === 'companies' && (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="font-black text-gray-900 mb-4">Doanh nghiệp chờ duyệt</h2>
            {companies.length === 0 ? <p className="text-sm text-gray-400">Chưa có DN nào.</p> : (
              <div className="space-y-3">
                {companies.map(c => (
                  <div key={c._id || c.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      {c.logo ? <img src={c.logo} alt="" className="w-10 h-10 rounded-xl object-cover border" /> : <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black">{c.name?.[0]}</div>}
                      <div><b className="text-sm text-gray-900">{c.name}</b><p className="text-xs text-gray-400">{c.ownerId?.email || ''} · {c.isVerified ? 'Đã duyệt' : 'Chờ duyệt'}</p></div>
                    </div>
                    <div className="flex gap-2">
                      {!c.isVerified ? <button onClick={() => mVerify.mutate({ id: c._id, v: true })} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"><Check size={14} />Duyệt</button> : <button onClick={() => mVerify.mutate({ id: c._id, v: false })} className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold">Hủy duyệt</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'jobs' && (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="font-black text-gray-900 mb-4">Tin chờ duyệt</h2>
            {pendingJobs.length === 0 ? <p className="text-sm text-gray-400">Không có tin pending.</p> : (
              <div className="space-y-3">
                {pendingJobs.map(j => (
                  <div key={j._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                    <div><b className="text-sm text-gray-900">{j.title}</b><p className="text-xs text-gray-400">{j.company} · {j.location} · {j.level || ''}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => mJob.mutate({ id: j._id, s: 'active' })} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"><Check size={14} />Duyệt</button>
                      <button onClick={() => mJob.mutate({ id: j._id, s: 'rejected' })} className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1"><X size={14} />Từ chối</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'skills' && (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="font-black text-gray-900 mb-4">Quản lý kỹ năng</h2>
            <form onSubmit={e => { e.preventDefault(); if (!newSkill.name.trim()) return; mAddSkill.mutate(newSkill); }} className="flex gap-2 mb-4">
              <input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="Tên kỹ năng" className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              <select value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option>Frontend</option><option>Backend</option><option>Database</option><option>DevOps</option><option>Mobile</option><option>Design</option><option>Other</option></select>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Thêm</button>
            </form>
            <div className="flex flex-wrap gap-2">{skills.map(s => (<span key={s._id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">{s.name}<span className="text-[10px] text-gray-400">{s.category}</span><button onClick={() => mDelSkill.mutate(s._id)} className="ml-1 text-red-500 hover:text-red-700"><X size={12} /></button></span>))}</div>
          </div>
        )}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-16 text-center text-xs text-gray-400"><div className="max-w-7xl mx-auto px-4">© 2026 itmatch.</div></footer>
    </div>
  );
}
