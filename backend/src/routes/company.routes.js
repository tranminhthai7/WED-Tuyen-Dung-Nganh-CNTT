const express = require('express');
const { getCompany, updateCompany, uploadCompanyLogo, adminListCompanies, adminVerifyCompany, adminListPendingJobs, adminListJobs, adminGetJob, adminModerateJob, listPublicCompanies, getPublicCompany, upgradePackage, getMyTransactions, createPaymentUrl, vnpayReturn, contactSales, adminListContactRequests, adminUpdateContactRequestStatus, adminUpdateCompanyPackage } = require('../controllers/company.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { logoUpload } = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/my', authenticate, requireRole('employer'), getCompany);
router.put('/my', authenticate, requireRole('employer'), updateCompany);
router.post('/my/logo', authenticate, requireRole('employer'), logoUpload.single('logo'), uploadCompanyLogo);
router.post('/my/upgrade', authenticate, requireRole('employer'), upgradePackage);
router.get('/my/transactions', authenticate, requireRole('employer'), getMyTransactions);
router.post('/contact-sales', authenticate, requireRole('employer'), contactSales);

// VNPay Routes
router.post('/my/create-payment-url', authenticate, requireRole('employer'), createPaymentUrl);
router.get('/my/vnpay-return', authenticate, requireRole('employer'), vnpayReturn);

router.get('/admin/list', authenticate, requireRole('admin'), adminListCompanies);
router.patch('/admin/:id/verify', authenticate, requireRole('admin'), adminVerifyCompany);
router.get('/admin/jobs/pending', authenticate, requireRole('admin'), adminListPendingJobs);
router.get('/admin/jobs', authenticate, requireRole('admin'), adminListJobs);
router.get('/admin/jobs/:id', authenticate, requireRole('admin'), adminGetJob);
router.patch('/admin/jobs/:id/moderate', authenticate, requireRole('admin'), adminModerateJob);
router.patch('/admin/companies/:id/package', authenticate, requireRole('admin'), adminUpdateCompanyPackage);

router.get('/admin/contact-requests', authenticate, requireRole('admin'), adminListContactRequests);
router.patch('/admin/contact-requests/:id/status', authenticate, requireRole('admin'), adminUpdateContactRequestStatus);

router.get('/', listPublicCompanies);
router.get('/:slug', getPublicCompany);

module.exports = router;
