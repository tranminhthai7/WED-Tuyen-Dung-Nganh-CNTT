const { getMyCompany, updateMyCompany, uploadLogo, listCompanies, verifyCompany, listPendingJobs, listAdminJobs, getAdminJobById, moderateJob, listCompaniesPublic, getCompanyBySlug, upgradePackage: upgradePackageService } = require('../services/company.service');

const getCompany = async (req, res) => {
  try { const c = await getMyCompany(req.user.id); return res.json({ company: c }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
const updateCompany = async (req, res) => {
  try { const r = await updateMyCompany(req.user.id, req.body); return res.json(r); } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};
const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Thiếu file logo' });
    const r = await uploadLogo(req.file, req.user.id);
    return res.json({ message: 'Upload logo thành công', ...r });
  } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};
const adminListCompanies = async (req, res) => {
  try { const list = await listCompanies(); return res.json({ companies: list }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
const adminVerifyCompany = async (req, res) => {
  try { const r = await verifyCompany(req.params.id, req.body.isVerified); return res.json(r); } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};
const adminListPendingJobs = async (req, res) => {
  try { const list = await listPendingJobs(); return res.json({ jobs: list }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
const adminListJobs = async (req, res) => {
  try { const list = await listAdminJobs(req.query.status); return res.json({ jobs: list }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
const adminGetJob = async (req, res) => {
  try { const job = await getAdminJobById(req.params.id); if(!job) return res.status(404).json({message:'Không tìm thấy tin'}); return res.json({job}); } catch(e){ return res.status(500).json({message:e.message}); }
};
const adminModerateJob = async (req, res) => {
  try { const r = await moderateJob(req.params.id, req.body.status); return res.json(r); } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};
const listPublicCompanies = async (req, res) => {
  try { const { listCompaniesPublic } = require('../services/company.service'); const list = await listCompaniesPublic(); return res.json({ companies: list }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
const getPublicCompany = async (req, res) => {
  try { const { getCompanyBySlug } = require('../services/company.service'); const c = await getCompanyBySlug(req.params.slug); if (!c) return res.status(404).json({ message: 'Không tìm thấy công ty' }); return res.json({ company: c }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
const upgradePackage = async (req, res) => {
  try {
    const r = await upgradePackageService(req.user.id, req.body.packageType);
    return res.json(r);
  } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};

module.exports = { getCompany, updateCompany, uploadCompanyLogo, adminListCompanies, adminVerifyCompany, adminListPendingJobs, adminListJobs, adminGetJob, adminModerateJob, listPublicCompanies, getPublicCompany, upgradePackage };
