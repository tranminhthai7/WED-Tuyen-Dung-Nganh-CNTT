const express = require('express');
const { getCompany, updateCompany, uploadCompanyLogo, adminListCompanies, adminVerifyCompany, adminListPendingJobs, adminListJobs, adminGetJob, adminModerateJob, listPublicCompanies, getPublicCompany } = require('../controllers/company.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { logoUpload } = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/my', authenticate, requireRole('employer'), getCompany);
router.put('/my', authenticate, requireRole('employer'), updateCompany);
router.post('/my/logo', authenticate, requireRole('employer'), logoUpload.single('logo'), uploadCompanyLogo);

router.get('/admin/list', authenticate, requireRole('admin'), adminListCompanies);
router.patch('/admin/:id/verify', authenticate, requireRole('admin'), adminVerifyCompany);
router.get('/admin/jobs/pending', authenticate, requireRole('admin'), adminListPendingJobs);
router.get('/admin/jobs', authenticate, requireRole('admin'), adminListJobs);
router.get('/admin/jobs/:id', authenticate, requireRole('admin'), adminGetJob);
router.patch('/admin/jobs/:id/moderate', authenticate, requireRole('admin'), adminModerateJob);

router.get('/', listPublicCompanies);
router.get('/:slug', getPublicCompany);

module.exports = router;
