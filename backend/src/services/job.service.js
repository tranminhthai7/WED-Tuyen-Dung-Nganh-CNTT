const mongoose = require('mongoose');
const Job = require('../models/Job');

const demoJobs = [
  {
    slug: 'senior-frontend-engineer-grab',
    title: 'Senior Frontend Engineer',
    company: 'Grab',
    logo: 'G',
    tone: 'tone-emerald',
    location: 'Hồ Chí Minh',
    salary: '2,500 – 4,000 USD',
    mode: 'Hybrid',
    experience: '3+ năm',
    tags: ['React', 'TypeScript', 'Next.js'],
    posted: '2 ngày trước',
    applicants: 18,
  },
  {
    slug: 'product-designer-momo',
    title: 'Product Designer (UI/UX)',
    company: 'MoMo',
    logo: 'M',
    tone: 'tone-pink',
    location: 'Hồ Chí Minh',
    salary: '1,800 – 2,800 USD',
    mode: 'On-site',
    experience: '2+ năm',
    tags: ['Figma', 'UX Research', 'Design System'],
    posted: '1 ngày trước',
    applicants: 24,
  },
  {
    slug: 'backend-engineer-golang-vng',
    title: 'Backend Engineer — Golang',
    company: 'VNG Corporation',
    logo: 'V',
    tone: 'tone-blue',
    location: 'Hồ Chí Minh',
    salary: '2,000 – 3,500 USD',
    mode: 'Hybrid',
    experience: '3+ năm',
    tags: ['Golang', 'Microservices', 'AWS'],
    posted: '3 ngày trước',
    applicants: 12,
  },
  {
    slug: 'data-analyst-tiki',
    title: 'Data Analyst',
    company: 'Tiki',
    logo: 'T',
    tone: 'tone-sky',
    location: 'Hà Nội',
    salary: '1,200 – 2,000 USD',
    mode: 'Remote',
    experience: '1+ năm',
    tags: ['SQL', 'Python', 'BI'],
    posted: '5 ngày trước',
    applicants: 32,
  },
];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const normalizeJob = (job) => ({
  id: job._id ? job._id.toString() : job.id,
  slug: job.slug,
  title: job.title,
  company: job.company,
  logo: job.logo,
  tone: job.tone,
  location: job.location,
  salary: job.salary,
  mode: job.mode,
  experience: job.experience,
  tags: job.tags,
  posted: job.posted,
  applicants: job.applicants,
});

const getJobs = async () => {
  if (isDatabaseReady()) {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return jobs.map(normalizeJob);
  }

  return demoJobs.map(normalizeJob);
};

const getJobBySlug = async (slug) => {
  if (isDatabaseReady()) {
    const job = await Job.findOne({ slug });
    return job ? normalizeJob(job) : null;
  }

  const job = demoJobs.find((item) => item.slug === slug);
  return job ? normalizeJob(job) : null;
};

module.exports = {
  getJobs,
  getJobBySlug,
};