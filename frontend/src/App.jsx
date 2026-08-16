import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, MapPin, Search, Star, TrendingUp, Users } from 'lucide-react';

const jobs = [
  {
    title: 'Frontend Developer',
    company: 'FPT Software',
    location: 'Hà Nội',
    type: 'Full-time',
    salary: '18 - 30 triệu',
    tags: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Backend Engineer',
    company: 'Viettel Solutions',
    location: 'Hồ Chí Minh',
    type: 'Full-time',
    salary: '22 - 35 triệu',
    tags: ['Node.js', 'MongoDB', 'AWS'],
  },
  {
    title: 'UI/UX Designer',
    company: 'NashTech',
    location: 'Đà Nẵng',
    type: 'Hybrid',
    salary: '16 - 28 triệu',
    tags: ['Figma', 'UX', 'Design System'],
  },
];

const stats = [
  { label: 'Việc làm mới', value: '2.5k+' },
  { label: 'Công ty IT', value: '620+' },
  { label: 'Ứng viên phù hợp', value: '95%' },
];

const companies = [
  'FPT Software',
  'Viettel',
  'NashTech',
  'Công ty công nghệ',
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold">IT</div>
            <div>
              <div className="font-bold text-xl">ITMatch</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#jobs" className="hover:text-blue-600">Việc làm</a>
            <a href="#companies" className="hover:text-blue-600">Công ty</a>
            <a href="#about" className="hover:text-blue-600">Về chúng tôi</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                <Star className="w-3.5 h-3.5" /> Tìm việc IT dễ hơn
              </div>

              <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight tracking-tight text-slate-900">
                Tìm nơi bạn <span className="text-blue-600">phát triển tốt nhất</span>
              </h1>

              <p className="mt-5 text-lg text-slate-600 max-w-xl">
                Kết nối ứng viên công nghệ với các công ty đang tuyển nhân sự chất lượng, rõ ràng và phù hợp kỹ năng.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm công việc, kỹ năng, tên công ty"
                    className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700">
                  Tìm việc <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                {['Frontend', 'Backend', 'DevOps', 'Data', 'QA'].map((item) => (
                  <span key={item} className="bg-white border border-slate-200 px-3 py-1.5 rounded-full">{item}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-bold">ITMATCH SIGNAL</p>
                  <h2 className="mt-2 text-3xl font-black">01 / 04</h2>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl font-semibold">+24%</div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Hot role</span>
                  <span>Today</span>
                </div>
                <div className="mt-4 text-2xl font-bold">Frontend Engineer</div>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4" /> Hà Nội · Hybrid
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, title: 'Thông tin minh bạch', desc: 'Lương, địa điểm, mô tả công việc rõ ràng.' },
              { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, title: 'Phù hợp kỹ năng', desc: 'Ứng viên tìm đúng công việc theo stack và kinh nghiệm.' },
              { icon: <Users className="w-5 h-5 text-blue-600" />, title: 'Môi trường tốt hơn', desc: 'Công ty lọc ứng viên phù hợp và nhanh hơn.' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="jobs" className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-bold">CƠ HỘI MỚI</p>
              <h2 className="mt-2 text-3xl font-black">Việc làm đáng xem</h2>
            </div>
            <button className="text-blue-600 font-semibold inline-flex items-center gap-2">Xem tất cả <ArrowRight className="w-4 h-4" /></button>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <div key={job.title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center">{job.company.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-blue-600">☆</button>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" /> {job.location}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <BriefcaseBusiness className="w-4 h-4" /> {job.type} · {job.salary}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">Ứng tuyển ngay</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="companies" className="bg-slate-900 text-white py-14 mt-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-bold">CÔNG TY</p>
                <h2 className="mt-2 text-3xl font-black">Nơi bạn muốn làm việc</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {companies.map((company, idx) => (
                <div key={company} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">{company.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="font-semibold">{company}</div>
                      <div className="text-xs text-slate-300">{idx + 2}k followers</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-bold">DÀNH CHO ỨNG VIÊN</p>
              <h3 className="mt-3 text-2xl font-black">Tạo hồ sơ, nộp đơn, theo dõi tiến độ</h3>
              <p className="mt-3 text-slate-600">Tất cả thông tin bạn cần để ứng tuyển và theo dõi trạng thái đơn đều có trong một giao diện rõ ràng.</p>
            </div>
            <div className="bg-blue-600 text-white rounded-3xl p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100 font-bold">DÀNH CHO NHÀ TUYỂN DỤNG</p>
              <h3 className="mt-3 text-2xl font-black">Quản lý tuyển dụng, đánh giá ứng viên nhanh hơn</h3>
              <p className="mt-3 text-blue-100">Theo dõi hồ sơ, xử lý đơn và tối ưu quá trình tuyển dụng trong nền tảng tập trung.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-slate-600 flex flex-col md:flex-row justify-between gap-3">
          <div className="font-bold text-slate-800">ITMatch</div>
          <div>© 2026 ITMatch. Nền tảng tuyển dụng công nghệ.</div>
        </div>
      </footer>
    </div>
  );
}
