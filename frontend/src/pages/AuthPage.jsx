import { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Mail, UserRound } from 'lucide-react';
import { loginAccount, registerAccount } from '../services/authApi';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ kind: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ kind: 'idle', message: '' });

    try {
      const payload = {
        ...formData,
        role: 'candidate',
      };

      const response = isRegister ? await registerAccount(payload) : await loginAccount(payload);

      setStatus({
        kind: 'success',
        message: `${response.message}. Token đã nhận từ backend.`,
      });

      if (response.token) {
        localStorage.setItem('itmatch_token', response.token);
        localStorage.setItem('itmatch_user', JSON.stringify(response.user));
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel left-panel">
          <div className="brand-inline">
            <div className="brand-mark">i</div>
            <span>itmatch</span>
          </div>

          <h1>Tham gia cộng đồng công nghệ</h1>
          <p>
            Kết nối ứng viên, nhà tuyển dụng và doanh nghiệp trong hệ sinh thái IT Việt Nam.
          </p>

          <ul className="feature-list">
            <li>Hồ sơ chuyên nghiệp</li>
            <li>Việc làm phù hợp kỹ năng</li>
            <li>Quản lý ứng tuyển dễ dàng</li>
          </ul>
        </div>

        <div className="auth-panel form-panel">
          <div className="tabs">
            <button className={`tab ${!isRegister ? 'active' : ''}`} type="button" onClick={() => setIsRegister(false)}>Đăng nhập</button>
            <button className={`tab ${isRegister ? 'active' : ''}`} type="button" onClick={() => setIsRegister(true)}>Đăng ký</button>
          </div>

          {status.kind === 'success' && (
            <div className="auth-alert success">
              <CheckCircle2 size={16} />
              <span>{status.message}</span>
            </div>
          )}

          {status.kind === 'error' && (
            <div className="auth-alert error">
              <span>{status.message}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label>
                <span>Họ tên</span>
                <div className="input-field">
                  <UserRound size={18} />
                  <input
                    name="name"
                    type="text"
                    placeholder="Nhập họ tên"
                    value={formData.name}
                    onChange={handleChange}
                    required={isRegister}
                  />
                </div>
              </label>
            )}

            <label>
              <span>Email</span>
              <div className="input-field">
                <Mail size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label>
              <span>Mật khẩu</span>
              <div className="input-field">
                <Lock size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <button className="submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : (isRegister ? 'Đăng ký' : 'Đăng nhập')}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
