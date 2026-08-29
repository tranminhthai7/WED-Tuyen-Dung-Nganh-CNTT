const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Other'],
      default: 'Other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
