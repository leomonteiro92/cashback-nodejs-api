const AccessToken = require("./accessToken.model");

module.exports.findOne = async token => {
  const accessToken = await AccessToken.findOne({
    accessToken: token
  })
    .populate("client")
    .populate("user")
    .exec();
  if (!accessToken) {
    throw new Error(`token ${token} não encontrado`);
  }
  return accessToken;
};

module.exports.create = async (token, client, user) => {
  let accessToken = new AccessToken({
    ...token,
    client,
    user
  });
  accessToken = await accessToken.save();
  return accessToken;
};
