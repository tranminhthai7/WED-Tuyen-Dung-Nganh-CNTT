import { ArrowRight, Lock, Mail, UserRound } from 'lucide-react';

export default function AuthPage() {
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
            <button className="tab active" type="button">Đăng nhập</button>
            <button className="tab" type="button">Đăng ký</button>
          </div>

          <form className="auth-form">
            <label>
              <span>Họ tên</span>
              <div className="input-field">
                <UserRound size={18} />
                <input type="text" placeholder="Nhập họ tên" />
              </div>
            </label>

            <label>
              <span>Email</span>
              <div className="input-field">
                <Mail size={18} />
                <input type="email" placeholder="Nhập email" />
              </div>
            </label>

            <label>
              <span>Mật khẩu</span>
              <div className="input-field">
                <Lock size={18} />
                <input type="password" placeholder="Nhập mật khẩu" />
              </div>
            </label>

            <button className="submit-button" type="submit">
              Đăng nhập
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
