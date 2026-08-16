import { ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronDown, MapPin, Search, Sparkles, UsersRound } from 'lucide-react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';

const roles = ['Frontend', 'Backend', 'Product & Design', 'Data & AI', 'QA & Automation', 'DevOps & Cloud'];

const jobs = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Grab',
    logo: 'G',
    tone: 'tone-emerald',
    location: 'Hồ Chí Minh',
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
    tone: 'tone-pink',
    location: 'Hồ Chí Minh',
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
    tone: 'tone-blue',
    location: 'Hồ Chí Minh',
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
    tone: 'tone-sky',
    location: 'Hà Nội',
    salary: '1,200 – 2,000 USD',
    mode: 'Remote',
    experience: '1+ năm',
    skills: ['SQL', 'Python', 'BI'],
    posted: '5 ngày trước',
  },
];

const companies = [
  { name: 'FPT Software', logo: 'F', tone: 'tone-orange' },
  { name: 'Shopee Vietnam', logo: 'S', tone: 'tone-orange-soft' },
  { name: 'NashTech', logo: 'N', tone: 'tone-violet' },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-inner">
            <div>
              <p className="eyebrow">Tuyển dụng công nghệ, rõ ràng hơn</p>
              <h1 className="hero-title">
                Tìm nơi bạn có thể <span className="hero-highlight">làm việc tốt.</span>
              </h1>
              <p className="hero-copy">
                Cơ hội thật, thông tin đủ, và những đội ngũ đang tìm đúng người. Không ồn ào,
                không vòng vo.
              </p>

              <form className="search-panel" action="#">
                <div className="search-field">
                  <Search size={18} />
                  <input type="text" placeholder="Chức danh, kỹ năng hoặc tên công ty" aria-label="Từ khóa tìm kiếm" />
                </div>
                <div className="search-field search-location">
                  <MapPin size={18} />
                  <select aria-label="Địa điểm">
                    <option>Tất cả địa điểm</option>
                    <option>Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Remote</option>
                  </select>
                  <ChevronDown size={16} />
                </div>
                <button type="submit" className="primary-button search-submit">
                  Tìm việc
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="role-row">
                <span>Đang được tìm kiếm:</span>
                {roles.slice(0, 4).map((role) => (
                  <a href="#" key={role}>
                    {role}
                  </a>
                ))}
              </div>
            </div>

            <div className="hero-note">
              <div className="note-top">
                <span className="note-label">
                  <Sparkles size={16} />
                  itmatch signal
                </span>
                <span>01 / 04</span>
              </div>

              <p className="note-quote">“Một công việc tốt bắt đầu từ một mô tả công việc tử tế.”</p>

              <div className="note-stats">
                <div>
                  <strong>2,480+</strong>
                  <span>việc đang mở</span>
                </div>
                <div>
                  <strong>620</strong>
                  <span>đội ngũ công nghệ</span>
                </div>
              </div>

              <a href="#jobs" className="note-link">
                Xem toàn bộ cơ hội
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="trust-grid">
            <div>
              <strong>Thông tin minh bạch</strong>
              <span>Lương, hình thức làm việc và quy trình tuyển dụng rõ ràng.</span>
            </div>
            <div>
              <strong>Đúng ngành công nghệ</strong>
              <span>Tập trung vào những vai trò và kỹ năng tạo ra sản phẩm.</span>
            </div>
            <div>
              <strong>Hai phía cùng tốt hơn</strong>
              <span>Kết nối ứng viên và đội ngũ bằng trải nghiệm tôn trọng.</span>
            </div>
          </div>
        </section>

        <section className="content-section" id="jobs">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Cơ hội mới mỗi ngày</p>
              <h2>Việc làm đáng xem</h2>
            </div>
            <a href="#" className="text-link">
              Xem tất cả
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job.title} job={job} />
            ))}
          </div>
        </section>

        <section className="content-section bg-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Nơi bạn sẽ muốn làm việc</p>
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

        <section className="audience-section">
          <div className="audience-grid">
            <a href="#" className="audience-card candidate-card">
              <UsersRound size={28} />
              <div>
                <p className="eyebrow">Dành cho ứng viên</p>
                <h2>Để cơ hội tìm thấy bạn.</h2>
                <p>Hoàn thiện hồ sơ, theo dõi ứng tuyển và nhận gợi ý phù hợp hơn.</p>
              </div>
              <ArrowRight size={18} />
            </a>

            <a href="#" className="audience-card employer-card">
              <BriefcaseBusiness size={28} />
              <div>
                <p className="eyebrow">Dành cho nhà tuyển dụng</p>
                <h2>Tìm đúng người, xây đúng đội.</h2>
                <p>Quản lý tin tuyển dụng và pipeline ứng viên trong một không gian gọn gàng.</p>
              </div>
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
