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

module.exports = {
  registerUser,
  loginUser,
};