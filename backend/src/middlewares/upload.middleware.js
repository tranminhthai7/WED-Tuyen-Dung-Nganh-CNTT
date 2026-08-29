const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, hasKeys } = require('../config/cloudinary');

function createUploader(folder, allowedFormats, maxBytes) {
  if (hasKeys) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: { folder: `itmatch/${folder}`, allowed_formats: allowedFormats, resource_type: 'auto' },
    });
    return multer({ storage, limits: { fileSize: maxBytes } });
  }
  // fallback: memory storage (no cloud) — controller will handle gracefully and not crash
  return multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes } });
}

const avatarUpload = createUploader('avatars', ['jpg', 'jpeg', 'png', 'webp'], 2 * 1024 * 1024);
const cvUpload = createUploader('cvs', ['pdf'], 5 * 1024 * 1024);
const logoUpload = createUploader('logos', ['jpg', 'jpeg', 'png', 'webp', 'svg'], 2 * 1024 * 1024);

module.exports = { avatarUpload, cvUpload, logoUpload };
