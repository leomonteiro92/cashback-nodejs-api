const mongoose = require("mongoose");

const mSchema = new mongoose.Schema({
  id: {
    required: true,
    type: String
  },
  secret: {
    required: true,
    type: String
  },
  grants: {
    required: true,
    type: [String]
  }
});

const mModel = mongoose.model("OAuth2Client", mSchema);

module.exports = mModel;
