const jwt = require('jsonwebtoken');
const { getJobBySlug, getJobs, getJobsByEmployer, createJob, updateJob, deleteJob } = require('../services/job.service');
const { getUserProfile } = require('../services/auth.service');

const getSkillsOfCurrentUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'itmatch-secret');
      const profile = await getUserProfile(decoded.id);
      return profile.skills || [];
    }
  } catch (e) {
    // Ignore error
  }
  return null;
};

const listJobs = async (req, res) => {
  try {
    const userSkills = await getSkillsOfCurrentUser(req);
    const jobs = await getJobs(userSkills);
    return res.status(200).json({
      message: 'Lấy danh sách việc làm thành công',
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

const getJobDetail = async (req, res) => {
  try {
    const userSkills = await getSkillsOfCurrentUser(req);
    const job = await getJobBySlug(req.params.slug, userSkills);

    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy việc làm' });
    }

    return res.status(200).json({
      message: 'Lấy chi tiết việc làm thành công',
      job,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

const listEmployerJobs = async (req, res) => {
  try {
    const jobs = await getJobsByEmployer(req.user.id);
    return res.status(200).json({
      message: 'Lấy danh sách tin đã đăng thành công',
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

const createJobController = async (req, res) => {
  try {
    const result = await createJob(req.body, req.user.id, req.user.name || req.body.company);
    return res.status(201).json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      message: status === 500 ? 'Lỗi server' : error.message,
    });
  }
};

const updateJobController = async (req, res) => {
  try {
    const result = await updateJob(req.params.id, req.body, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      message: status === 500 ? 'Lỗi server' : error.message,
    });
  }
};

const deleteJobController = async (req, res) => {
  try {
    const result = await deleteJob(req.params.id, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      message: status === 500 ? 'Lỗi server' : error.message,
    });
  }
};

module.exports = {
  listJobs,
  getJobDetail,
  listEmployerJobs,
  createJobController,
  updateJobController,
  deleteJobController,
};