const express = require('express');
const { getJobDetail, listJobs } = require('../controllers/job.controller');

const router = express.Router();

router.get('/', listJobs);
router.get('/:slug', getJobDetail);

module.exports = router;