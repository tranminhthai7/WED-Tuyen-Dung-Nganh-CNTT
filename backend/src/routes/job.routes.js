const express = require('express');
const { getJobDetail, listJobs, listEmployerJobs, createJobController, updateJobController, deleteJobController } = require('../controllers/job.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', listJobs);
router.get('/my/postings', authenticate, requireRole('employer'), listEmployerJobs);
router.post('/', authenticate, requireRole('employer'), createJobController);
router.put('/:id', authenticate, requireRole(['employer', 'admin']), updateJobController);
router.delete('/:id', authenticate, requireRole(['employer', 'admin']), deleteJobController);
router.get('/:slug', getJobDetail);

module.exports = router;