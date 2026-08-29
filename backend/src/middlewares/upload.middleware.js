const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, hasKeys } = require('../config/cloudinary');

function createUploader(folder, allowedFormats, maxBytes, transformation) {
  if (hasKeys) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: { folder: `itmatch/${folder}`, allowed_formats: allowedFormats, resource_type: 'auto', transformation: transformation || undefined },
    });
    return multer({ storage, limits: { fileSize: maxBytes } });
  }
  // fallback: memory storage (no cloud) — controller will handle gracefully and not crash
  return multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes } });
}

const avatarUpload = createUploader('avatars', ['jpg', 'jpeg', 'png', 'webp'], 2 * 1024 * 1024, [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]);
const cvUpload = createUploader('cvs', ['pdf'], 5 * 1024 * 1024);
const logoUpload = createUploader('logos', ['jpg', 'jpeg', 'png', 'webp', 'svg'], 2 * 1024 * 1024, [{ width: 600, height: 600, crop: 'limit' }]);

module.exports = { avatarUpload, cvUpload, logoUpload };
