const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không tìm thấy token xác thực. Vui lòng đăng nhập.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'itmatch-secret');
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực người dùng.' });
    }

    const hasRole = Array.isArray(roles) ? roles.includes(req.user.role) : req.user.role === roles;
    if (!hasRole) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này.' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
};
