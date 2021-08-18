const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    required: true,
  },
  riskTolerance: {
    type: Number,
    required: true,
  },
  isReached: {
    type: Boolean,
    default: false,
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
    required: true,
  },

}, {
  toJSON: {
    transform: function (_doc, ret) {
      delete ret.user;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model("Goal", GoalSchema);
