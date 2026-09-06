const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Users with role 'employer' or Company ID
      required: true,
    },
    cvUrl: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'viewed', 'interview', 'accepted', 'rejected'],
      default: 'pending',
    },
    companyNote: {
      type: String,
      default: '',
    },
    interview: {
      date: { type: String, default: '' },          // YYYY-MM-DD
      time: { type: String, default: '' },          // HH:mm
      location: { type: String, default: '' },      // phòng / địa chỉ / Meet
      interviewer: { type: String, default: '' },
      meetLink: { type: String, default: '' },
      note: { type: String, default: '' },
    },
    history: {
      type: [
        {
          from: String,
          to: String,
          companyNote: String,
          interview: Object,
          by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          at: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
