const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { calculateMatchingScore } = require('../utils/matching');
const { demoJobs } = require('./job.service');

const demoApplications = [
  {
    id: 'app-1',
    userId: 'cand-1',
    jobId: 'senior-frontend-engineer-grab',
    companyId: 'emp-1',
    cvUrl: 'https://cloudinary.com/demo-cv.pdf',
    coverLetter: 'Tôi rất mong muốn được gia nhập đội ngũ Grab!',
    matchScore: 80,
    status: 'pending',
    companyNote: '',
    appliedAt: new Date().toISOString(),
  },
];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const applyJob = async ({ jobId, cvUrl, coverLetter }, userId) => {
  if (!jobId) {
    const error = new Error('Thiếu ID công việc');
    error.statusCode = 400;
    throw error;
  }

  // Lấy kỹ năng của ứng viên
  let candidateSkills = [];
  let userObj = null;

  if (isDatabaseReady()) {
    userObj = await User.findById(userId);
    if (userObj) {
      candidateSkills = userObj.skills || [];
    }
  } else {
    const { demoUsers } = require('./auth.service');
    userObj = demoUsers.find((u) => u.id === userId);
    if (userObj) {
      candidateSkills = userObj.skills || [];
    }
  }

  // Lấy chi tiết công việc để tính matching
  let jobObj = null;
  let companyId = null;
  let jobTitle = '';
  let companyName = '';

  if (isDatabaseReady()) {
    jobObj = await Job.findById(jobId);
    if (!jobObj) {
      const error = new Error('Không tìm thấy việc làm');
      error.statusCode = 404;
      throw error;
    }
    companyId = jobObj.companyId || jobObj._id; // fallback
    jobTitle = jobObj.title;
    companyName = jobObj.company;
  } else {
    jobObj = demoJobs.find((j) => j.id === jobId || j.slug === jobId);
    if (!jobObj) {
      const error = new Error('Không tìm thấy việc làm');
      error.statusCode = 404;
      throw error;
    }
    companyId = jobObj.companyId || 'employer-demo-id';
    jobTitle = jobObj.title;
    companyName = jobObj.company;
  }

  const finalCvUrl = cvUrl || (userObj ? userObj.cvUrl : '') || 'https://example.com/cv.pdf';

  // Tính điểm Matching Score
  const jobTags = jobObj.tags && jobObj.tags.length > 0 ? jobObj.tags : (jobObj.requirements || []);
  const reqs = jobObj.requirements && jobObj.requirements.length > 0 ? jobObj.requirements : jobTags;
  const matchResult = calculateMatchingScore(candidateSkills, reqs);

  if (isDatabaseReady()) {
    // Kiểm tra đã ứng tuyển chưa
    const existingApp = await Application.findOne({ userId, jobId });
    if (existingApp) {
      const error = new Error('Bạn đã nộp đơn ứng tuyển cho công việc này rồi');
      error.statusCode = 400;
      throw error;
    }

    const app = await Application.create({
      userId,
      jobId,
      companyId,
      cvUrl: finalCvUrl,
      coverLetter: coverLetter || '',
      matchScore: matchResult.score,
      status: 'pending',
    });

    // Tăng số lượng ứng viên của tin
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    return {
      message: 'Ứng tuyển thành công',
      application: app,
    };
  }

  // Demo mode
  const existingApp = demoApplications.find((a) => a.userId === userId && (a.jobId === jobId || a.jobId === jobObj.slug));
  if (existingApp) {
    const error = new Error('Bạn đã nộp đơn ứng tuyển cho công việc này rồi');
    error.statusCode = 400;
    throw error;
  }

  // Tăng applicants count trong demo
  jobObj.applicants = (jobObj.applicants || 0) + 1;

  const app = {
    id: Date.now().toString(),
    userId,
    jobId: jobObj.slug || jobObj.id,
    jobTitle,
    companyName,
    companyId,
    cvUrl: finalCvUrl,
    coverLetter: coverLetter || '',
    matchScore: matchResult.score,
    status: 'pending',
    companyNote: '',
    appliedAt: new Date().toISOString(),
  };

  demoApplications.push(app);

  return {
    message: 'Ứng tuyển thành công (Demo)',
    application: app,
  };
};

