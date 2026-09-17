const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');
const { hasKeys } = require('../config/cloudinary');

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const slugify = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const createCompany = async (data, ownerId) => {
  if (!data.name) { const e = new Error('Thiếu tên công ty'); e.statusCode = 400; throw e; }
  if (!isDatabaseReady()) return { company: { id: Date.now().toString(), ...data, ownerId, logo: data.logo || '', isVerified: false, isActive: true } };
  const slug = slugify(data.name);
  const c = await Company.create({ ...data, ownerId, slug, isVerified: false });
  return { message: 'Tạo hồ sơ công ty, chờ Admin duyệt', company: c };
};

const getMyCompany = async (ownerId) => {
  if (!isDatabaseReady()) return null;
  return Company.findOne({ ownerId });
};

const updateMyCompany = async (ownerId, data) => {
  const allowed = ['name','website','industry','size','address','description','techStack','logo'];
  const upd = {}; allowed.forEach(k => { if (data[k] !== undefined) upd[k] = data[k]; });
  if (data.name) upd.slug = slugify(data.name);
  if (!isDatabaseReady()) return { company: { ownerId, ...upd, isVerified: false }, message: 'Cập nhật — cần Admin duyệt lại (demo)' };
  // Chuẩn: không cho 2 owner sở hữu cùng tên công ty — báo lỗi rõ ràng thay vì âm thầm tạo duplicate
  if (data.name) {
    const dup = await Company.findOne({ name: data.name, ownerId: { $ne: ownerId } });
    if (dup) { const e = new Error(`Tên công ty "${data.name}" đã tồn tại (sở hữu bởi ${dup.ownerId}). Vui lòng dùng tài khoản cũ hoặc đổi tên.`); e.statusCode = 409; throw e; }
    const slugDup = await Company.findOne({ slug: slugify(data.name), ownerId: { $ne: ownerId } });
    if (slugDup) { const e = new Error(`Slug "${slugify(data.name)}" đã có người dùng.`); e.statusCode = 409; throw e; }
  }
  const existing = await Company.findOne({ ownerId });
  const wasVerified = existing?.isVerified === true;
  const importantChanged = wasVerified && allowed.some(k => data[k] !== undefined && String(data[k] ?? '') !== String(existing[k] ?? ''));
  if (importantChanged) upd.isVerified = false;
  try {
    const c = await Company.findOneAndUpdate({ ownerId }, upd, { new: true, upsert: true });
    const msg = importantChanged ? 'Đã lưu — hồ sơ thay đổi nên cần Admin duyệt lại' : 'Cập nhật công ty thành công';
    return { message: msg, company: c, needsReverify: importantChanged };
  } catch (e) {
    if (e.code === 11000) {
      if (String(e.message).includes('email')) {
        try { await Company.collection.updateMany({ email: null }, [{ $set: { email: { $concat: ['fix-', { $toString: '$_id' }, '@local'] } } }]); } catch {}
        try { await Company.collection.dropIndex('email_1'); } catch {}
        try { await Company.collection.createIndex({ email: 1 }, { unique: true, sparse: true }); } catch {}
        const c = await Company.findOneAndUpdate({ ownerId }, upd, { new: true, upsert: true });
        return { message: 'Cập nhật công ty thành công', company: c };
      }
      if (String(e.message).includes('name') || String(e.message).includes('slug')) {
        const dupE = new Error('Tên công ty / slug đã tồn tại — không thể tạo trùng. Hãy đăng nhập bằng tài khoản cũ.'); dupE.statusCode = 409; throw dupE;
      }
    }
    throw e;
  }
};

