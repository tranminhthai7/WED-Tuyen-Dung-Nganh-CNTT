const {
  applyJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
} = require('../services/application.service');

const handleAppError = (res, error) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Lỗi server' : error.message,
    error: statusCode === 500 ? error.message : undefined,
  });
};

const submitApplication = async (req, res) => {
  try {
    const result = await applyJob(req.body, req.user.id);
    return res.status(201).json(result);
  } catch (error) {
    return handleAppError(res, error);
  }
};

const listMyApplications = async (req, res) => {
  try {
    const apps = await getMyApplications(req.user.id);
    return res.status(200).json({
      message: 'Lấy danh sách đơn ứng tuyển thành công',
      applications: apps,
    });
  } catch (error) {
    return handleAppError(res, error);
  }
};

const listEmployerApplications = async (req, res) => {
  try {
    const apps = await getEmployerApplications(req.user.id);
    return res.status(200).json({
      message: 'Lấy danh sách hồ sơ ứng tuyển thành công',
      applications: apps,
    });
  } catch (error) {
    return handleAppError(res, error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const result = await updateApplicationStatus(req.params.id, req.body, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return handleAppError(res, error);
  }
};

module.exports = {
  submitApplication,
  listMyApplications,
  listEmployerApplications,
  updateStatus,
};
