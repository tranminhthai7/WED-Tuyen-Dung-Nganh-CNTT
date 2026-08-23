const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

const demoUsers = [];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const normalizeEmail = (email) => String(email).toLowerCase().trim();

const normalizeUser = (user) => ({
  id: user._id ? user._id.toString() : user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const nextRole = role || 'candidate';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isDatabaseReady()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      const newUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: nextRole,
      });

      return res.status(201).json({
        message: 'Đăng ký thành công',
        user: normalizeUser(newUser),
        token: generateToken(newUser),
      });
    }

    const existingUser = demoUsers.find((user) => user.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: nextRole,
    };

    demoUsers.push(newUser);

    return res.status(201).json({
      message: 'Đăng ký thành công',
      user: normalizeUser(newUser),
      token: generateToken(newUser),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }

    if (isDatabaseReady()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(400).json({ message: 'Email không tồn tại' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu không đúng' });
      }

      return res.status(200).json({
        message: 'Đăng nhập thành công',
        user: normalizeUser(user),
        token: generateToken(user),
      });
    }

    const user = demoUsers.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      user: normalizeUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
