import { ArrowRight, BriefcaseBusiness, Clock3, Heart, MapPin, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function JobCard({ job, compact = false }) {
  const [saved, setSaved] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const isCandidate = isAuthenticated && user?.role === 'candidate';
  const score = job.matchingScore;
  const missing = job.missingSkills || [];

  // Match score badges color calculation
  let scoreBadgeColor = 'bg-red-50 text-red-700 border-red-100';
  let scoreColorText = 'Đỏ';
  if (score >= 70) {
    scoreBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    scoreColorText = 'Xanh';
  } else if (score >= 40) {
    scoreBadgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
    scoreColorText = 'Vàng';
  }

  return (
    <article className="bg-white border border-gray-200/80 hover:border-blue-500/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className={`grid size-12 shrink-0 place-items-center rounded-xl text-lg font-black bg-blue-50 text-blue-700`}>
              {job.logo || job.company?.charAt(0).toUpperCase() || 'J'}
            </div>
            <div className="min-w-0">
              <Link to={`/jobs/${job.slug}`} className="block truncate font-bold text-gray-900 hover:text-blue-600 transition-colors text-base">
                {job.title}
              </Link>
              <p className="mt-1 text-sm text-gray-500 font-medium">{job.company}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSaved(!saved)}
            aria-label={saved ? `Bỏ lưu ${job.title}` : `Lưu ${job.title}`}
            className={`p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors ${saved ? 'text-red-500 bg-red-50/50' : ''}`}
          >
            <Heart fill={saved ? 'currentColor' : 'none'} size={18} />
          </button>
        </div>

        {/* Matching Score Section (Unique Algorithm Requirement) */}
        {isCandidate && typeof score === 'number' && score > 0 && (
          <div className={`mt-3 px-3 py-2 border rounded-xl flex flex-col gap-1 text-xs ${scoreBadgeColor}`}>
            <span className="font-bold flex items-center gap-1">
              <Sparkles size={14} className="animate-pulse" />
              {score}% Phù hợp ({scoreColorText})
            </span>
            {missing.length > 0 && (
              <span className="text-[11px] opacity-90 truncate">
                Còn thiếu: {missing.join(', ')}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {job.location}
          </span>
          <span className="flex items-center gap-1 font-semibold text-gray-700">
            <BriefcaseBusiness size={14} />
            {job.salary}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 size={14} />
            {job.posted}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {job.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500 font-medium">
              {job.mode} · {job.experience}
            </span>
            <Link to={`/jobs/${job.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
              Chi tiết <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
