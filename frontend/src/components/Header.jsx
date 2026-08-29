import { ArrowUpRight, Menu, Search, UserRound, LogOut, BriefcaseBusiness, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header border-b border-gray-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tight text-gray-900">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white font-bold text-lg">i</span>
          <span>itmatch<span className="text-blue-600">.</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">Tìm việc</Link>
          <Link to="/#companies" className="hover:text-blue-600 transition-colors">Công ty</Link>
          {isAuthenticated && user?.role === 'candidate' && (
            <>
              <Link to="/candidate/profile" className="hover:text-blue-600 transition-colors">Hồ sơ cá nhân</Link>
              <Link to="/candidate/applications" className="hover:text-blue-600 transition-colors">Đơn ứng tuyển</Link>
            </>
          )}
          {isAuthenticated && user?.role === 'employer' && (
            <Link to="/employer/dashboard" className="hover:text-blue-600 transition-colors">Employer Workspace</Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">Admin Workspace</Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/jobs" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 hidden sm:inline-flex">
            <Search size={20} />
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/employer/dashboard" className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors hidden sm:inline-flex items-center gap-1">
                Đăng tuyển <ArrowUpRight size={16} />
              </Link>
              <Link to="/auth" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                Đăng nhập
              </Link>
              <Link to="/auth?register=true" className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-sm">
                Đăng ký
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 hidden lg:inline-block">
                Chào, <strong>{user?.name}</strong>
              </span>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 md:hidden"
            aria-label="Mở menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/jobs" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600 font-medium">Tìm việc</Link>
          <Link to="/#companies" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600 font-medium">Công ty</Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'candidate' && (
                <>
                  <Link to="/candidate/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600 font-medium">Hồ sơ cá nhân</Link>
                  <Link to="/candidate/applications" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600 font-medium">Đơn ứng tuyển</Link>
                </>
              )}
              {user?.role === 'employer' && (
                <Link to="/employer/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600 font-medium">Employer Workspace</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600 font-medium">Admin Workspace</Link>
              )}
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full text-left py-2 text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
              >
                <LogOut size={18} /> Đăng xuất
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link to="/employer/dashboard" onClick={() => setMenuOpen(false)} className="block text-center py-2 bg-blue-50 text-blue-600 font-medium rounded-lg">Đăng tuyển</Link>
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="block text-center py-2 border border-gray-200 text-gray-700 font-medium rounded-lg">Đăng nhập</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
