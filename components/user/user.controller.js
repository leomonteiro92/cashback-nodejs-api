const UserService = require("./user.service");

module.exports.signUp = async (req, res) => {
  try {
    const result = await UserService.create(req.body);
    res.status(201);
    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400);
    return res.json({ message: err.message });
  }
};
