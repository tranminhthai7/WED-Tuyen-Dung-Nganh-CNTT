const express = require('express');
const { getCompany, updateCompany, uploadCompanyLogo, adminListCompanies, adminVerifyCompany, adminListPendingJobs, adminModerateJob, listPublicCompanies, getPublicCompany } = require('../controllers/company.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { logoUpload } = require('../middlewares/upload.middleware');

const router = express.Router();

// NTD — đặt trước /:slug để không bị nuốt
router.get('/my', authenticate, requireRole('employer'), getCompany);
router.put('/my', authenticate, requireRole('employer'), updateCompany);
router.post('/my/logo', authenticate, requireRole('employer'), logoUpload.single('logo'), uploadCompanyLogo);

// Admin — cũng trước /:slug
router.get('/admin/list', authenticate, requireRole('admin'), adminListCompanies);
router.patch('/admin/:id/verify', authenticate, requireRole('admin'), adminVerifyCompany);
router.get('/admin/jobs/pending', authenticate, requireRole('admin'), adminListPendingJobs);
router.patch('/admin/jobs/:id/moderate', authenticate, requireRole('admin'), adminModerateJob);

// Public — / ở trước /:slug, /:slug luôn cuối cùng
router.get('/', listPublicCompanies);
router.get('/:slug', getPublicCompany);

module.exports = router;
