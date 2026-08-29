const express = require('express');
const { login, register, getProfile, updateProfile, uploadAvatar, uploadCv } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { avatarUpload, cvUpload } = require('../middlewares/upload.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/upload/avatar', authenticate, avatarUpload.single('avatar'), uploadAvatar);
router.post('/upload/cv', authenticate, cvUpload.single('cv'), uploadCv);

module.exports = router;
