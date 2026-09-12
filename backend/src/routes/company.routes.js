const express = require('express');
const { getCompany, updateCompany, uploadCompanyLogo, adminListCompanies, adminVerifyCompany, adminListPendingJobs, adminModerateJob, listPublicCompanies, getPublicCompany } = require('../controllers/company.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { logoUpload } = require('../middlewares/upload.middleware');

const router = express.Router();

// NTD â€” Ä‘áº·t trÆ°á»›c /:slug Ä‘á»ƒ khĂ´ng bá»‹ nuá»‘t
router.get('/my', authenticate, requireRole('employer'), getCompany);
router.put('/my', authenticate, requireRole('employer'), updateCompany);
router.post('/my/logo', authenticate, requireRole('employer'), logoUpload.single('logo'), uploadCompanyLogo);

// Admin â€” cÅ©ng trÆ°á»›c /:slug
router.get('/admin/list', authenticate, requireRole('admin'), adminListCompanies);
router.patch('/admin/:id/verify', authenticate, requireRole('admin'), adminVerifyCompany);
router.get('/admin/jobs/pending', authenticate, requireRole('admin'), adminListPendingJobs);
router.patch('/admin/jobs/:id/moderate', authenticate, requireRole('admin'), adminModerateJob);

// Public â€” / á»Ÿ trÆ°á»›c /:slug, /:slug luĂ´n cuá»‘i cĂ¹ng
router.get('/', listPublicCompanies);
router.get('/:slug', getPublicCompany);

module.exports = router;
