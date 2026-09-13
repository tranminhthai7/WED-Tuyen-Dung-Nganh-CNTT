import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BriefcaseBusiness, ChevronDown, MapPin, Search, Sparkles, UsersRound, ShieldCheck, Zap, Building2, TrendingUp, CheckCircle2, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import Reveal from '../components/Reveal';
import { fetchJobs, fetchCompanies } from '../services/jobsApi';

const roles = ['Frontend', 'Backend', 'Product & Design', 'Data & AI'];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('Tất cả địa điểm');
  const [locOpen, setLocOpen] = useState(false);
  const { data: jobs = [], isLoading } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs, staleTime: 1000 * 60 * 5 });
  const { data: companiesRaw = [] } = useQuery({ queryKey: ['companies'], queryFn: fetchCompanies, staleTime: 1000*60*5 });
  const companiesReal = useMemo(() => { const seen=new Set(); return companiesRaw.filter(c=>{ const k=String(c.name||'').toLowerCase().trim(); if(!k||seen.has(k)) return false; seen.add(k); return true; }); }, [companiesRaw]);
  const signals = [
    { q: 'Một mô tả công việc tử tế là khởi đầu của một công việc tốt.', bg: 'bg-[#0f2e2e]', glow: 'from-emerald-400/20', accent: 'bg-emerald-400', a: { v: isLoading ? '—' : String(jobs.length), l: 'việc đang mở' }, b: { v: String(companiesReal.length || '—'), l: 'đội ngũ đã duyệt' }, cta: 'Xem toàn bộ cơ hội', to: '/jobs' },
    { q: 'AI soi khớp kỹ năng — đúng người, đúng vị trí.', bg: 'bg-[#111b2f]', glow: 'from-sky-400/20', accent: 'bg-sky-400', a: { v: 'AI', l: 'so khớp CV ↔ JD' }, b: { v: '3 mức', l: 'đỏ · vàng · xanh' }, cta: 'Thử hồ sơ AI', to: '/candidate/profile' },
    { q: 'Lương, hình thức, quy trình — minh bạch từ đầu.', bg: 'bg-[#1a1a2e]', glow: 'from-violet-400/20', accent: 'bg-violet-400', a: { v: '100%', l: 'tin có mức lương' }, b: { v: '24h', l: 'duyệt hồ sơ TB' }, cta: 'Khám phá công ty', to: '/companies' },
    { q: 'Từ sinh viên IT đến đội ngũ mơ ước — bắt đầu hôm nay.', bg: 'bg-[#2a1f0f]', glow: 'from-amber-400/25', accent: 'bg-amber-400', a: { v: '0đ', l: 'miễn phí ứng tuyển' }, b: { v: 'Live', l: 'theo dõi đơn' }, cta: 'Tạo tài khoản', to: '/auth?register=true' },
  ];
  const [sigIdx, setSigIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const paused = useRef(false);
  const go = (n) => { setDir(n > sigIdx ? 1 : -1); setSigIdx(((n % signals.length) + signals.length) % signals.length); };
  useEffect(() => {
    const id = setInterval(() => { if (!paused.current) { setDir(1); setSigIdx((i) => (i + 1) % signals.length); } }, 3600);
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
  const handleSearchSubmit = (e) => { e.preventDefault(); navigate(`/jobs?q=${encodeURIComponent(searchTerm)}&loc=${encodeURIComponent(locationTerm)}`); };

  return (
    <div className="min-h-screen bg-[#f6fbf9] flex flex-col">
      <Header />
      <section className="w-full relative overflow-visible bg-gradient-to-br from-[#e8f6f2] via-[#eefaf6] to-[#fdf3d7] border-b border-teal-900/[0.06]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.45]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(22,66,63,0.09) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
          <motion.div animate={{ y: [-12, 12], x: [0, 8] }} transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute -top-16 -right-16 w-[420px] h-[420px] rounded-full bg-teal-300/20 blur-[70px]" />
          <motion.div animate={{ y: [10, -10], x: [0, -6] }} transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute -bottom-20 -left-16 w-[520px] h-[520px] rounded-full bg-amber-200/30 blur-[80px]" />
          <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 9, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/40 blur-[90px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 relative">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.14em] uppercase text-teal-800">
                <span className="w-7 h-[2px] bg-teal-700 rounded-full" /> Tuyển dụng công nghệ — rõ ràng & tôn trọng
              </div>
              <h1 className="mt-4 text-[38px] sm:text-[54px] lg:text-[62px] font-black tracking-[-0.04em] leading-[0.9] text-[#0e2e2e]">
                Tìm nơi bạn<br />
                <span className="relative inline-block text-[#0f766e]">
                  làm việc tốt.
                  <span className="absolute left-0 right-0 -bottom-1 h-[10px] bg-[#0f766e]/15 rounded-full -z-10" />
                </span>
              </h1>
              <p className="mt-5 text-[15px] sm:text-[17px] leading-relaxed text-slate-600 max-w-[560px]">
                Việc đã duyệt, lương công khai. Kết nối ứng viên & đội ngũ bằng trải nghiệm minh bạch — không ồn ào.
              </p>
              <motion.form onSubmit={handleSearchSubmit} whileHover={{ y: -1 }} className="mt-8 p-2 bg-white rounded-[20px] border border-teal-900/10 shadow-[0_16px_40px_rgba(16,60,57,0.10),0_1px_0_rgba(16,60,57,0.04)] flex flex-col md:flex-row gap-2">
                <div className="flex items-center gap-2.5 px-4 py-3.5 bg-[#f0faf7] rounded-[14px] flex-grow min-w-0 border border-transparent focus-within:bg-white focus-within:border-teal-600 focus-within:shadow-[0_0_0_3px_rgba(13,148,136,0.14)] transition-all">
                  <Search size={18} className="text-teal-700 shrink-0" />
                  <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Chức danh, kỹ năng, công ty" className="w-full bg-transparent outline-none text-[14px] font-medium text-slate-800 placeholder:text-slate-400" aria-label="Từ khóa" />
                </div>
                <div className="relative md:w-[200px] shrink-0">
                  <button type="button" onClick={()=>setLocOpen(v=>!v)} className={`w-full flex items-center gap-2 px-4 py-3.5 rounded-[14px] border text-left text-[14px] font-medium transition-all ${locOpen ? 'bg-white border-teal-600 shadow-[0_0_0_3px_rgba(13,148,136,0.14)]' : 'bg-[#f0faf7] border-transparent hover:bg-white hover:border-slate-200'}`}>
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="flex-1 truncate text-slate-700">{locationTerm}</span>
                    <motion.span animate={{ rotate: locOpen?180:0 }}><ChevronDown size={14} className="text-slate-400" /></motion.span>
                  </button>
                  <AnimatePresence>
                    {locOpen && (
                      <motion.ul initial={{ opacity:0, y:8, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:0.98 }} transition={{ duration:0.18, ease:[0.22,1,0.36,1] }} className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_16px_40px_rgba(16,60,57,0.16)] overflow-hidden py-1.5">
                        {['Tất cả địa điểm','Hồ Chí Minh','Hà Nội','Remote','Đà Nẵng'].map(opt => (
                          <li key={opt}><button type="button" onClick={()=>{setLocationTerm(opt);setLocOpen(false);}} className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center justify-between hover:bg-teal-50 transition ${locationTerm===opt ? 'font-bold text-teal-700 bg-teal-50' : 'text-slate-700'}`}>{opt}{locationTerm===opt && <CheckCircle2 size={14} className="text-teal-600" />}</button></li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button whileTap={{ scale:0.97 }} whileHover={{ scale:1.01 }} type="submit" className="bg-[#0f2a2e] hover:bg-black text-white font-black px-7 py-3.5 rounded-[14px] flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_8px_20px_rgba(15,42,46,0.25)]">
                  Tìm việc <ArrowRight size={18} />
                </motion.button>
              </motion.form>
              <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600"><TrendingUp size={14} className="text-teal-600" /> Đang tìm nhiều:</span>
                {roles.map(r => (
                  <Link key={r} to={`/jobs?q=${encodeURIComponent(r)}`} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition">{r}</Link>
                ))}
                <span className="ml-1 hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {jobs.length} việc đang mở</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><ShieldCheck size={12} /> Tin đã duyệt</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200"><Zap size={12} /> AI matching</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"><Building2 size={12} /> {companiesReal.length || 0} công ty</span>
              </div>
            </Reveal>
            <div style={{ perspective: 900 }} className="w-full flex justify-center lg:justify-end">
              <motion.div ref={tiltRef} onMouseEnter={()=>paused.current=true} onMouseLeave={()=>{paused.current=false;onTiltLeave();}} onMouseMove={onTiltMove} style={{ rotateX: rx, rotateY: ry, transformStyle:'preserve-3d' }} className={`relative overflow-hidden p-7 sm:p-8 rounded-[28px] shadow-[0_24px_64px_rgba(2,12,20,0.40)] lg:max-w-[420px] w-full ${signals[sigIdx].bg} text-white`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${signals[sigIdx].glow} to-transparent pointer-events-none`} />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div style={{ transform:'translateZ(24px)' }} className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.16em] uppercase opacity-90"><span className={`w-2 h-2 rounded-full ${signals[sigIdx].accent} animate-pulse`} /> itmatch signal</span>
                  <span className="text-[11px] font-bold tracking-widest opacity-60 tabular-nums">0{sigIdx+1} / 0{signals.length}</span>
                </div>
                <div style={{ transform:'translateZ(36px)' }} className="relative mt-8 h-[110px] overflow-hidden">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.p key={sigIdx} custom={dir} initial={{ opacity:0, x:dir*28 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:dir*-28 }} transition={{ duration:0.42, ease:[0.22,1,0.36,1] }} drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.3} onDragEnd={(_,info)=>{ if(info.offset.x<-40) go(sigIdx+1); else if(info.offset.x>40) go(sigIdx-1); }} className="text-[24px] sm:text-[28px] font-black leading-[1.1] tracking-tight cursor-grab active:cursor-grabbing">
                      “{signals[sigIdx].q}”
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div style={{ transform:'translateZ(18px)' }} className="relative mt-6 flex gap-1.5">
                  {signals.map((_,i)=>(<button key={i} onClick={()=>go(i)} aria-label={`Signal ${i+1}`} className={`h-1.5 rounded-full transition-all ${i===sigIdx ? 'w-7 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'}`} />))}
                </div>
                <div style={{ transform:'translateZ(18px)' }} className="relative mt-5 grid grid-cols-2 gap-4 pt-5 border-t border-white/10">
                  <div><strong className="block text-[30px] font-black tracking-tight leading-none">{signals[sigIdx].a.v}</strong><span className="text-xs opacity-70">{signals[sigIdx].a.l}</span></div>
                  <div><strong className="block text-[30px] font-black tracking-tight leading-none">{signals[sigIdx].b.v}</strong><span className="text-xs opacity-70">{signals[sigIdx].b.l}</span></div>
                </div>
                <Link to={signals[sigIdx].to} style={{ transform:'translateZ(20px)' }} className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all">
                  {signals[sigIdx].cta} <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Reveal>
          <section className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_8px_24px_rgba(15,42,46,0.06)] p-6 grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Thông tin minh bạch', desc: 'Lương, hình thức, quy trình tuyển dụng rõ ràng từ đầu.', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { icon: Layers, title: 'Đúng ngành công nghệ', desc: 'Tập trung vào vai trò & kỹ năng tạo ra sản phẩm thực.', color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { icon: Sparkles, title: 'Hai phía cùng tốt hơn', desc: 'Kết nối tôn trọng — ứng viên & đội ngũ đều có lợi.', color: 'text-amber-600 bg-amber-50 border-amber-200' },
            ].map(item=>(
              <div key={item.title} className="flex gap-4">
                <span className={`w-10 h-10 rounded-xl border grid place-items-center shrink-0 ${item.color}`}><item.icon size={18} /></span>
                <div>
                  <strong className="block text-[13px] font-black text-slate-900">{item.title}</strong>
                  <span className="block mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</span>
                </div>
              </div>
            ))}
          </section>
        </Reveal>
        <Reveal delay={0.06}>
          <section className="mt-10">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-700 flex items-center gap-2"><span className="w-6 h-[2px] bg-teal-700 rounded-full" /> Cơ hội mới mỗi ngày</p>
                <h2 className="text-[26px] sm:text-[32px] font-black tracking-tight text-slate-900 mt-1">Việc làm đáng xem</h2>
                <p className="text-xs text-slate-500 mt-1">Gợi ý theo hồ sơ của bạn · Cập nhật liên tục</p>
              </div>
              <Link to="/jobs" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-black text-teal-700 hover:text-teal-800">Xem tất cả <ArrowRight size={16} /></Link>
            </div>
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">{[1,2,3,4].map(i=><div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 h-48 animate-pulse" />)}</div>
            ) : (
              <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:'-50px' }} variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.08 } } }} className="grid md:grid-cols-2 gap-6">
                {jobs.slice(0,4).map(job=>(
                  <motion.div key={job.id||job.slug} variants={{ hidden:{ opacity:0, y:14 }, show:{ opacity:1, y:0, transition:{ duration:0.4 } } }}>
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </motion.div>
            )}
            <Link to="/jobs" className="sm:hidden mt-4 inline-flex items-center gap-1 text-sm font-black text-teal-700">Xem tất cả <ArrowRight size={16} /></Link>
          </section>
        </Reveal>
        <Reveal delay={0.08}>
          <section className="mt-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-700 flex items-center gap-2"><span className="w-6 h-[2px] bg-teal-700 rounded-full" /> Nơi bạn sẽ muốn làm việc</p>
                <h2 className="text-[26px] sm:text-[32px] font-black tracking-tight text-slate-900 mt-1">Các đội ngũ đang xây dựng</h2>
              </div>
              <Link to="/companies" className="hidden sm:inline-flex items-center gap-1 text-sm font-black text-teal-700">Xem tất cả <ArrowRight size={16} /></Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(companiesReal.length ? companiesReal.slice(0,3) : []).map(company=>{
                const slug = company.slug || (company.name ? company.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') : '') || company._id;
                if(!slug) return null;
                return (
                  <Link key={slug} to={`/companies/${slug}`} className="group bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:border-teal-300 hover:shadow-[0_12px_32px_rgba(16,60,57,0.10)] hover:-translate-y-1 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 border border-slate-200 grid place-items-center font-black text-teal-800 overflow-hidden shrink-0">
                      {company.logo?.startsWith?.('http') ? <img src={company.logo} alt="" className="w-full h-full object-cover" /> : (company.logo || company.name?.[0] || 'C')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-slate-900 text-sm truncate group-hover:text-teal-700">{company.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{company.industry || 'Công nghệ'} · {company.address || 'Việt Nam'}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 size={10} /> Đã duyệt</span>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 grid place-items-center text-slate-400 transition"><ArrowRight size={14} /></span>
                  </Link>
                );
              })}
            </div>
            {companiesReal.length===0 && <p className="text-sm text-slate-400 mt-4 text-center py-8 bg-white border border-dashed border-slate-200 rounded-2xl">Chưa có công ty được duyệt — dữ liệu thật từ DB.</p>}
          </section>
        </Reveal>
        <Reveal delay={0.1}>
          <section className="mt-12 grid md:grid-cols-2 gap-6">
            <Link to="/auth?register=true" className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-[24px] p-8 flex flex-col justify-between min-h-[220px] hover:shadow-[0_16px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-200/40 rounded-full blur-2xl" />
              <UsersRound size={28} className="text-emerald-700 relative" />
              <div className="relative">
                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Dành cho ứng viên</p>
                <h3 className="text-[22px] font-black tracking-tight text-slate-900 mt-1">Để cơ hội tìm thấy bạn.</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Hoàn thiện hồ sơ, theo dõi ứng tuyển và nhận gợi ý phù hợp hơn.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-emerald-700 group-hover:gap-2 transition-all">Tạo hồ sơ ngay <ArrowRight size={16} /></span>
              </div>
            </Link>
            <Link to="/auth?register=true&role=employer" className="relative overflow-hidden bg-[#0f2a2e] text-white rounded-[24px] p-8 flex flex-col justify-between min-h-[220px] hover:shadow-[0_16px_40px_rgba(15,42,46,0.30)] hover:-translate-y-1 transition-all group border border-white/10">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl" />
              <BriefcaseBusiness size={28} className="text-blue-300 relative" />
              <div className="relative">
                <p className="text-[11px] font-black uppercase tracking-widest text-blue-300">Dành cho nhà tuyển dụng</p>
                <h3 className="text-[22px] font-black tracking-tight mt-1">Tìm đúng người, xây đúng đội.</h3>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed">Quản lý tin & pipeline ứng viên trong một không gian gọn gàng.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-white group-hover:gap-2 transition-all">Đăng tin miễn phí <ArrowRight size={16} /></span>
              </div>
            </Link>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
