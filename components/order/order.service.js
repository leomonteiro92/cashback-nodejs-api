const OrderDAL = require("./order.dal");
const { UserService } = require("../user");
const Joi = require("@hapi/joi");

module.exports.create = async inputOrder => {
  const schema = Joi.object({
    code: Joi.number().required(),
    amount: Joi.number().required(),
    orderDate: Joi.any().required(),
    user: Joi.object({
      _id: Joi.any(),
      cpf: Joi.string()
    })
      .unknown(true)
      .required()
  });
  const { error } = schema.validate(inputOrder);
  if (error) throw new Error(error.message);
  inputOrder.status =
    inputOrder.user.cpf === "15350946056" ? "approved" : "under_review";
  const { cashbackPercentage, cashbackValue } = this.evaluateCashback(
    inputOrder.amount
  );
  const isValidUser = await UserService.findById(inputOrder.user._id);
  if (!isValidUser) {
    throw new Error('"user" is invalid');
  }
  inputOrder.cashbackPercentage = cashbackPercentage;
  inputOrder.cashbackValue = cashbackValue;
  inputOrder.user = inputOrder.user._id; // To prevent populating the user with the password field
  return OrderDAL.create(inputOrder);
};

module.exports.patch = async (id, inputOrder) => {
  const schema = Joi.object({
    code: Joi.number(),
    amount: Joi.number(),
    orderDate: Joi.any(),
    user: Joi.any().forbidden(),
    status: Joi.string().valid("under_review", "approved", "rejected")
  });
  const { error } = schema.validate(inputOrder);
  if (error) throw new Error(error.message);

  const order = await OrderDAL.findById(id);
  if (order.status !== "under_review") {
    throw new Error(`Order: ${id} is ${order.status} and cannot be updated`);
  }
  if (inputOrder.amount && inputOrder.amount !== order.amount) {
    const { cashbackPercentage, cashbackValue } = this.evaluateCashback(
      inputOrder.amount
    );
    inputOrder.cashbackPercentage = cashbackPercentage;
    inputOrder.cashbackValue = cashbackValue;
  }
  return OrderDAL.patch(id, inputOrder);
};

module.exports.findById = async id => {
  const order = await OrderDAL.findById(id);
  return order;
};

module.exports.list = async user => {
  const filters = { user };
  const [count, orders] = await Promise.all([
    OrderDAL.count(filters),
    OrderDAL.list(filters)
  ]);
  return { count, orders };
};

module.exports.remove = async id => {
  const order = await OrderDAL.findById(id);
  if (order.status !== "under_review") {
    throw new Error(`Order: ${id} is ${order.status} and cannot be deleted`);
  }
  return OrderDAL.remove(id);
};

module.exports.evaluateCashback = amount => {
  let cashbackPercentage;
  if (amount < 1000) {
    cashbackPercentage = 10;
  } else if (amount >= 1000 && amount <= 1500) {
    cashbackPercentage = 15;
  } else {
    cashbackPercentage = 20;
  }
  const cashbackValue = (cashbackPercentage * amount) / 100;
  return { cashbackPercentage, cashbackValue };
};
