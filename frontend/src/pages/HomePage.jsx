import { ArrowRight, Search, Sparkles, Star } from 'lucide-react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import StatCard from '../components/StatCard';

const roles = ['Frontend', 'Backend', 'Product & Design', 'Data & AI', 'QA & Automation', 'DevOps & Cloud'];

const jobs = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Grab',
    logo: 'G',
    tone: 'bg-emerald-100 text-emerald-700',
    location: 'Hồ Chí Minh',
    type: 'Full-time',
    salary: '2,500 – 4,000 USD',
    mode: 'Hybrid',
    experience: '3+ năm',
    skills: ['React', 'TypeScript', 'Next.js'],
    posted: '2 ngày trước',
  },
  {
    title: 'Product Designer (UI/UX)',
    company: 'MoMo',
    logo: 'M',
    tone: 'bg-pink-100 text-pink-700',
    location: 'Hồ Chí Minh',
    type: 'Full-time',
    salary: '1,800 – 2,800 USD',
    mode: 'On-site',
    experience: '2+ năm',
    skills: ['Figma', 'UX Research', 'Design System'],
    posted: '1 ngày trước',
  },
  {
    title: 'Backend Engineer — Golang',
    company: 'VNG Corporation',
    logo: 'V',
    tone: 'bg-blue-100 text-blue-700',
    location: 'Hồ Chí Minh',
    type: 'Full-time',
    salary: '2,000 – 3,500 USD',
    mode: 'Hybrid',
    experience: '3+ năm',
    skills: ['Golang', 'Microservices', 'AWS'],
    posted: '3 ngày trước',
  },
  {
    title: 'Data Analyst',
    company: 'Tiki',
    logo: 'T',
    tone: 'bg-sky-100 text-sky-700',
    location: 'Hà Nội',
    type: 'Full-time',
    salary: '1,200 – 2,000 USD',
    mode: 'Remote',
    experience: '1+ năm',
    skills: ['SQL', 'Python', 'BI'],
    posted: '5 ngày trước',
  },
];

const metrics = [
  { value: '2,480+', label: 'việc đang mở' },
  { value: '620', label: 'đội ngũ công nghệ' },
];

const companies = [
  { name: 'FPT Software', logo: 'F', tone: 'bg-orange-100 text-orange-700' },
  { name: 'Shopee Vietnam', logo: 'S', tone: 'bg-orange-100 text-orange-600' },
  { name: 'NashTech', logo: 'N', tone: 'bg-violet-100 text-violet-700' },
];

export default function HomePage() {
  return (
    <div className="landing-shell">
      <aside className="side-panel">
        <p className="side-title">itmatch.</p>
        <ul className="side-list">
          <li>Tim việc nhanh.</li>
          <li>Vai trò phổ biến.</li>
          <li>Việc làm nổi bật.</li>
          <li>Công ty công nghệ.</li>
          <li>Khu vực việc làm và nhà tuyển dụng.</li>
          <li>Job card được thiết kế lại theo hướng ưa chuộng.</li>
          <li>Footer, navigation và layout chuẩn rõ ràng.</li>
        </ul>

        <div className="side-footer">
          <p>Giải điện hình tài dụng</p>
          <p>Đa cấp mạng</p>
        </div>
      </aside>

      <div className="main-panel">
        <Header />

        <main className="page-content home-page">
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">TUYỂN DỤNG CÔNG NGHỆ, RÕ RÀNG HƠN</p>
              <h1>
                Tìm nơi bạn có thể
                <span className="hero-highlight">thế làm việc tốt.</span>
              </h1>
              <p className="subtitle">
                Cơ hội thật, thông tin đủ, và những đội ngũ đang tìm đúng người. Không ồn ào,
                không vòng vo.
              </p>

              <div className="search-panel">
                <div className="search-field">
                  <Search size={18} />
                  <input type="text" placeholder="Chức danh, kỹ năng hoặc tên công ty" />
                </div>
                <div className="search-field search-location">
                  <Search size={18} />
                  <select defaultValue="">
                    <option value="" disabled>Tất cả địa điểm</option>
                    <option>Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Remote</option>
                  </select>
                </div>
                <button className="search-button" type="button">
                  Tìm việc
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="role-row">
                <span>Đang được tìm kiếm:</span>
                {roles.slice(0, 4).map((role) => (
                  <a href="#" key={role}>{role}</a>
                ))}
              </div>
            </div>

            <aside className="signal-card">
              <div className="signal-top">
                <div className="signal-icon">
                  <Sparkles size={17} />
                </div>
                <span>itmatch signal</span>
              </div>

              <div className="signal-body">
                <p>“Một công việc tốt bắt đầu từ một mô tả công việc tử tế.”</p>
              </div>

              <div className="signal-numbers">
                {metrics.map((item) => (
                  <StatCard key={item.label} item={item} />
                ))}
              </div>

              <a href="#jobs" className="note-link">
                Xem toàn bộ cơ hội
                <ArrowRight size={16} />
              </a>
            </aside>
          </section>

          <section className="feature-section" id="jobs">
            <div className="section-heading">
              <div>
                <p className="eyebrow-small">Cơ hội mới mỗi ngày</p>
                <h2>Việc làm đáng xem</h2>
              </div>
              <a href="#" className="text-link">
                Xem tất cả
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="job-list">
              {jobs.map((job) => (
                <JobCard key={job.title} job={job} />
              ))}
            </div>
          </section>

          <section className="feature-section bg-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow-small">Nơi bạn sẽ muốn làm việc</p>
                <h2>Các đội ngũ đang xây dựng</h2>
              </div>
              <a href="#" className="text-link">
                Khám phá công ty
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="company-grid">
              {companies.map((company) => (
                <a href="#" key={company.name} className="company-card">
                  <div className={`company-logo ${company.tone}`}>{company.logo}</div>
                  <div>
                    <h3>{company.name}</h3>
                    <p>Technology · Hà Nội · Hồ Chí Minh</p>
                  </div>
                  <span className="company-arrow">
                    <ArrowRight size={16} />
                  </span>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
