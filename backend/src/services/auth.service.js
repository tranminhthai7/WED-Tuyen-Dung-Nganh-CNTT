const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const demoUsers = [];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const normalizeEmail = (email) => String(email).toLowerCase().trim();

const normalizeUser = (user) => ({
  id: user._id ? user._id.toString() : user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || '',
  phone: user.phone || '',
  skills: user.skills || [],
  cvUrl: user.cvUrl || '',
  experience: user.experience || '',
  education: user.education || '',
  bio: user.bio || '',
  github: user.github || '',
  linkedin: user.linkedin || '',
});

const registerUser = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    const error = new Error('Thiếu thông tin bắt buộc');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);
  const nextRole = role || 'candidate';
  const hashedPassword = await bcrypt.hash(password, 10);

  if (isDatabaseReady()) {
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      const error = new Error('Email đã tồn tại');
      error.statusCode = 400;
      throw error;
    }

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: nextRole,
    });

    return {
      message: 'Đăng ký thành công',
      user: normalizeUser(newUser),
      token: generateToken(newUser),
    };
  }

  const existingUser = demoUsers.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (existingUser) {
    const error = new Error('Email đã tồn tại');
    error.statusCode = 400;
    throw error;
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: nextRole,
    avatar: '',
    phone: '',
    skills: [],
    cvUrl: '',
    experience: '',
    education: '',
    bio: '',
    github: '',
    linkedin: '',
  };

  demoUsers.push(newUser);

  return {
    message: 'Đăng ký thành công',
    user: normalizeUser(newUser),
    token: generateToken(newUser),
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email và mật khẩu là bắt buộc');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);

  if (isDatabaseReady()) {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const error = new Error('Email không tồn tại');
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error('Mật khẩu không đúng');
      error.statusCode = 400;
      throw error;
    }

    return {
      message: 'Đăng nhập thành công',
      user: normalizeUser(user),
      token: generateToken(user),
    };
  }

  const user = demoUsers.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user) {
    const error = new Error('Email không tồn tại');
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error('Mật khẩu không đúng');
    error.statusCode = 400;
    throw error;
  }

  return {
    message: 'Đăng nhập thành công',
    user: normalizeUser(user),
    token: generateToken(user),
  };
};

const getUserProfile = async (userId) => {
  if (isDatabaseReady()) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }
    return normalizeUser(user);
  }

  const user = demoUsers.find((item) => item.id === userId);
  if (!user) {
    const error = new Error('Không tìm thấy người dùng');
    error.statusCode = 404;
    throw error;
  }
  return normalizeUser(user);
};

const updateUserProfile = async (userId, data) => {
  const allowedUpdates = [
    'name',
    'avatar',
    'phone',
    'skills',
    'cvUrl',
    'experience',
    'education',
    'bio',
    'github',
    'linkedin',
  ];

  const updateObj = {};
  allowedUpdates.forEach((key) => {
    if (data[key] !== undefined) {
      updateObj[key] = data[key];
    }
  });

  if (isDatabaseReady()) {
    const user = await User.findByIdAndUpdate(userId, updateObj, { new: true });
    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }
    return {
      message: 'Cập nhật hồ sơ thành công',
      user: normalizeUser(user),
    };
  }

  const userIndex = demoUsers.findIndex((item) => item.id === userId);
  if (userIndex === -1) {
    const error = new Error('Không tìm thấy người dùng');
    error.statusCode = 404;
    throw error;
  }

  demoUsers[userIndex] = {
    ...demoUsers[userIndex],
    ...updateObj,
  };

  return {
    message: 'Cập nhật hồ sơ thành công',
    user: normalizeUser(demoUsers[userIndex]),
  };
};

const crypto = require('crypto');
const { sendMail } = require('../utils/mail');

const forgotPassword = async (email) => {
  if (!email) {
    const error = new Error('Email là bắt buộc');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);

  if (!isDatabaseReady()) {
    return { message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn (demo)' };
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    // Không tiết lộ email có tồn tại hay không (bảo mật)
    return { message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu' };
  }

  // Tạo token ngẫu nhiên 6 chữ số (OTP style — dễ nhập trên mobile)
  const resetToken = crypto.randomInt(100000, 999999).toString();
  const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpires;
  await user.save();

  // Gửi email
  try {
    await sendMail({
      to: user.email,
      subject: '[ITMatch] Mã xác nhận đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fffe; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0f2a2e; margin: 0;">🔑 Đặt lại mật khẩu</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Bạn vừa yêu cầu đặt lại mật khẩu tài khoản ITMatch</p>
          </div>
          <div style="background: #0f2a2e; color: white; text-align: center; padding: 24px; border-radius: 12px; margin: 16px 0;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0; opacity: 0.8;">Mã xác nhận của bạn</p>
            <p style="font-size: 36px; font-weight: 900; letter-spacing: 8px; margin: 0;">${resetToken}</p>
          </div>
          <p style="color: #64748b; font-size: 13px; text-align: center;">Mã có hiệu lực trong <strong>15 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Lỗi gửi email reset password:', err.message);
  }

  return { message: 'Mã xác nhận đã được gửi đến email của bạn' };
};

const resetPassword = async (email, token, newPassword) => {
  if (!email || !token || !newPassword) {
    const error = new Error('Thiếu thông tin bắt buộc');
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error('Mật khẩu phải có ít nhất 6 ký tự');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);

  if (!isDatabaseReady()) {
    return { message: 'Đặt lại mật khẩu thành công (demo)' };
  }

  const user = await User.findOne({
    email: normalizedEmail,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }, // Chưa hết hạn
  });

  if (!user) {
    const error = new Error('Mã xác nhận không hợp lệ hoặc đã hết hạn');
    error.statusCode = 400;
    throw error;
  }

  // Đặt mật khẩu mới
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return { message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.' };
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  demoUsers, // export to be used in database seeds or other services
};