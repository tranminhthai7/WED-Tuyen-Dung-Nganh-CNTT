import { ArrowRight } from 'lucide-react';

const navItems = ['Tìm việc', 'Công ty', 'Cẩm nang nghề nghiệp'];

export default function Header() {
  return (
    <header className="topbar">
      <div className="brand-group">
        <div className="brand-mark">i</div>
        <span className="brand-name">itmatch</span>
        <span className="brand-dot">.</span>
      </div>

      <nav className="main-nav" aria-label="Điều hướng chính">
        {navItems.map((item) => (
          <a href="#" key={item}>{item}</a>
        ))}
      </nav>

      <div className="header-actions">
        <button className="ghost-link employer-link" type="button">Đăng tuyển</button>
        <button className="ghost-link" type="button">Đăng nhập</button>
        <button className="primary-button" type="button">
          Tạo tài khoản
          <ArrowRight size={16} />
        </button>
      </div>
    </header>
  );
}
