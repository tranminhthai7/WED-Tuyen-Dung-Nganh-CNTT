const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
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