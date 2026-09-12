import { Heart, MapPin, Banknote, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCompany } from '../services/jobsApi';
import Header from '../components/Header';
import JobCard from '../components/JobCard';

export default function CompanyDetailPage() {
  const { slug } = useParams();
  const { data: company, isLoading, isError } = useQuery({ queryKey: ['company', slug], queryFn: () => fetchCompany(slug), enabled: !!slug });

  if (isLoading) return <div className="min-h-screen bg-[#f6fbf9]"><Header /><p className="text-center py-20 text-slate-400">Đang tải…</p></div>;
  if (isError || !company) return <div className="min-h-screen bg-[#f6fbf9]"><Header /><div className="max-w-3xl mx-auto py-20 text-center"><p className="text-slate-500">Không tìm thấy công ty.</p><Link to="/companies" className="text-teal-700 font-bold mt-4 inline-block">← Về danh sách công ty</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#f6fbf9]">
      <Header />
      <div className="bg-[#16423f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="size-14 rounded-xl bg-white text-teal-800 grid place-items-center font-black text-xl overflow-hidden shrink-0">
              {company.logo?.startsWith('http') ? <img src={company.logo} alt="" className="w-full h-full object-cover" /> : (company.logo || company.name?.[0])}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black truncate">{company.name}</h1>
              <p className="text-sm text-teal-100/80 truncate">{company.industry || '—'} · {company.address || '—'} · {(company.jobs || []).length} việc đang tuyển</p>
            </div>
          </div>
          <Link to="/jobs" className="hidden sm:inline-flex bg-white text-teal-800 font-bold px-5 py-2.5 rounded-xl">Xem việc làm</Link>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1.7fr_0.9fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-black text-slate-900">Giới thiệu</h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed whitespace-pre-wrap">{company.description || 'Chưa có mô tả.'}</p>
            {company.techStack?.length > 0 && <div className="flex flex-wrap gap-2 mt-4">{company.techStack.map(t=><span key={t} className="text-xs font-semibold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">{t}</span>)}</div>}
          </div>
          <div>
            <h2 className="font-black text-slate-900 mb-3">Việc làm tại {company.name}</h2>
            {(company.jobs || []).length === 0 ? <p className="text-sm text-slate-400">Chưa có tin đang tuyển.</p> : <div className="grid md:grid-cols-2 gap-4">{company.jobs.map(j => <JobCard key={j._id || j.id || j.slug} job={j} />)}</div>}
          </div>
        </div>
        <aside className="bg-white border border-slate-200 rounded-2xl p-6 h-fit">
          <h3 className="font-bold text-sm">Thông tin chung</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Website</dt><dd className="font-medium truncate max-w-[60%] text-right">{company.website ? <a href={company.website} target="_blank" rel="noreferrer" className="text-teal-700 hover:underline">{company.website}</a> : '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Quy mô</dt><dd className="font-medium">{company.size || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Địa chỉ</dt><dd className="font-medium truncate max-w-[60%] text-right">{company.address || '—'}</dd></div>
          </dl>
        </aside>
      </main>
    </div>
  );
}
