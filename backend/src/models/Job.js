const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Users with role 'employer'
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    tone: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    requirements: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'Full-time',
    },
    level: {
      type: String,
      default: 'Junior',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'closed', 'rejected'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    experience: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    posted: {
      type: String,
      default: '',
    },
    applicants: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);