const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  packageType: {
    type: String,
    enum: ['Pro', 'Enterprise'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['vnpay', 'card', 'momo', 'manual'],
    default: 'vnpay'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  vnpayTxnRef: String,
  vnpayTransactionNo: String,
  vnpayResponseCode: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
