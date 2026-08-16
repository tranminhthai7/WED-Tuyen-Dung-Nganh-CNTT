import { ArrowRight, BriefcaseBusiness, MapPin, Search, Sparkles, Star } from 'lucide-react';

const navItems = ['Tìm việc', 'Công ty', 'Cẩm nang nghề nghiệp'];

const tags = ['Frontend', 'Backend', 'Product & Design', 'Data & AI'];

const jobs = [
  {
    title: 'Frontend Developer',
    company: 'FPT Software',
    location: 'Hà Nội',
    type: 'Full-time',
    salary: '18 - 30 triệu',
    skills: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Backend Engineer',
    company: 'Viettel Solutions',
    location: 'Hồ Chí Minh',
    type: 'Full-time',
    salary: '22 - 35 triệu',
    skills: ['Node.js', 'MongoDB', 'AWS'],
  },
  {
    title: 'UI/UX Designer',
    company: 'NashTech',
    location: 'Đà Nẵng',
    type: 'Hybrid',
    salary: '16 - 28 triệu',
    skills: ['Figma', 'UX', 'Design System'],
  },
];

const metrics = [
  { value: '2,480+', label: 'Việc làm mới' },
  { value: '620', label: 'Doanh nghiệp' },
  { value: '95%', label: 'Ứng viên phù hợp' },
];

export default function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-group">
          <div className="brand-mark">i</div>
          <span className="brand-name">itmatch</span>
          <span className="brand-dot">.</span>
        </div>

        <nav className="main-nav">
          {navItems.map((item) => (
            <a href="#" key={item}>{item}</a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="ghost-link">Đăng tuyển</button>
          <button className="ghost-link">Đăng nhập</button>
          <button className="primary-button">Tạo tài khoản</button>
        </div>
      </header>

      <main className="page-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">TUYỂN DỤNG CÔNG NGHỆ, RÕ RÀNG HƠN</p>
            <h1>
              Tìm nơi bạn
              <span>thể làm việc tốt.</span>
            </h1>
            <p className="subtitle">
              Cơ hội thật, thông tin đủ, và những nơi làm việc đáng để đầu tư thời gian.
              Không còn lọc bằng cảm tính, chỉ còn đúng kỹ năng và đúng công việc.
            </p>

            <div className="search-box">
              <div className="search-field">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Tìm công việc, kỹ năng, tên công ty" />
              </div>
              <button className="search-button">
                Tìm việc
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="tag-row">
              {tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
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
              <p>“Một công việc tốt bắt đầu từ một mô tả công việc tệ.”</p>
            </div>

            <div className="signal-numbers">
              {metrics.map((item) => (
                <div key={item.label} className="stat-box">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="feature-section">
          <div className="section-heading">
            <div className="heading-left">
              <div className="heading-icon">
                <Star size={18} />
              </div>
              <span>ITMatch</span>
            </div>
            <span className="heading-text">Việc làm công ty</span>
          </div>

          <h2>Tìm nơi bạn phát triển tốt nhất</h2>
          <p>
            Kết nối ứng viên công nghệ với các công ty đang tuyển dụng với tiêu chí rõ ràng,
            uy tín và phù hợp kỹ năng.
          </p>

          <div className="mini-search">
            <div className="mini-field">
              <Search size={18} />
              <input type="text" placeholder="Tìm công việc, kỹ năng, tên" />
            </div>
            <button className="mini-button">Tìm việc</button>
          </div>

          <div className="pill-group">
            {['Frontend', 'Backend', 'DevOps', 'Data', 'QA'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="job-list">
            {jobs.map((job) => (
              <article key={job.title} className="job-card">
                <div className="job-meta">
                  <div className="job-company">{job.company}</div>
                  <button className="favorite">☆</button>
                </div>

                <h3>{job.title}</h3>

                <div className="job-detail">
                  <span>
                    <MapPin size={15} /> {job.location}
                  </span>
                  <span>
                    <BriefcaseBusiness size={15} /> {job.type} · {job.salary}
                  </span>
                </div>

                <div className="job-tags">
                  {job.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="job-footer">
                  <span>Ứng tuyển ngay</span>
                  <ArrowRight size={16} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
