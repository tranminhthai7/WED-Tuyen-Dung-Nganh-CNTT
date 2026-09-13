import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BriefcaseBusiness, ChevronDown, MapPin, Search, Sparkles, UsersRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import Reveal from '../components/Reveal';
import { fetchJobs, fetchCompanies } from '../services/jobsApi';

const roles = ['Frontend', 'Backend', 'Product & Design', 'Data & AI', 'QA & Automation', 'DevOps & Cloud'];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('Tất cả địa điểm');
  const [locOpen, setLocOpen] = useState(false);
  const { data: jobs = [], isLoading } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs, staleTime: 1000 * 60 * 5 });
  const { data: companiesReal = [] } = useQuery({ queryKey: ['companies'], queryFn: fetchCompanies, staleTime: 1000*60*5 });
  const signals = [
    { q: 'Một công việc tốt bắt đầu từ một mô tả công việc tử tế.', bg: 'bg-[#16423f]', glow: 'from-teal-400/25', a: { v: isLoading ? '—' : String(jobs.length), l: 'việc đang mở' }, b: { v: String(companiesReal.length || '—'), l: 'đội ngũ đã duyệt' }, cta: 'Xem toàn bộ cơ hội', to: '/jobs' },
    { q: 'AI soi khớp kỹ năng — gợi ý đúng người, đúng vị trí.', bg: 'bg-[#0f2a3a]', glow: 'from-sky-400/25', a: { v: 'AI', l: 'so khớp CV ↔ JD' }, b: { v: '3 mức', l: 'đỏ / vàng / xanh' }, cta: 'Thử hồ sơ AI', to: '/candidate/profile' },
    { q: 'Lương, hình thức, quy trình — minh bạch từ đầu.', bg: 'bg-[#1a1a2e]', glow: 'from-violet-400/25', a: { v: '100%', l: 'tin có mức lương' }, b: { v: '24h', l: 'duyệt hồ sơ TB' }, cta: 'Khám phá công ty', to: '/companies' },
    { q: 'Từ sinh viên IT đến đội ngũ mơ ước — bắt đầu hôm nay.', bg: 'bg-[#2a1f0f]', glow: 'from-amber-400/30', a: { v: '0đ', l: 'miễn phí ứng tuyển' }, b: { v: 'Realtime', l: 'theo dõi đơn' }, cta: 'Tạo tài khoản', to: '/auth?register=true' },
  ];
  const [sigIdx, setSigIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const paused = useRef(false);
  const go = (n) => { setDir(n > sigIdx ? 1 : -1); setSigIdx(((n % signals.length) + signals.length) % signals.length); };
  useEffect(() => {
    const id = setInterval(() => { if (!paused.current) { setDir(1); setSigIdx((i) => (i + 1) % signals.length); } }, 3800);
    return () => clearInterval(id);
  }, []);
  const tiltRef = useRef(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 12 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 12 });
  const onTiltMove = (e) => {
    const r = tiltRef.current?.getBoundingClientRect(); if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onTiltLeave = () => { mx.set(0); my.set(0); };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?q=${searchTerm}&loc=${locationTerm}`);
  };

  return (
    <div className="min-h-screen bg-[#f6fbf9] flex flex-col justify-between">
      <Header />

      {/* Hero full-bleed teal/mint — tech mesh + floating blobs */}
      <section className="w-full relative bg-gradient-to-br from-[#e8f6f2] via-[#eefaf6] to-[#fdf3d7] border-b border-teal-900/5">
        {/* grid dot + blobs — clipped inside, but hero allows dropdown overflow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.45]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(22,66,63,0.08) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
          <motion.div animate={{ y: [-10, 10] }} transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute -top-10 -right-16 w-72 h-72 rounded-full bg-teal-300/20 blur-3xl" />
          <motion.div animate={{ y: [12, -8] }} transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute -bottom-16 -left-10 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <Reveal>
              <p className="text-xs font-extrabold tracking-widest text-[#0f766e] uppercase mb-4">
                Tuyển dụng công nghệ, rõ ràng hơn
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f2e2e] leading-none tracking-tight">
                Tìm nơi bạn có thể <span className="text-[#0f766e] inline-block">làm việc tốt.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Cơ hội thật, thông tin đủ, và những đội ngũ đang tìm đúng người. Không ồn ào, không vòng vo.
              </p>

              {/* Search Panel */}
              <motion.form onSubmit={handleSearchSubmit} whileHover={{ y: -1 }} className="mt-8 p-2.5 bg-white rounded-[18px] border border-teal-900/10 shadow-[0_12px_32px_rgba(16,60,57,0.08)] flex flex-col md:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#f6fbf9] rounded-xl flex-grow min-w-0 border border-transparent focus-within:border-teal-500 transition-colors">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chức danh, kỹ năng hoặc tên công ty"
                    className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:whitespace-nowrap min-w-0"
                    aria-label="Từ khóa tìm kiếm"
                  />
                </div>
                <div className="relative md:max-w-xs w-full min-w-0">
                  <button type="button" onClick={() => setLocOpen(v=>!v)} className="w-full flex items-center gap-2 px-3 py-2.5 bg-[#f6fbf9] rounded-xl border border-transparent hover:border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-left">
                    <MapPin size={18} className="text-slate-400 shrink-0" />
                    <span className="flex-1 text-sm text-slate-800 truncate">{locationTerm}</span>
                    <motion.span animate={{ rotate: locOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={16} className="text-slate-400 shrink-0" /></motion.span>
                  </button>
                  <AnimatePresence>
                    {locOpen && (
                      <motion.ul initial={{ opacity:0, y:6, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:6, scale:0.98 }} transition={{ duration:0.18, ease:[0.22,1,0.36,1] }} className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-[0_16px_40px_rgba(16,60,57,0.14)] overflow-hidden py-1">
                        {['Tất cả địa điểm','Hồ Chí Minh','Hà Nội','Remote'].map(opt => (
                          <li key={opt}><button type="button" onClick={() => { setLocationTerm(opt); setLocOpen(false); }} className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-teal-50 transition-colors ${locationTerm===opt ? 'font-bold text-teal-700 bg-teal-50' : 'text-slate-700'}`}>{opt}{locationTerm===opt && '  ✓'}</button></li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} type="submit" className="bg-[#0f3d3a] hover:bg-[#16423f] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 shrink-0 whitespace-nowrap leading-none">
                  Tìm việc <ArrowRight size={18} />
                </motion.button>
              </motion.form>

              {/* Roles Row */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Đang được tìm kiếm:</span>
                {roles.slice(0, 4).map((role) => (
                  <Link key={role} to={`/jobs?q=${role}`} className="text-teal-700 hover:text-teal-800 underline decoration-teal-700/30">
                    {role}
                  </Link>
                ))}
              </div>
            </Reveal>

            {/* Note Panel teal — 3D tilt */}
            <div style={{ perspective: 900 }} className="w-full flex justify-center lg:justify-end">
            <motion.div
              ref={tiltRef}
              onMouseEnter={() => (paused.current = true)}
              onMouseLeave={() => { paused.current = false; onTiltLeave(); }}
              onMouseMove={onTiltMove}
              style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
              className={`relative overflow-hidden p-8 rounded-[28px] shadow-[0_20px_60px_rgba(16,60,57,0.35)] lg:max-w-md w-full will-change-transform ${signals[sigIdx].bg} text-white flex flex-col`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${signals[sigIdx].glow} to-transparent pointer-events-none transition-colors duration-500`} />
              <div style={{ transform: 'translateZ(24px)' }} className="relative flex items-center justify-between text-[11px] font-bold uppercase tracking-widest shrink-0">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> itmatch signal</span>
                <span className="opacity-80 tabular-nums">0{sigIdx + 1} / 0{signals.length}</span>
              </div>
              <div style={{ transform: 'translateZ(36px)' }} className="relative mt-10 h-[112px] overflow-hidden shrink-0">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.p
                    key={sigIdx}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -28 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.3}
                    onDragEnd={(_, info) => { if (info.offset.x < -40) go(sigIdx + 1); else if (info.offset.x > 40) go(sigIdx - 1); }}
                    className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight cursor-grab active:cursor-grabbing"
                  >
                    “{signals[sigIdx].q}”
                  </motion.p>
                </AnimatePresence>
              </div>
              {/* dots */}
              <div style={{ transform: 'translateZ(18px)' }} className="relative mt-6 flex items-center gap-1.5">
                {signals.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Signal ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === sigIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'}`}
                  />
                ))}
              </div>
              <div style={{ transform: 'translateZ(18px)' }} className="relative mt-4 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <strong className="block text-3xl font-black tracking-tight">{signals[sigIdx].a.v}</strong>
                  <span className="block mt-1 text-xs opacity-75">{signals[sigIdx].a.l}</span>
                </div>
                <div>
                  <strong className="block text-3xl font-black tracking-tight">{signals[sigIdx].b.v}</strong>
                  <span className="block mt-1 text-xs opacity-75">{signals[sigIdx].b.l}</span>
                </div>
              </div>
              <Link to={signals[sigIdx].to} style={{ transform: 'translateZ(20px)' }} className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold text-white hover:underline">
                {signals[sigIdx].cta} <ArrowRight size={16} />
              </Link>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Trust Strip */}
        <Reveal><section className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 mb-12">
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
        </section></Reveal>

        {/* Jobs Section */}
        <Reveal delay={0.06}><section className="mb-12">
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
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }} variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.07 } } }} className="grid md:grid-cols-2 gap-6">
              {jobs.slice(0, 4).map((job) => (
                <motion.div key={job.id || job.slug} variants={{ hidden:{ opacity:0, y:14 }, show:{ opacity:1, y:0, transition:{ duration:0.4 } } }}>
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section></Reveal>

        {/* Companies Section */}
        <Reveal delay={0.08}><section id="companies" className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Nơi bạn sẽ muốn làm việc</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Các đội ngũ đang xây dựng</h2>
            </div>
            <Link to="/companies" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-blue-600">Xem tất cả <ArrowRight size={16} /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(companiesReal.length ? companiesReal.slice(0,3) : [{ name: 'Chưa có công ty được duyệt', logo: '—', industry: '—', address: '—', slug: '' }].slice(0, companiesReal.length===0?0:3)).map((company) => {
              const slug = company.slug || (company.name ? company.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') : '') || company._id;
              if (!slug) return null;
              return (
              <Link key={slug} to={`/companies/${slug}`} className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                <div className="grid size-12 place-items-center rounded-xl font-bold text-lg bg-blue-50 text-blue-700 border border-blue-100 overflow-hidden shrink-0">
                  {company.logo?.startsWith?.('http') ? <img src={company.logo} alt="" className="w-full h-full object-cover" /> : (company.logo || company.name?.[0] || 'C')}
                </div>
                <div className="min-w-0 flex-grow">
                  <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-700">{company.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">{company.industry || '—'} · {company.address || '—'}</p>
                </div>
                <span className="text-gray-400 group-hover:text-blue-600 p-2"><ArrowRight size={16} /></span>
              </Link>
            )})}
          </div>
          {companiesReal.length===0 && <p className="text-sm text-slate-400 mt-4 text-center">Chưa có công ty được duyệt — dữ liệu thật từ DB. Nhà tuyển dụng tạo hồ sơ ở Employer Dashboard.</p>}
          <Link to="/companies" className="sm:hidden mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600">Xem tất cả <ArrowRight size={16} /></Link>
        </section></Reveal>

        {/* CTA Audience Section */}
        <Reveal delay={0.1}><section className="grid md:grid-cols-2 gap-6">
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
        </section></Reveal>
      </main>
    </div>
  );
}
