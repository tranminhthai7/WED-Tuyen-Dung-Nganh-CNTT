import { ArrowRight, BriefcaseBusiness, Clock3, Heart, MapPin } from 'lucide-react';

export default function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="job-company-wrapper">
          <div className={`company-logo ${job.tone}`}>{job.logo}</div>
          <div>
            <div className="job-company">{job.company}</div>
            <span className="job-posted">{job.posted}</span>
          </div>
        </div>

        <button className="favorite" type="button" aria-label="Lưu việc làm">
          <Heart size={16} />
        </button>
      </div>

      <h3>{job.title}</h3>

      <div className="job-detail">
        <span>
          <MapPin size={15} /> {job.location}
        </span>
        <span>
          <BriefcaseBusiness size={15} /> {job.mode} · {job.salary}
        </span>
        <span>
          <Clock3 size={15} /> {job.experience}
        </span>
      </div>

      <div className="job-tags">
        {job.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <div className="job-footer">
        <span>{job.type}</span>
        <span className="job-link">Xem chi tiết <ArrowRight size={15} /></span>
      </div>
    </article>
  );
}
