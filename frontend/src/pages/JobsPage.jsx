import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, MapPin, Sparkles, ChevronDown } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { fetchJobs, aiSuggestJobs } from '../services/jobsApi';
import useAuthStore from '../store/authStore';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [loc, setLoc] = useState(searchParams.get('loc') || 'Tất cả địa điểm');
  const [filterMode, setFilterMode] = useState('Tất cả');
  const [filterLevel, setFilterLevel] = useState('Tất cả');
  const [filterSalary, setFilterSalary] = useState('Tất cả');
  const [showExpired, setShowExpired] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const openOnly = (which) => {
    setLevelOpen(which==='level' ? v=>!v : false);
    setSalaryOpen(which==='salary' ? v=>!v : false);
    setLocOpen(which==='loc' ? v=>!v : false);
  };
  useEffect(() => {
    const onDown = (e) => { if (!e.target.closest('[data-dropdown]')) { setLevelOpen(false); setSalaryOpen(false); setLocOpen(false); } };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  // Sync state with URL params
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setLoc(searchParams.get('loc') || 'Tất cả địa điểm');
  }, [searchParams]);

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });
  const { isAuthenticated, user } = useAuthStore();
  const [aiPicks, setAiPicks] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState('');
  const handleAiSuggest = async () => {
    setAiLoading(true); setAiErr('');
    try { const r = await aiSuggestJobs(); setAiPicks(r.picks || []); } catch (e) { setAiErr(e.message); }
    finally { setAiLoading(false); }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (q) params.q = q;
    if (loc && loc !== 'Tất cả địa điểm') params.loc = loc;
    setSearchParams(params);
  };

  // Filter logic on client side
  const filteredJobs = jobs.filter((job) => {
    const matchQuery = q
      ? job.title.toLowerCase().includes(q.toLowerCase()) ||
        job.company.toLowerCase().includes(q.toLowerCase()) ||
        (job.tags || []).some((t) => t.toLowerCase().includes(q.toLowerCase()))
      : true;

    const matchLoc = loc && loc !== 'Tất cả địa điểm' ? job.location === loc : true;

    const matchMode = filterMode === 'Tất cả' ? true : job.mode === filterMode;
    const matchLevel = filterLevel === 'Tất cả' ? true : (job.level || 'Junior') === filterLevel;
    const matchSalary = filterSalary === 'Tất cả' ? true : (() => {
      const s = (job.salary || '').toLowerCase();
      if (filterSalary === '<1000') return s.includes('500') || s.includes('800');
      if (filterSalary === '1000-2000') return s.includes('1,200') || s.includes('1,800') || s.includes('2,000');
      if (filterSalary === '>2000') return s.includes('2,500') || s.includes('3,500') || s.includes('4,000');
      return true;
    })();
    const notExpired = showExpired ? true : (!job.deadline || new Date(job.deadline) >= new Date(new Date().setHours(0,0,0,0)));

    return matchQuery && matchLoc && matchMode && matchLevel && matchSalary && notExpired;
  });

  // Pagination
  useEffect(() => { setPage(1); }, [q, loc, filterMode, filterLevel, filterSalary, showExpired]);
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const paginatedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  return (
    <div className="min-h-screen bg-[#f6fbf9] flex flex-col justify-between">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Tìm việc</p>
            <h1 className="text-3xl font-black text-gray-900 mt-1">Việc làm IT phù hợp</h1>
          </div>
          <div className="flex gap-2">
            {['Tất cả', 'On-site', 'Remote', 'Hybrid'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${filterMode === mode ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-white hover:border-slate-400 shadow-sm'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold text-gray-400">Lọc thêm:</span>
          <div className="relative" data-dropdown>
            <button type="button" onClick={() => openOnly('level')} className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors">
              {filterLevel}<motion.span animate={{ rotate: levelOpen ? 180 : 0 }} transition={{duration:0.2}}><ChevronDown size={14} className="text-slate-400" /></motion.span>
            </button>
            <AnimatePresence>{levelOpen && (
              <motion.ul initial={{opacity:0,y:6,scale:0.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:0.98}} transition={{duration:0.16}} className="absolute z-40 left-0 mt-2 min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-[0_16px_40px_rgba(16,60,57,0.12)] overflow-hidden py-1">
                {['Tất cả','Intern','Fresher','Junior','Middle','Senior'].map(o=>(
                  <li key={o}><button type="button" onClick={()=>{setFilterLevel(o);setLevelOpen(false)}} className={`w-full text-left px-3.5 py-2 text-sm hover:bg-teal-50 transition-colors ${filterLevel===o?'font-bold text-teal-700 bg-teal-50':'text-slate-700'}`}>{o}{filterLevel===o?'  ✓':''}</button></li>
                ))}
              </motion.ul>
            )}</AnimatePresence>
          </div>
          <div className="relative" data-dropdown>
            <button type="button" onClick={() => openOnly('salary')} className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors">
              {filterSalary==='Tất cả'?'Mọi mức lương':filterSalary==='&lt;1000'?'< 1000 USD':filterSalary==='1000-2000'?'1000–2000 USD':'> 2000 USD'}<motion.span animate={{ rotate: salaryOpen ? 180 : 0 }} transition={{duration:0.2}}><ChevronDown size={14} className="text-slate-400" /></motion.span>
            </button>
            <AnimatePresence>{salaryOpen && (
              <motion.ul initial={{opacity:0,y:6,scale:0.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:0.98}} transition={{duration:0.16}} className="absolute z-40 left-0 mt-2 min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-[0_16px_40px_rgba(16,60,57,0.12)] overflow-hidden py-1">
                {[{v:'Tất cả',l:'Mọi mức lương'},{v:'<1000',l:'< 1000 USD'},{v:'1000-2000',l:'1000–2000 USD'},{v:'>2000',l:'> 2000 USD'}].map(o=>(
                  <li key={o.v}><button type="button" onClick={()=>{setFilterSalary(o.v);setSalaryOpen(false)}} className={`w-full text-left px-3.5 py-2 text-sm hover:bg-teal-50 transition-colors ${filterSalary===o.v?'font-bold text-teal-700 bg-teal-50':'text-slate-700'}`}>{o.l}{filterSalary===o.v?'  ✓':''}</button></li>
                ))}
              </motion.ul>
            )}</AnimatePresence>
          </div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer"><input type="checkbox" checked={showExpired} onChange={e => setShowExpired(e.target.checked)} /> Hiện tin hết hạn</label>
          <span className="text-xs text-gray-400">· {filteredJobs.length} tin</span>
        </div>

        {/* Search Row */}
        <form onSubmit={handleSearchSubmit} className="p-2.5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f6fbf9] rounded-xl flex-grow border border-transparent focus-within:border-blue-500 transition-colors">
            <Search size={18} className="text-gray-400" />
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm công việc, vị trí, kỹ năng..." className="w-full bg-transparent outline-none text-sm text-gray-800" />
          </div>
          <div className="relative md:max-w-xs w-full" data-dropdown>
            <button type="button" onClick={() => openOnly('loc')} className="w-full flex items-center gap-2 px-3 py-2.5 bg-[#f6fbf9] rounded-xl border border-transparent hover:border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-left">
              <MapPin size={18} className="text-gray-400 shrink-0" />
              <span className="flex-1 text-sm text-slate-800 truncate">{loc}</span>
              <motion.span animate={{ rotate: locOpen ? 180 : 0 }} transition={{duration:0.2}}><ChevronDown size={16} className="text-slate-400 shrink-0" /></motion.span>
            </button>
            <AnimatePresence>{locOpen && (
              <motion.ul initial={{opacity:0,y:6,scale:0.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:0.98}} transition={{duration:0.16}} className="absolute z-40 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-[0_16px_40px_rgba(16,60,57,0.12)] overflow-hidden py-1">
                {['Tất cả địa điểm','Hồ Chí Minh','Hà Nội','Remote'].map(o=>(
                  <li key={o}><button type="button" onClick={()=>{setLoc(o);setLocOpen(false)}} className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-teal-50 transition-colors ${loc===o?'font-bold text-teal-700 bg-teal-50':'text-slate-700'}`}>{o}{loc===o?'  ✓':''}</button></li>
                ))}
              </motion.ul>
            )}</AnimatePresence>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm">Tìm kiếm</button>
        </form>
        {/* AI Suggest */}
        {isAuthenticated && user?.role === 'candidate' && (
          <div className="mb-6 p-3 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-100 rounded-2xl flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-violet-700 flex items-center gap-1.5"><Sparkles size={14} /> Gợi ý AI cho bạn</span>
            <button onClick={handleAiSuggest} disabled={aiLoading} className="px-3 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 disabled:opacity-50">{aiLoading ? 'Đang gợi ý...' : '✨ Gợi ý việc phù hợp'}</button>
            {aiErr && <span className="text-xs text-red-600">{aiErr}</span>}
          </div>
        )}
        {aiPicks && aiPicks.length > 0 && (
          <div className="mb-8 space-y-3">
            <p className="text-xs font-bold text-violet-700">Top 3 AI gợi ý {aiPicks[0]?.source === 'fallback' && '(fallback matching)'}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {aiPicks.map(({ job, score, reason, source }) => (
                <Link key={job.id || job.slug} to={`/jobs/${job.slug}`} className="bg-white border border-violet-100 rounded-2xl p-4 hover:shadow-md block">
                  <p className="text-sm font-black text-gray-900 line-clamp-1">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                  <span className={`inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded ${source==='ai'?'bg-violet-600 text-white':'bg-gray-100 text-gray-600'}`}>{score}% {source==='ai'?'AI':'Matching'}</span>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{reason}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <Sparkles size={40} className="text-gray-300 mx-auto mb-4 animate-bounce" />
            <h3 className="font-bold text-gray-900 text-lg">Không tìm thấy việc làm phù hợp</h3>
            <p className="text-xs text-gray-500 mt-2">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để tìm được nhiều việc làm hơn.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {paginatedJobs.map((job) => (
                <JobCard key={job.id || job.slug} job={job} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-white border-gray-300 text-gray-700 disabled:opacity-40">‹ Trước</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} className={`min-w-[36px] px-2 py-1.5 rounded-xl text-xs font-bold border ${n === page ? 'bg-blue-600 border-blue-600 text-white shadow' : 'bg-white border-gray-300 text-gray-700'}`}>{n}</button>
                ))}
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-white border-gray-300 text-gray-700 disabled:opacity-40">Sau ›</button>
              </div>
            )}
            <p className="mt-3 text-center text-xs text-gray-400">Trang {page}/{totalPages} · {filteredJobs.length} tin</p>
          </>
        )}
      </main>
    </div>
  );
}
