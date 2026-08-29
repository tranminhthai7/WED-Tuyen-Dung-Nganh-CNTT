const { getAdminStats, getEmployerStats } = require('../services/dashboard.service');

const getStats = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const stats = await getAdminStats();
      return res.status(200).json({
        message: 'Lấy thống kê admin thành công',
        stats,
      });
    } else if (req.user.role === 'employer') {
      const stats = await getEmployerStats(req.user.id);
      return res.status(200).json({
        message: 'Lấy thống kê doanh nghiệp thành công',
        stats,
      });
    } else {
      return res.status(403).json({ message: 'Bạn không có quyền xem thống kê này.' });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi server khi lấy thống kê',
      error: error.message,
    });
  }
};

module.exports = {
  getStats,
};