const getMyApplications = async (userId) => {
  if (isDatabaseReady()) {
    const apps = await Application.find({ userId })
      .populate('jobId')
      .sort({ createdAt: -1 });

    return apps.map((app) => ({
      id: app._id.toString(),
      jobId: app.jobId ? app.jobId._id.toString() : null,
      jobTitle: app.jobId ? app.jobId.title : 'Việc làm đã xóa',
      companyName: app.jobId ? app.jobId.company : 'Công ty không xác định',
      cvUrl: app.cvUrl,
      coverLetter: app.coverLetter,
      matchScore: app.matchScore,
      status: app.status,
      companyNote: app.companyNote,
      appliedAt: app.createdAt,
    }));
  }

  const apps = demoApplications.filter((a) => a.userId === userId);
  return apps;
};

const getEmployerApplications = async (employerId) => {
  if (isDatabaseReady()) {
    const apps = await Application.find({ companyId: employerId })
      .populate('userId', 'name email skills phone')
      .populate('jobId', 'title slug')
      .sort({ createdAt: -1 });

    return apps.map((app) => ({
      id: app._id.toString(),
      candidateName: app.userId ? app.userId.name : 'Ứng viên ẩn danh',
      candidateEmail: app.userId ? app.userId.email : '',
      candidatePhone: app.userId ? app.userId.phone : '',
      candidateSkills: app.userId ? app.userId.skills : [],
      jobTitle: app.jobId ? app.jobId.title : 'Việc làm',
      jobSlug: app.jobId ? app.jobId.slug : '',
      cvUrl: app.cvUrl,
      coverLetter: app.coverLetter,
      matchScore: app.matchScore,
      status: app.status,
      companyNote: app.companyNote,
      appliedAt: app.createdAt,
    }));
  }

  // Demo mode
  const { demoUsers } = require('./auth.service');
  return demoApplications.map((app) => {
    const user = demoUsers.find((u) => u.id === app.userId) || { name: 'Nguyễn Minh Anh', email: 'minhanh@example.com', phone: '0987654321', skills: ['React', 'Git'] };
    return {
      id: app.id,
      candidateName: user.name,
      candidateEmail: user.email,
      candidatePhone: user.phone || '0987654321',
      candidateSkills: user.skills || [],
      jobTitle: app.jobTitle || 'Senior Frontend Engineer',
      jobSlug: app.jobId,
      cvUrl: app.cvUrl,
      coverLetter: app.coverLetter,
      matchScore: app.matchScore,
      status: app.status,
      companyNote: app.companyNote,
      appliedAt: app.appliedAt,
    };
  });
};

const updateApplicationStatus = async (applicationId, { status, companyNote }, employerId) => {
  if (!status) {
    const error = new Error('Thiếu trạng thái cập nhật');
    error.statusCode = 400;
    throw error;
  }

  if (isDatabaseReady()) {
    const app = await Application.findById(applicationId);
    if (!app) {
      const error = new Error('Không tìm thấy đơn ứng tuyển');
      error.statusCode = 404;
      throw error;
    }

    if (app.companyId.toString() !== employerId) {
      const error = new Error('Bạn không có quyền sửa đơn này');
      error.statusCode = 403;
      throw error;
    }

    app.status = status;
    if (companyNote !== undefined) {
      app.companyNote = companyNote;
    }
    await app.save();

    return {
      message: 'Cập nhật trạng thái thành công',
      application: app,
    };
  }

  // Demo mode
  const appIndex = demoApplications.findIndex((a) => a.id === applicationId);
  if (appIndex === -1) {
    const error = new Error('Không tìm thấy đơn ứng tuyển');
    error.statusCode = 404;
    throw error;
  }

  demoApplications[appIndex].status = status;
  if (companyNote !== undefined) {
    demoApplications[appIndex].companyNote = companyNote;
  }

  return {
    message: 'Cập nhật trạng thái thành công (Demo)',
    application: demoApplications[appIndex],
  };
};

module.exports = {
  applyJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  demoApplications,
};
