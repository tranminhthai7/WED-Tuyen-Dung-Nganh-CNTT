const { getMyCompany, updateMyCompany, uploadLogo, listCompanies, verifyCompany, listPendingJobs, listAdminJobs, getAdminJobById, moderateJob, listCompaniesPublic, getCompanyBySlug, upgradePackage: upgradePackageService, getMyTransactions: getMyTransactionsService, contactSales: contactSalesService, adminListContactRequests: adminListContactRequestsService, adminUpdateContactRequestStatus: adminUpdateContactRequestStatusService, adminUpdateCompanyPackage: adminUpdateCompanyPackageService } = require('../services/company.service');

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
  try { const list = await listCompaniesPublic(); return res.json({ companies: list }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
const getPublicCompany = async (req, res) => {
  try { const c = await getCompanyBySlug(req.params.slug); if (!c) return res.status(404).json({ message: 'Không tìm thấy công ty' }); return res.json({ company: c }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
const upgradePackage = async (req, res) => {
  try {
    const { packageType, paymentMethod, ...metadata } = req.body;
    const r = await upgradePackageService(req.user.id, packageType, paymentMethod, metadata);
    return res.json(r);
  } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};

const getMyTransactions = async (req, res) => {
  try {
    const transactions = await getMyTransactionsService(req.user.id);
    return res.json({ transactions });
  } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};

const { createVNPayUrl, verifyVNPayReturn } = require('../utils/vnpay');

const createPaymentUrl = async (req, res) => {
  try {
    const { packageType } = req.body;
    let amount = 0;
    if (packageType === 'Pro') amount = 1100000;
    else if (packageType === 'Enterprise') amount = 5000000;
    else return res.status(400).json({ message: 'Gói không hợp lệ' });

    const orderInfo = 'Thanh toan goi ' + packageType;
    const { url, orderId } = createVNPayUrl(req, amount, orderInfo);
    return res.json({ paymentUrl: url });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const isSuccess = verifyVNPayReturn(vnp_Params);
    
    if (isSuccess) {
      const orderInfo = vnp_Params['vnp_OrderInfo'];
      let packageType = 'Pro';
      if (orderInfo.includes('Enterprise')) packageType = 'Enterprise';
      
      const r = await upgradePackageService(req.user.id, packageType, 'vnpay', vnp_Params);
      return res.json({ success: true, message: r.message });
    } else {
      return res.status(400).json({ success: false, message: 'Thanh toán thất bại hoặc chữ ký không hợp lệ' });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const contactSales = async (req, res) => {
  try {
    const r = await contactSalesService(req.user.id, req.body);
    return res.json(r);
  } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};

const adminListContactRequests = async (req, res) => {
  try {
    const list = await adminListContactRequestsService();
    return res.json({ requests: list });
  } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};

const adminUpdateContactRequestStatus = async (req, res) => {
  try {
    const r = await adminUpdateContactRequestStatusService(req.params.id, req.body.status);
    return res.json(r);
  } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};

const adminUpdateCompanyPackage = async (req, res) => {
  try {
    const { packageType, amount, durationDays, maxJobPosts, contractNote } = req.body;
    const enterpriseDetails = { amount, durationDays, maxJobPosts, contractNote };
    const r = await adminUpdateCompanyPackageService(req.params.id, packageType, enterpriseDetails);
    return res.json(r);
  } catch (e) { return res.status(e.statusCode || 500).json({ message: e.message }); }
};

module.exports = { getCompany, updateCompany, uploadCompanyLogo, adminListCompanies, adminVerifyCompany, adminListPendingJobs, adminListJobs, adminGetJob, adminModerateJob, listPublicCompanies, getPublicCompany, upgradePackage, getMyTransactions, createPaymentUrl, vnpayReturn, contactSales, adminListContactRequests, adminUpdateContactRequestStatus, adminUpdateCompanyPackage };
