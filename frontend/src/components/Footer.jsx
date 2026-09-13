import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1f1e] text-teal-100/75 border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-black text-xl text-white">
              <span className="grid size-8 place-items-center rounded-lg bg-white text-[#0a1f1e] text-sm">i</span>
              itmatch<span className="text-teal-400">.</span>
            </Link>
            <p className="text-xs leading-relaxed mt-3 max-w-sm text-teal-100/60">Nền tảng tuyển dụng CNTT — kết nối ứng viên & đội ngũ bằng dữ liệu thật, minh bạch lương & quy trình. Vận hành như TopCV / ITviec cho đồ án.</p>
            <ul className="mt-4 space-y-2 text-xs text-teal-100/60">
              <li className="flex gap-2"><MapPin size={14} className="shrink-0 mt-0.5 text-teal-400" /> 123 Duy Tân, Cầu Giấy, Hà Nội — 28 Thảo Điền, TP. Thủ Đức, HCM</li>
              <li className="flex gap-2"><Mail size={14} className="shrink-0 text-teal-400" /> support@itmatch.vn — sales@itmatch.vn</li>
              <li className="flex gap-2"><Phone size={14} className="shrink-0 text-teal-400" /> 1900 636 064 (8:00–18:00, T2–T6)</li>
            </ul>
            <div className="flex items-center gap-2 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="size-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white text-white/80 hover:text-[#0a1f1e] transition-colors"><Facebook size={14} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="size-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white text-white/80 hover:text-[#0a1f1e] transition-colors"><Linkedin size={14} /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Github" className="size-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white text-white/80 hover:text-[#0a1f1e] transition-colors"><Github size={14} /></a>
            </div>
          </div>
          <div>
            <p className="text-xs font-black tracking-widest text-white uppercase">Khám phá</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Việc làm IT (20+ tin thật)</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Công ty đã duyệt</Link></li>
              <li><Link to="/jobs?q=Frontend" className="hover:text-white transition-colors">Frontend · React / Vue</Link></li>
              <li><Link to="/jobs?q=Backend" className="hover:text-white transition-colors">Backend · Node / Java</Link></li>
              <li><Link to="/jobs?q=Remote" className="hover:text-white transition-colors">Việc làm Remote</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-black tracking-widest text-white uppercase">Ứng viên</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/candidate/profile" className="hover:text-white transition-colors">Hồ sơ & CV (AI matching)</Link></li>
              <li><Link to="/candidate/applications" className="hover:text-white transition-colors">Theo dõi đơn ứng tuyển</Link></li>
              <li><Link to="/auth?register=true" className="hover:text-white transition-colors">Tạo tài khoản miễn phí</Link></li>
              <li><span className="text-teal-100/40 text-xs">Bảo mật theo Nghị định 13/2023</span></li>
            </ul>
            <p className="text-xs font-black tracking-widest text-white uppercase mt-6">Nhà tuyển dụng</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/employer/dashboard" className="hover:text-white transition-colors">Đăng tin & duyệt hồ sơ</Link></li>
              <li><Link to="/auth?register=true&role=employer" className="hover:text-white transition-colors">Dành cho công ty</Link></li>
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 h-fit">
            <p className="text-xs font-black tracking-widest text-white uppercase">Nhận tin mới</p>
            <p className="text-xs mt-2 text-teal-100/60 leading-relaxed">Gợi ý việc làm phù hợp mỗi tuần — không spam.</p>
            <form onSubmit={e=>e.preventDefault()} className="mt-3 flex gap-2">
              <input placeholder="Email của bạn" className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-400" />
              <button className="px-4 py-2.5 rounded-xl bg-teal-400 text-[#0a1f1e] text-sm font-black hover:bg-teal-300 transition-colors whitespace-nowrap">Đăng ký</button>
            </form>
            <p className="text-[11px] mt-3 text-teal-100/40 leading-relaxed">Bằng việc đăng ký, bạn đồng ý với <Link to="/jobs" className="underline decoration-white/20 hover:text-white">Điều khoản</Link> & <Link to="/jobs" className="underline decoration-white/20 hover:text-white">Bảo mật</Link>.</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-[11px] text-teal-100/40">
          <p>© 2026 itmatch — Công ty TNHH ITMatch · MST 0109999999 · Giấy phép ĐKKD do Sở KH&ĐT TP. Hà Nội cấp. Dữ liệu việc làm thật từ MongoDB.</p>
          <p className="flex gap-3 shrink-0"><Link to="/jobs" className="hover:text-white">Điều khoản</Link> · <Link to="/jobs" className="hover:text-white">Bảo mật</Link> · <span>Đã đăng ký Bộ Công Thương</span></p>
        </div>
      </div>
    </footer>
  );
}
