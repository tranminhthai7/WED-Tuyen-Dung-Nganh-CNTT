const express = require('express');
const {
  submitApplication,
  listMyApplications,
  listEmployerApplications,
  updateStatus,
} = require('../controllers/application.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticate, requireRole('candidate'), submitApplication);
router.get('/my', authenticate, requireRole('candidate'), listMyApplications);
router.get('/employer', authenticate, requireRole('employer'), listEmployerApplications);
router.put('/:id/status', authenticate, requireRole('employer'), updateStatus);

module.exports = router;
