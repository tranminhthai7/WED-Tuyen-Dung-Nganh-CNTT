import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, MapPin, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/jobsApi';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [loc, setLoc] = useState(searchParams.get('loc') || 'Tất cả địa điểm');
  const [filterMode, setFilterMode] = useState('Tất cả');

  // Sync state with URL params
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setLoc(searchParams.get('loc') || 'Tất cả địa điểm');
  }, [searchParams]);

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

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
        job.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
      : true;

    const matchLoc = loc && loc !== 'Tất cả địa điểm' ? job.location === loc : true;

    const matchMode = filterMode === 'Tất cả' ? true : job.mode === filterMode;

    return matchQuery && matchLoc && matchMode;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${filterMode === mode ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Search Row */}
        <form onSubmit={handleSearchSubmit} className="p-2.5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 mb-8">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl flex-grow border border-transparent focus-within:border-blue-500 transition-colors">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm công việc, vị trí, kỹ năng..."
              className="w-full bg-transparent outline-none text-sm text-gray-800"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-transparent focus-within:border-blue-500 transition-colors md:max-w-xs w-full">
            <MapPin size={18} className="text-gray-400" />
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-800 cursor-pointer appearance-none"
              aria-label="Địa điểm"
            >
              <option>Tất cả địa điểm</option>
              <option>Hồ Chí Minh</option>
              <option>Hà Nội</option>
              <option>Remote</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm">
            Tìm kiếm
          </button>
        </form>

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
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id || job.slug} job={job} />
            ))}
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
