const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

const users = [];

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const existingUser = users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email: String(email).toLowerCase(),
      password: hashedPassword,
      role: role || 'candidate',
    };

    users.push(newUser);

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

    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }

    const user = users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
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
