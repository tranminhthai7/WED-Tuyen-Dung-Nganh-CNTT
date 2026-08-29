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

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  demoUsers, // export to be used in database seeds or other services
};