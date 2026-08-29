const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const getAdminStats = async () => {
  if (isDatabaseReady()) {
    const candidatesCount = await User.countDocuments({ role: 'candidate' });
    const employersCount = await User.countDocuments({ role: 'employer' });
    const jobsCount = await Job.countDocuments();
    const applicationsCount = await Application.countDocuments();

    return {
      candidates: candidatesCount,
      employers: employersCount,
      jobs: jobsCount,
      applications: applicationsCount,
    };
  }

  // Demo fallback
  const { demoUsers } = require('./auth.service');
  const { demoJobs } = require('./job.service');
  const { demoApplications } = require('./application.service');

  return {
    candidates: demoUsers.filter((u) => u.role === 'candidate').length + 4520, // offset for visual realism
    employers: demoUsers.filter((u) => u.role === 'employer').length + 320,
    jobs: demoJobs.length + 1840,
    applications: demoApplications.length + 9680,
  };
};

const getEmployerStats = async (employerId) => {
  if (isDatabaseReady()) {
    const activeJobs = await Job.countDocuments({ companyId: employerId, status: 'active' });
    const totalApps = await Application.countDocuments({ companyId: employerId });
    const interviewApps = await Application.countDocuments({ companyId: employerId, status: 'interview' });

    return {
      activeJobs,
      totalApplications: totalApps,
      interviewCandidates: interviewApps,
    };
  }

  // Demo fallback
  const { demoJobs } = require('./job.service');
  const { demoApplications } = require('./application.service');

  const activeJobs = demoJobs.filter((j) => j.companyId === employerId || j.companyId === 'employer-demo-id').length;
  const totalApps = demoApplications.filter((a) => a.companyId === employerId || a.companyId === 'employer-demo-id').length;
  const interviewApps = demoApplications.filter((a) => (a.companyId === employerId || a.companyId === 'employer-demo-id') && a.status === 'interview').length;

  return {
    activeJobs: activeJobs + 12, // offset for visual realism
    totalApplications: totalApps + 236,
    interviewCandidates: interviewApps + 8,
  };
};

module.exports = {
  getAdminStats,
  getEmployerStats,
};
