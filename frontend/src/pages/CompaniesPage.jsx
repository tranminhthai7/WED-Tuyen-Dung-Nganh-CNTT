import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '../services/jobsApi';
import Header from '../components/Header';

export default function CompaniesPage() {
  const [q, setQ] = useState('');
  const { data: companies = [], isLoading } = useQuery({ queryKey: ['companies'], queryFn: fetchCompanies });
  const filtered = useMemo(() => companies.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase())), [companies, q]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-[#0f2a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-300">Khám phá</p>
          <h1 className="text-3xl sm:text-4xl font-black mt-2">Công ty công nghệ</h1>
          <p className="text-sm text-teal-100/80 mt-2">Dữ liệu thật từ DB · chỉ hiện công ty đã được Admin duyệt</p>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm kiếm tên công ty" className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-300 focus:ring-4 focus:ring-teal-500/10" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading && <p className="text-sm text-slate-400 col-span-4">Đang tải…</p>}
          {!isLoading && filtered.map(c => {
            const slug = c.slug || c.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || c._id;
            return (
            <Link key={c._id || slug} to={`/companies/${slug}`} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-teal-200 transition-all group">
              <div className="grid size-10 place-items-center rounded-xl font-black text-sm bg-teal-50 text-teal-700 border border-teal-100 overflow-hidden">
                {c.logo?.startsWith('http') ? <img src={c.logo} alt="" className="w-full h-full object-cover" /> : (c.logo || c.name?.[0] || 'C')}
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-3 group-hover:text-teal-700">{c.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.industry || '—'}</p>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">◎ {c.address || c.location || '—'}</p>
              <p className="text-xs font-bold text-teal-700 mt-3">{c.count ?? 0} vị trí đang tuyển</p>
            </Link>
          )})}
        </div>
        {!isLoading && filtered.length===0 && <p className="text-center text-sm text-slate-400 mt-10">{companies.length===0 ? 'Chưa có công ty nào được duyệt. Nhà tuyển dụng tạo hồ sơ ở /employer/dashboard và chờ Admin duyệt.' : 'Không tìm thấy công ty nào.'}</p>}
      </main>
    </div>
  );
}
