const Client = require("./appClient.model");

module.exports.findOne = async (id, secret) => {
  const client = await Client.findOne({
    id,
    secret
  });
  if (!client) {
    throw new Error(`client ${id} não encontrado`);
  }
  return client;
};
