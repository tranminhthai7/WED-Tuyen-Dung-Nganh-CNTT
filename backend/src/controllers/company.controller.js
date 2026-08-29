const { getMyCompany, updateMyCompany, uploadLogo, listCompanies, verifyCompany, listPendingJobs, moderateJob } = require('../services/company.service');

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
const adminModerateJob = async (req, res) => {
  try { const r = await moderateJob(req.params.id, req.body.status); return res.json(r); } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};

module.exports = { getCompany, updateCompany, uploadCompanyLogo, adminListCompanies, adminVerifyCompany, adminListPendingJobs, adminModerateJob };
