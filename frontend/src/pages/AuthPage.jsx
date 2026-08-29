import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Lock, Mail, UserRound, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { loginAccount, registerAccount } from '../services/authApi';
import useAuthStore from '../store/authStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginFn = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);

  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [role, setRole] = useState(searchParams.get('role') === 'employer' ? 'employer' : 'candidate');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ kind: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Update register toggle when query params change
  useEffect(() => {
    setIsRegister(searchParams.get('register') === 'true');
    setRole(searchParams.get('role') === 'employer' ? 'employer' : 'candidate');
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ kind: 'idle', message: '' });

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: role,
      };

      if (isRegister) {
        payload.name = formData.name;
      }

      const response = isRegister ? await registerAccount(payload) : await loginAccount(payload);

      setStatus({
        kind: 'success',
        message: response.message,
      });

      // Save to Zustand auth store
      if (response.token && response.user) {
        loginFn(response.user, response.token);
        
        // Wait briefly for UI animation, then navigate
        setTimeout(() => {
          if (response.user.role === 'employer') {
            navigate('/employer/dashboard');
          } else if (response.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 800);
      }
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error.message || 'Đã xảy ra lỗi khi gửi yêu cầu',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 shadow-xl rounded-3xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Left Info Panel */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 sm:p-12 text-white flex flex-col justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tight text-white mb-10">
              <span className="grid size-9 place-items-center rounded-xl bg-white text-blue-600 font-bold text-lg">i</span>
              <span>itmatch.</span>
            </Link>

            <h1 className="text-3xl font-black tracking-tight leading-tight mt-6">
              Tham gia cộng đồng công nghệ
            </h1>
            <p className="mt-4 text-sm text-blue-100 opacity-90 leading-relaxed">
              Kết nối ứng viên, nhà tuyển dụng và doanh nghiệp trong hệ sinh thái IT Việt Nam.
            </p>

            <ul className="mt-8 space-y-3.5 text-sm font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-300" /> Hồ sơ chuyên nghiệp</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-300" /> Việc làm phù hợp kỹ năng (Matching Score)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-300" /> Quản lý ứng tuyển dễ dàng</li>
            </ul>
          </div>
          <p className="text-xs text-blue-200 mt-10">Được tin dùng bởi hơn 25,000 ứng viên công nghệ</p>
        </section>

        {/* Right Form Panel */}
        <section className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="flex border-b border-gray-100 mb-6">
            <button
              onClick={() => { setIsRegister(false); navigate('/auth'); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-colors ${!isRegister ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              type="button"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => { setIsRegister(true); navigate('/auth?register=true'); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-colors ${isRegister ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              type="button"
            >
              Đăng ký
            </button>
          </div>

          {status.kind === 'success' && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-100">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{status.message}</span>
            </div>
          )}

          {status.kind === 'error' && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-xl text-xs font-semibold border border-red-100">
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-700">Họ tên</span>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                  <UserRound size={18} className="text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Nhập họ tên"
                    value={formData.name}
                    onChange={handleChange}
                    required={isRegister}
                    className="w-full bg-transparent outline-none text-sm text-gray-800"
                  />
                </div>
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-700">Email</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                <Mail size={18} className="text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-700">Mật khẩu</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                <Lock size={18} className="text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </label>

            {isRegister && (
              <div className="flex flex-col gap-2 mt-1">
                <span className="text-xs font-bold text-gray-700">Tôi muốn làm:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('candidate')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${role === 'candidate' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}
                  >
                    Ứng viên tìm việc
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${role === 'employer' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}
                  >
                    Nhà tuyển dụng
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
              <ArrowRight size={16} />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
