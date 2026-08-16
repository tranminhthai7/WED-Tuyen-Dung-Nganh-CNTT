import { ArrowRight, Search, Sparkles, Star } from 'lucide-react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import StatCard from '../components/StatCard';

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

export default function HomePage() {
  return (
    <div className="page-shell">
      <Header />

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
              <button className="search-button" type="button">
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
                <StatCard key={item.label} item={item} />
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
            <button className="mini-button" type="button">Tìm việc</button>
          </div>

          <div className="pill-group">
            {['Frontend', 'Backend', 'DevOps', 'Data', 'QA'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="job-list">
            {jobs.map((job) => (
              <JobCard key={job.title} job={job} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
