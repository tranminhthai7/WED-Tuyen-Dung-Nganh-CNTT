const { loginUser, registerUser, getUserProfile, updateUserProfile } = require('../services/auth.service');
const { hasKeys } = require('../config/cloudinary');

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

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Thiếu file avatar' });
    const url = req.file.path || req.file.secure_url || req.file.location || '';
    // fallback demo khi chua co Cloudinary key: dung ten file tam
    const finalUrl = url || `memory://${req.file.originalname}`;
    if (!hasKeys && !url) {
      console.warn('[upload] Cloudinary chua cau hinh — tra ve url tam thoi');
    }
    const result = await updateUserProfile(req.user.id, { avatar: finalUrl });
    return res.status(200).json({ message: 'Upload avatar thành công', url: finalUrl, user: result.user });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

const uploadCv = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Thiếu file CV (PDF)' });
    const url = req.file.path || req.file.secure_url || req.file.location || '';
    const finalUrl = url || `memory://${req.file.originalname}`;
    const result = await updateUserProfile(req.user.id, { cvUrl: finalUrl });
    return res.status(200).json({ message: 'Upload CV thành công', url: finalUrl, user: result.user });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadCv,
};