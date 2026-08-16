const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ITMatch backend đang hoạt động',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
