const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const skillRoutes = require('./routes/skill.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const companyRoutes = require('./routes/company.routes');

const app = express();

app.use(helmet());
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL].filter(Boolean);
app.use(cors({ origin: (origin, cb) => { if (!origin || allowedOrigins.includes(origin)) return cb(null, true); return cb(null, true); }, credentials: true }));
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/companies', companyRoutes);

// Friendly upload errors (multer)
app.use((err, _req, res, _next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File quá lớn (tối đa 10MB cho PDF, 2MB cho ảnh)' });
  if (err) return res.status(400).json({ message: err.message || 'Upload lỗi' });
  return res.status(500).json({ message: 'Lỗi server' });
});

module.exports = app;