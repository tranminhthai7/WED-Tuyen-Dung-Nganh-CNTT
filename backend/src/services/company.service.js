const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');
const { hasKeys } = require('../config/cloudinary');

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const createCompany = async (data, ownerId) => {
  if (!data.name) { const e = new Error('Thiếu tên công ty'); e.statusCode = 400; throw e; }
  if (!isDatabaseReady()) return { company: { id: Date.now().toString(), ...data, ownerId, logo: data.logo || '', isVerified: false, isActive: true } };
  const c = await Company.create({ ...data, ownerId, isVerified: false });
  return { message: 'Tạo hồ sơ công ty, chờ Admin duyệt', company: c };
};

const getMyCompany = async (ownerId) => {
  if (!isDatabaseReady()) return null;
  return Company.findOne({ ownerId });
};

const updateMyCompany = async (ownerId, data) => {
  const allowed = ['name','website','industry','size','address','description','techStack','logo'];
  const upd = {}; allowed.forEach(k => { if (data[k] !== undefined) upd[k] = data[k]; });
  if (!isDatabaseReady()) return { company: { ownerId, ...upd } };
  const c = await Company.findOneAndUpdate({ ownerId }, upd, { new: true, upsert: true });
  return { message: 'Cập nhật công ty thành công', company: c };
};

const uploadLogo = async (file, ownerId) => {
  const url = file.path || file.secure_url || file.location || `memory://${file.originalname}`;
  if (!hasKeys && !file.path) console.warn('[upload] logo fallback memory URL');
  if (!isDatabaseReady()) return { url, message: 'Upload logo (demo)' };
  const c = await Company.findOneAndUpdate({ ownerId }, { logo: url }, { new: true, upsert: true });
  return { url, company: c };
};

// Admin
const listCompanies = async () => {
  if (!isDatabaseReady()) return [];
  return Company.find().sort({ createdAt: -1 }).populate('ownerId', 'name email');
};
const verifyCompany = async (companyId, isVerified) => {
  if (!isDatabaseReady()) return { message: 'Demo: đã duyệt (giả lập)' };
  const c = await Company.findByIdAndUpdate(companyId, { isVerified }, { new: true });
  if (!c) { const e = new Error('Không tìm thấy công ty'); e.statusCode = 404; throw e; }
  return { message: isVerified ? 'Đã duyệt công ty' : 'Đã từ chối công ty', company: c };
};

const listPendingJobs = async () => {
  if (!isDatabaseReady()) return [];
  return Job.find({ status: 'pending' }).sort({ createdAt: -1 });
};
const moderateJob = async (jobId, status) => {
  if (!['active','rejected','closed'].includes(status)) { const e = new Error('Trạng thái không hợp lệ'); e.statusCode = 400; throw e; }
  if (!isDatabaseReady()) return { message: `Demo: job ${status}` };
  const j = await Job.findByIdAndUpdate(jobId, { status }, { new: true });
  if (!j) { const e = new Error('Không tìm thấy tin'); e.statusCode = 404; throw e; }
  return { message: `Đã ${status} tin`, job: j };
};

module.exports = { createCompany, getMyCompany, updateMyCompany, uploadLogo, listCompanies, verifyCompany, listPendingJobs, moderateJob };
