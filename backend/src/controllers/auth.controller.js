const { loginUser, registerUser, getUserProfile, updateUserProfile } = require('../services/auth.service');

const handleAuthError = (res, error) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Lỗi server' : error.message,
    error: statusCode === 500 ? error.message : undefined,
  });
};

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return handleAuthError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleAuthError(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const userProfile = await getUserProfile(req.user.id);
    return res.status(200).json({
      message: 'Lấy hồ sơ cá nhân thành công',
      user: userProfile,
    });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const result = await updateUserProfile(req.user.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleAuthError(res, error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};