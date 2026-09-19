const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String, default: '' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  note: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'contacted', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
