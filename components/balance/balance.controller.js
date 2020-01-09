const BalanceService = require("./balance.service");

module.exports.get = async (req, res) => {
  try {
    const { cpf } = res.locals.oauth.token.user;
    const result = await BalanceService.get(cpf);
    res.status(200);
    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400);
    return res.json({ message: err.message });
  }
};