const uploadLogo = async (file, ownerId) => {
  const url = file.path || file.secure_url || file.location || `memory://${file.originalname}`;
  if (!hasKeys && !file.path) console.warn('[upload] logo fallback memory URL');
  if (!isDatabaseReady()) return { url, message: 'Upload logo (demo)' };
  try {
    const c = await Company.findOneAndUpdate({ ownerId }, { logo: url }, { new: true, upsert: true });
    // Đồng bộ logo thật sang mọi tin của công ty — để JobCard không còn hiện chữ cái
    try { if (c?.name) await Job.updateMany({ company: c.name }, { $set: { logo: url } }); } catch {}
    return { url, company: c };
  } catch (e) {
    if (e.code === 11000 && String(e.message).includes('email')) {
      try { await Company.collection.updateMany({ email: null }, [{ $set: { email: { $concat: ['fix-', { $toString: '$_id' }, '@local'] } } }]); } catch {}
      try { await Company.collection.dropIndex('email_1'); } catch {}
      try { await Company.collection.createIndex({ email: 1 }, { unique: true, sparse: true }); } catch {}
      const c = await Company.findOneAndUpdate({ ownerId }, { logo: url }, { new: true, upsert: true });
      try { if (c?.name) await Job.updateMany({ company: c.name }, { $set: { logo: url } }); } catch {}
      return { url, company: c };
    }
    throw e;
  }
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
const listAdminJobs = async (status) => {
  if (!isDatabaseReady()) return [];
  const q = {};
  if (status && ['pending','active','rejected','closed'].includes(status)) q.status = status;
  return Job.find(q).sort({ createdAt: -1 }).lean();
};
const getAdminJobById = async (jobId) => {
  if (!isDatabaseReady()) return null;
  return Job.findById(jobId).lean();
};
const moderateJob = async (jobId, status) => {
  if (!['active','rejected','closed'].includes(status)) { const e = new Error('Trạng thái không hợp lệ'); e.statusCode = 400; throw e; }
  if (!isDatabaseReady()) return { message: `Demo: job ${status}` };
  const j = await Job.findByIdAndUpdate(jobId, { status }, { new: true });
  if (!j) { const e = new Error('Không tìm thấy tin'); e.statusCode = 404; throw e; }
  return { message: `Đã ${status} tin`, job: j };
};

// Public — real DB
const listCompaniesPublic = async () => {
  if (!isDatabaseReady()) return [];
  const companies = await Company.find({ isVerified: true, isActive: true }).sort({ createdAt: -1 }).lean();
  for (const c of companies) {
    if (!c.slug && c.name) {
      const s = slugify(c.name);
      try { await Company.updateOne({ _id: c._id }, { slug: s }); c.slug = s; } catch {}
    }
    if (!c.slug) c.slug = String(c._id);
  }
  // dedupe by normalized name — heal legacy double CMC / Viettel inserts
  const seen = new Set();
  const deduped = [];
  for (const c of companies) {
    const key = String(c.name || '').toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(c);
  }
  const names = deduped.map(c => c.name);
  const counts = await Job.aggregate([{ $match: { company: { $in: names }, status: 'active' } }, { $group: { _id: '$company', count: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map(x => [x._id, x.count]));
  return deduped.map(c => ({ ...c, jobCount: map[c.name] || 0, slug: c.slug || slugify(c.name) || String(c._id) }));
};

const getCompanyBySlug = async (slug) => {
  if (!isDatabaseReady()) return null;
  let c = await Company.findOne({ slug, isVerified: true }).lean();
  if (!c) c = await Company.findOne({ slug: slugify(slug), isVerified: true }).lean();
  if (!c) {
    const all = await Company.find({ isVerified: true }).lean();
    c = all.find(x => slugify(x.name) === slugify(slug) || String(x._id) === slug) || null;
  }
  if (!c) return null;
  if (!c.slug) c.slug = slugify(c.name) || String(c._id);
  const jobs = await Job.find({ company: c.name, status: 'active' }).sort({ createdAt: -1 }).lean();
  return { ...c, jobs, jobCount: jobs.length };
};

const Transaction = require('../models/Transaction');

const upgradePackage = async (ownerId, packageType, paymentMethod = 'manual', metadata = {}) => {
  if (!isDatabaseReady()) return { message: 'Đã nâng cấp gói thành công (demo)' };
  const valid = ['Free', 'Pro', 'Enterprise'];
  if (!valid.includes(packageType)) { const e = new Error('Gói không hợp lệ'); e.statusCode = 400; throw e; }

  const c = await Company.findOne({ ownerId });
  if (!c) { const e = new Error('Không tìm thấy công ty'); e.statusCode = 404; throw e; }

  let packageExpiresAt = null;
  let amount = 0;

  if (packageType === 'Pro') {
    amount = 1100000;
    packageExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  } else if (packageType === 'Enterprise') {
    amount = 0;
    packageExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  }

  c.packageType = packageType;
  c.packageExpiresAt = packageExpiresAt;
  await c.save();

  if (packageType === 'Pro' || packageType === 'Enterprise') {
    await Job.updateMany({ companyId: ownerId }, { isHot: true });
  } else {
    await Job.updateMany({ companyId: ownerId }, { isHot: false });
  }

  // Create transaction record
  const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  await Transaction.create({
    companyId: c._id,
    txnId,
    amount,
    packageType,
    paymentMethod,
    status: 'success',
    paidAt: new Date(),
    metadata,
  });

  return { message: `Đã nâng cấp lên gói ${packageType}`, company: c, transaction: { txnId, amount, packageType, paymentMethod, paidAt: new Date() } };
};

const getMyTransactions = async (ownerId) => {
  if (!isDatabaseReady()) return [];
  const company = await Company.findOne({ ownerId });
  if (!company) return [];
  const Transaction = require('../models/Transaction');
  return Transaction.find({ companyId: company._id }).sort({ createdAt: -1 }).lean();
};

module.exports = { createCompany, getMyCompany, updateMyCompany, uploadLogo, listCompanies, verifyCompany, listPendingJobs, listAdminJobs, getAdminJobById, moderateJob, listCompaniesPublic, getCompanyBySlug, upgradePackage, getMyTransactions };
