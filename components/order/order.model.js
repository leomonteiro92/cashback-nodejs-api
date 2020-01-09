const mongoose = require("mongoose");

const mSchema = new mongoose.Schema({
  code: {
    index: true,
    required: true,
    type: Number,
    unique: true
  },
  amount: {
    required: true,
    type: Number
  },
  cashbackPercentage: {
    required: true,
    type: Number
  },
  cashbackValue: {
    required: true,
    type: Number
  },
  orderDate: {
    required: true,
    type: Date
  },
  status: {
    enum: ["under_review", "rejected", "approved"],
    default: "under_review",
    type: String
  },
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

mSchema.pre("update", function() {
  this.updatedAt = new Date();
});

const mModel = mongoose.model("Order", mSchema);

module.exports = mModel;
