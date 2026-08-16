import { ArrowRight, BriefcaseBusiness, MapPin } from 'lucide-react';

export default function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-meta">
        <div className="job-company">{job.company}</div>
        <button className="favorite" type="button">☆</button>
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
  );
}
