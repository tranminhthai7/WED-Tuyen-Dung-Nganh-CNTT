const express = require('express');
const { getStats } = require('../controllers/dashboard.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/stats', authenticate, requireRole(['employer', 'admin']), getStats);

module.exports = router;
