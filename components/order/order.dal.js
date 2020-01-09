const Order = require("./order.model");

module.exports.create = async inputOrder => {
  let order = new Order(inputOrder);
  order = await order.save();
  return order.toObject();
};

module.exports.patch = async (id, inputOrder) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { $set: inputOrder },
    { new: true }
  );
  if (!order) {
    throw new Error(`order not found for id:${id}`);
  }
  return order.toObject();
};

module.exports.findById = async id => {
  const order = await Order.findById(id);
  return order;
};

module.exports.findOne = async filters => {
  const order = await Order.findOne(filters);
  return order;
};

module.exports.list = async ({
  offset = 0,
  limit = 25,
  filters = {},
  sort
}) => {
  const orders = await Order.find(filters)
    .limit(limit)
    .skip(offset)
    .sort(sort);
  return orders;
};

module.exports.count = async filters => {
  const count = await Order.countDocuments(filters);
  return count;
};

module.exports.remove = async id => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    throw new Error(`order not found for id:${id}`);
  }
  return order;
};
