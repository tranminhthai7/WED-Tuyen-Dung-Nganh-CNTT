const { getJobBySlug, getJobs } = require('../services/job.service');

const listJobs = async (req, res) => {
  try {
    const jobs = await getJobs();
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
    const job = await getJobBySlug(req.params.slug);

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

module.exports = {
  listJobs,
  getJobDetail,
};