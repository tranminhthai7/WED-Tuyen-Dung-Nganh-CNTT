const express = require('express');
const { getCompany, updateCompany, uploadCompanyLogo, adminListCompanies, adminVerifyCompany, adminListPendingJobs, adminModerateJob } = require('../controllers/company.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { logoUpload } = require('../middlewares/upload.middleware');

const router = express.Router();

// NTD
router.get('/my', authenticate, requireRole('employer'), getCompany);
router.put('/my', authenticate, requireRole('employer'), updateCompany);
router.post('/my/logo', authenticate, requireRole('employer'), logoUpload.single('logo'), uploadCompanyLogo);

// Admin
router.get('/admin/list', authenticate, requireRole('admin'), adminListCompanies);
router.patch('/admin/:id/verify', authenticate, requireRole('admin'), adminVerifyCompany);
router.get('/admin/jobs/pending', authenticate, requireRole('admin'), adminListPendingJobs);
router.patch('/admin/jobs/:id/moderate', authenticate, requireRole('admin'), adminModerateJob);

module.exports = router;
