import { Search, SlidersHorizontal } from 'lucide-react';

const jobs = [
  { title: 'Senior Frontend Engineer', company: 'FPT Software', location: 'Hà Nội', salary: '25 - 35 triệu', tag: 'Frontend' },
  { title: 'Backend Engineer', company: 'Viettel', location: 'Hồ Chí Minh', salary: '20 - 30 triệu', tag: 'Backend' },
  { title: 'Product Designer', company: 'NashTech', location: 'Đà Nẵng', salary: '18 - 28 triệu', tag: 'Design' },
  { title: 'Data Analyst', company: 'MoMo', location: 'Hồ Chí Minh', salary: '16 - 25 triệu', tag: 'Data' },
];

export default function JobsPage() {
  return (
    <div className="jobs-page">
      <div className="page-header">
        <div>
          <p className="eyebrow-small">Tìm việc</p>
          <h1>Việc làm IT phù hợp</h1>
        </div>
        <button className="filter-button" type="button">
          <SlidersHorizontal size={16} />
          Lọc
        </button>
      </div>

      <div className="search-row">
        <div className="search-field large-field">
          <Search size={18} />
          <input type="text" placeholder="Tìm công việc, vị trí, kỹ năng" />
        </div>
        <button className="search-button" type="button">Tìm kiếm</button>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <article key={job.title} className="jobs-card">
            <div className="jobs-card-top">
              <span className="badge">{job.tag}</span>
              <span className="salary">{job.salary}</span>
            </div>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <div className="meta-row">
              <span>{job.location}</span>
              <span>Full-time</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
