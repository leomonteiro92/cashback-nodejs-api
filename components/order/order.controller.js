const OrderService = require("./order.service");

module.exports.create = async (req, res) => {
  try {
    const { user } = res.locals.oauth.token;
    const inputOrder = { ...req.body, user };
    const result = await OrderService.create(inputOrder);
    res.status(201);
    return res.json(result);
  } catch (err) {
    res.status(400);
    return res.json({ message: err.message });
  }
};

module.exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await OrderService.findById(id);
    if (!result) {
      res.status(404);
      return res.end();
    }
    res.status(200);
    return res.json(result);
  } catch (err) {
    res.status(400);
    return res.json({ message: err.message });
  }
};

module.exports.list = async (req, res) => {
  try {
    const { user } = res.locals.oauth.token;
    const result = await OrderService.list(user._id);
    res.status(200);
    return res.json(result);
  } catch (err) {
    res.status(400);
    return res.json({ message: err.message });
  }
};

module.exports.patch = async (req, res) => {
  try {
    const { id } = req.params;
    const inputOrder = req.body;
    const result = await OrderService.patch(id, inputOrder);
    res.status(200);
    return res.json(result);
  } catch (err) {
    res.status(400);
    return res.json({ message: err.message });
  }
};

module.exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await OrderService.remove(id);
    res.status(204);
    return res.end();
  } catch (err) {
    res.status(400);
    return res.json({ message: err.message });
  }
};
