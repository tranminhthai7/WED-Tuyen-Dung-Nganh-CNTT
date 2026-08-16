import { ArrowRight, BriefcaseBusiness, Clock3, Heart, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function JobCard({ job, compact = false }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="job-company-wrapper">
          <div className={`company-logo ${job.tone}`}>{job.logo}</div>
          <div className="job-company-meta">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSaved((prev) => !prev)}
          className={`save-button ${saved ? 'is-saved' : ''}`}
          aria-label={saved ? `Bỏ lưu ${job.title}` : `Lưu ${job.title}`}
        >
          <Heart fill={saved ? 'currentColor' : 'none'} size={16} />
        </button>
      </div>

      <div className="job-meta">
        <span>
          <MapPin size={14} />
          {job.location}
        </span>
        <span>
          <BriefcaseBusiness size={14} />
          {job.salary}
        </span>
        <span>
          <Clock3 size={14} />
          {job.posted}
        </span>
      </div>

      {!compact && (
        <>
          <div className="tag-row">
            {job.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>

          <div className="job-footer">
            <span>
              {job.mode} · {job.experience}
            </span>
            <span className="job-link">
              Xem chi tiết
              <ArrowRight size={15} />
            </span>
          </div>
        </>
      )}
    </article>
  );
}
