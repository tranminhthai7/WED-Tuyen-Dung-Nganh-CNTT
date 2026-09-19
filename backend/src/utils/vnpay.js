const crypto = require('crypto');

const VNP_TMNCODE = process.env.VNP_TMNCODE || 'VNPAY_DEMO'; // Placeholder
const VNP_HASHSECRET = process.env.VNP_HASHSECRET || 'SECRET_KEY_FOR_TESTING_ONLY_123';
const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNP_RETURN_URL = process.env.VNP_RETURN_URL || 'http://localhost:5173/employer/payment-result';

const sortObject = (obj) => {
  const sorted = {};
  const str = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};

const createVNPayUrl = (req, amount, orderInfo, returnUrl = VNP_RETURN_URL) => {
  const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
  const tmnCode = VNP_TMNCODE;
  const secretKey = VNP_HASHSECRET;
  let vnpUrl = VNP_URL;

  const date = new Date();
  const createDate = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0');

  const orderId = date.getTime().toString(); // unique ref

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100, // VNPay requires * 100
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  vnp_Params = sortObject(vnp_Params);

  // Use Object.entries and join to avoid double encoding by URLSearchParams
  const signData = Object.entries(vnp_Params).map(([key, val]) => `${key}=${val}`).join('&');

  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  vnpUrl += '?' + Object.entries(vnp_Params).map(([key, val]) => `${key}=${val}`).join('&');

  return { url: vnpUrl, orderId };
};

const verifyVNPayReturn = (vnp_Params) => {
  let secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  const signData = Object.entries(vnp_Params).map(([key, val]) => `${key}=${val}`).join('&');

  const hmac = crypto.createHmac('sha512', VNP_HASHSECRET);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    return vnp_Params['vnp_ResponseCode'] === '00';
  } else {
    return false;
  }
};

module.exports = { createVNPayUrl, verifyVNPayReturn };
