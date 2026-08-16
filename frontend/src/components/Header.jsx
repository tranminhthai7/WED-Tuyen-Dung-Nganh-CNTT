import { ArrowRight, ArrowUpRight, Menu, Search, UserRound } from 'lucide-react';

const navItems = ['Tìm việc', 'Công ty', 'Cẩm nang nghề nghiệp'];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand-mark" aria-label="itmatch home">
          <span className="brand-symbol">i</span>
          <span>itmatch</span>
          <span className="brand-dot">.</span>
        </div>

        <nav className="main-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <a href="#" key={item} className="nav-link">
              {item}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button type="button" className="icon-button hidden-mobile" aria-label="Tìm kiếm">
            <Search size={18} />
          </button>

          <button type="button" className="employer-link">
            Đăng tuyển
            <ArrowUpRight size={16} />
          </button>

          <button type="button" className="login-link">
            Đăng nhập
          </button>

          <button type="button" className="primary-button hidden-mobile">
            Tạo tài khoản
          </button>

          <button type="button" className="icon-button mobile-menu-button" aria-label="Mở menu">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
