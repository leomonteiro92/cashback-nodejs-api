const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const mSchema = new mongoose.Schema({
  cpf: {
    required: true,
    type: String
  },
  email: {
    index: true,
    lowercase: true,
    required: true,
    trim: true,
    type: String,
    unique: true
  },
  name: {
    required: true,
    type: String
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

mSchema.pre("save", function() {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

mSchema.pre("update", function() {
  this.updatedAt = new Date();
});

const mModel = mongoose.model("User", mSchema);

module.exports = mModel;
