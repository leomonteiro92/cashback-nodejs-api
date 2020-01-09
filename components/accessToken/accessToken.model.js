const mongoose = require("mongoose");

const mSchema = new mongoose.Schema({
  accessToken: {
    required: true,
    type: String
  },
  accessTokenExpiresAt: {
    required: true,
    type: Date
  },
  client: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "OAuth2Client"
  },
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const mModel = mongoose.model("OAuth2AccessToken", mSchema);

module.exports = mModel;
