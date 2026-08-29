import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BriefcaseBusiness, ChevronDown, MapPin, Search, Sparkles, UsersRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/jobsApi';

const roles = ['Frontend', 'Backend', 'Product & Design', 'Data & AI', 'QA & Automation', 'DevOps & Cloud'];

const companies = [
  { name: 'FPT Software', logo: 'F', tone: 'bg-orange-100 text-orange-700', industry: 'Outsourcing / IT Services', location: 'Hà Nội · Hồ Chí Minh' },
  { name: 'Shopee Vietnam', logo: 'S', tone: 'bg-orange-100 text-orange-600', industry: 'E-commerce', location: 'Hồ Chí Minh' },
  { name: 'NashTech', logo: 'N', tone: 'bg-violet-100 text-violet-700', industry: 'Technology', location: 'Hà Nội · Đà Nẵng' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('Tất cả địa điểm');

  // React Query fetch jobs (extremely premium cached data flow)
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?q=${searchTerm}&loc=${locationTerm}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50/70 border border-gray-200/50 shadow-sm p-8 sm:p-12 mb-10">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <p className="text-xs font-extrabold tracking-widest text-blue-600 uppercase mb-4">
                Tuyển dụng công nghệ, rõ ràng hơn
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
                Tìm nơi bạn có thể <span className="text-blue-600">làm việc tốt.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
                Cơ hội thật, thông tin đủ, và những đội ngũ đang tìm đúng người. Không ồn ào, không vòng vo.
              </p>

              {/* Search Panel */}
              <form onSubmit={handleSearchSubmit} className="mt-8 p-2.5 bg-white/95 rounded-2xl border border-gray-200 shadow-lg flex flex-col md:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl flex-grow border border-transparent focus-within:border-blue-500 transition-colors">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chức danh, kỹ năng hoặc tên công ty"
                    className="w-full bg-transparent outline-none text-sm text-gray-800"
                    aria-label="Từ khóa tìm kiếm"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-transparent focus-within:border-blue-500 transition-colors md:max-w-xs w-full">
                  <MapPin size={18} className="text-gray-400" />
                  <select
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-800 cursor-pointer appearance-none"
                    aria-label="Địa điểm"
                  >
                    <option>Tất cả địa điểm</option>
                    <option>Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Remote</option>
                  </select>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">
                  Tìm việc <ArrowRight size={18} />
                </button>
              </form>

              {/* Roles Row */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Đang được tìm kiếm:</span>
                {roles.slice(0, 4).map((role) => (
                  <Link key={role} to={`/jobs?q=${role}`} className="text-blue-600 hover:underline">
                    {role}
                  </Link>
                ))}
              </div>
            </div>

            {/* Note Panel */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white p-8 rounded-3xl shadow-xl transform rotate-1 lg:max-w-md w-full justify-self-center lg:justify-self-end">
              <div className="flex items-center justify-between text-[11px] font-bold opacity-80 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Sparkles size={14} /> itmatch signal</span>
                <span>01 / 04</span>
              </div>
              <p className="mt-12 text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
                “Một công việc tốt bắt đầu từ một mô tả công việc tử tế.”
              </p>
              <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <strong className="block text-3xl font-black tracking-tight">2,480+</strong>
                  <span className="block mt-1 text-xs opacity-75">việc đang mở</span>
                </div>
                <div>
                  <strong className="block text-3xl font-black tracking-tight">620</strong>
                  <span className="block mt-1 text-xs opacity-75">đội ngũ công nghệ</span>
                </div>
              </div>
              <Link to="/jobs" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white hover:underline">
                Xem toàn bộ cơ hội <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-yellow-400 pl-4">
              <strong className="block text-sm text-gray-900 font-bold">Thông tin minh bạch</strong>
              <span className="block mt-2 text-xs text-gray-500 leading-relaxed">
                Lương, hình thức làm việc và quy trình tuyển dụng rõ ràng.
              </span>
            </div>
            <div className="border-l-4 border-yellow-400 pl-4">
              <strong className="block text-sm text-gray-900 font-bold">Đúng ngành công nghệ</strong>
              <span className="block mt-2 text-xs text-gray-500 leading-relaxed">
                Tập trung vào những vai trò và kỹ năng tạo ra sản phẩm.
              </span>
            </div>
            <div className="border-l-4 border-yellow-400 pl-4">
              <strong className="block text-sm text-gray-900 font-bold">Hai phía cùng tốt hơn</strong>
              <span className="block mt-2 text-xs text-gray-500 leading-relaxed">
                Kết nối ứng viên và đội ngũ bằng trải nghiệm tôn trọng.
              </span>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Cơ hội mới mỗi ngày</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Việc làm đáng xem</h2>
            </div>
            <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {jobs.slice(0, 4).map((job) => (
                <JobCard key={job.id || job.slug} job={job} />
              ))}
            </div>
          )}
        </section>

        {/* Companies Section */}
        <section id="companies" className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Nơi bạn sẽ muốn làm việc</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Các đội ngũ đang xây dựng</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.name} className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                <div className={`grid size-12 place-items-center rounded-xl font-bold text-lg ${company.tone}`}>
                  {company.logo}
                </div>
                <div className="min-w-0 flex-grow">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{company.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{company.industry} · {company.location}</p>
                </div>
                <Link to="/jobs" className="text-gray-400 hover:text-blue-600 p-2">
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Audience Section */}
        <section className="grid md:grid-cols-2 gap-6">
          <Link to="/auth?register=true" className="bg-emerald-50 text-emerald-950 p-8 rounded-3xl hover:shadow-lg transition-all flex flex-col justify-between h-56 border border-emerald-100">
            <UsersRound size={28} className="text-emerald-700" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Dành cho ứng viên</p>
              <h2 className="text-2xl font-black mt-2">Để cơ hội tìm thấy bạn.</h2>
              <p className="text-xs text-emerald-800 mt-1.5 opacity-80 leading-relaxed">
                Hoàn thiện hồ sơ, theo dõi ứng tuyển và nhận gợi ý phù hợp hơn.
              </p>
            </div>
          </Link>

          <Link to="/auth?register=true&role=employer" className="bg-slate-900 text-white p-8 rounded-3xl hover:shadow-lg transition-all flex flex-col justify-between h-56 border border-slate-800">
            <BriefcaseBusiness size={28} className="text-blue-400" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Dành cho nhà tuyển dụng</p>
              <h2 className="text-2xl font-black mt-2">Tìm đúng người, xây đúng đội.</h2>
              <p className="text-xs text-slate-300 mt-1.5 opacity-85 leading-relaxed">
                Quản lý tin tuyển dụng và pipeline ứng viên trong một không gian gọn gàng.
              </p>
            </div>
          </Link>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-16 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          © 2026 itmatch. Một sản phẩm tuyển dụng công nghệ độc lập cho sinh viên CNTT.
        </div>
      </footer>
    </div>
  );
}
