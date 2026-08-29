const mongoose = require('mongoose');
const Job = require('../models/Job');
const { calculateMatchingScore } = require('../utils/matching');

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
    requirements: ['React', 'TypeScript', 'Next.js', 'Git', 'REST API'],
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
    requirements: ['Figma', 'UX Research', 'Design System', 'UI Design', 'Wireframing'],
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
    requirements: ['Golang', 'Microservices', 'AWS', 'Docker', 'REST API'],
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
    requirements: ['SQL', 'Python', 'BI', 'Excel', 'Tableau'],
    posted: '5 ngày trước',
    applicants: 32,
  },
];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const normalizeJob = (job, userSkills = null) => {
  const jobTags = job.tags && job.tags.length > 0 ? job.tags : (job.requirements || []);
  const reqs = job.requirements && job.requirements.length > 0 ? job.requirements : jobTags;

  let matchResult = { score: 0, missingSkills: reqs, matchedSkills: [] };
  if (userSkills) {
    matchResult = calculateMatchingScore(userSkills, reqs);
  }

  return {
    id: job._id ? job._id.toString() : job.id,
    companyId: job.companyId ? job.companyId.toString() : null,
    slug: job.slug,
    title: job.title,
    company: job.company,
    logo: job.logo,
    tone: job.tone,
    location: job.location,
    salary: job.salary,
    mode: job.mode,
    type: job.type || 'Full-time',
    level: job.level || 'Junior',
    quantity: job.quantity || 1,
    deadline: job.deadline,
    status: job.status || 'active',
    views: job.views || 0,
    experience: job.experience,
    tags: jobTags,
    requirements: reqs,
    posted: job.posted || 'Vừa đăng',
    applicants: job.applicants || 0,
    matchingScore: matchResult.score,
    missingSkills: matchResult.missingSkills,
    matchedSkills: matchResult.matchedSkills,
  };
};

const getJobs = async (userSkills = null) => {
  if (isDatabaseReady()) {
    const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
    return jobs.map((job) => normalizeJob(job, userSkills));
  }

  return demoJobs.map((job) => normalizeJob(job, userSkills));
};

const getJobBySlug = async (slug, userSkills = null) => {
  if (isDatabaseReady()) {
    const job = await Job.findOne({ slug });
    if (job) {
      // Tăng view
      job.views = (job.views || 0) + 1;
      await job.save();
      return normalizeJob(job, userSkills);
    }
    return null;
  }

  const job = demoJobs.find((item) => item.slug === slug);
  return job ? normalizeJob(job, userSkills) : null;
};

const getJobsByEmployer = async (employerId) => {
  if (isDatabaseReady()) {
    const jobs = await Job.find({ companyId: employerId }).sort({ createdAt: -1 });
    return jobs.map((job) => normalizeJob(job));
  }

  return demoJobs.map((job) => normalizeJob(job));
};

const createJob = async (jobData, employerId, employerName) => {
  const { title, location, salary, mode, experience, tags, requirements, description, deadline, level, quantity } = jobData;

  if (!title || !location) {
    const error = new Error('Tiêu đề và địa điểm là bắt buộc');
    error.statusCode = 400;
    throw error;
  }

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

  const newJobObj = {
    companyId: employerId,
    slug,
    title,
    company: employerName || 'Nhà tuyển dụng',
    logo: employerName ? employerName.charAt(0).toUpperCase() : 'N',
    tone: 'tone-blue',
    location,
    salary: salary || 'Cạnh tranh',
    mode: mode || 'On-site',
    experience: experience || 'Không yêu cầu',
    tags: tags || [],
    requirements: requirements || tags || [],
    description: description || '',
    deadline: deadline ? new Date(deadline) : undefined,
    level: level || 'Junior',
    quantity: quantity || 1,
    status: 'pending',
    posted: 'Vừa xong',
    applicants: 0,
  };

  if (isDatabaseReady()) {
    const newJob = await Job.create(newJobObj);
    return {
      message: 'Tạo tin tuyển dụng thành công',
      job: normalizeJob(newJob),
    };
  }

  newJobObj.id = Date.now().toString();
  demoJobs.unshift(newJobObj);

  return {
    message: 'Tạo tin tuyển dụng thành công (Demo)',
    job: normalizeJob(newJobObj),
  };
};

const updateJob = async (jobId, jobData, employerId) => {
  if (isDatabaseReady()) {
    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error('Không tìm thấy việc làm');
      error.statusCode = 404;
      throw error;
    }

    if (job.companyId.toString() !== employerId) {
      const error = new Error('Bạn không có quyền sửa tin này');
      error.statusCode = 403;
      throw error;
    }

    Object.assign(job, jobData);
    await job.save();
    return {
      message: 'Cập nhật tin thành công',
      job: normalizeJob(job),
    };
  }

  const jobIndex = demoJobs.findIndex((item) => item.id === jobId || item.slug === jobId);
  if (jobIndex === -1) {
    const error = new Error('Không tìm thấy việc làm');
    error.statusCode = 404;
    throw error;
  }

  demoJobs[jobIndex] = {
    ...demoJobs[jobIndex],
    ...jobData,
  };

  return {
    message: 'Cập nhật tin thành công (Demo)',
    job: normalizeJob(demoJobs[jobIndex]),
  };
};

const deleteJob = async (jobId, employerId) => {
  if (isDatabaseReady()) {
    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error('Không tìm thấy việc làm');
      error.statusCode = 404;
      throw error;
    }

    if (job.companyId.toString() !== employerId) {
      const error = new Error('Bạn không có quyền xóa tin này');
      error.statusCode = 403;
      throw error;
    }

    await Job.findByIdAndDelete(jobId);
    return { message: 'Xóa tin tuyển dụng thành công' };
  }

  const jobIndex = demoJobs.findIndex((item) => item.id === jobId || item.slug === jobId);
  if (jobIndex === -1) {
    const error = new Error('Không tìm thấy việc làm');
    error.statusCode = 404;
    throw error;
  }

  demoJobs.splice(jobIndex, 1);
  return { message: 'Xóa tin tuyển dụng thành công (Demo)' };
};

module.exports = {
  getJobs,
  getJobBySlug,
  getJobsByEmployer,
  createJob,
  updateJob,
  deleteJob,
  demoJobs,
};