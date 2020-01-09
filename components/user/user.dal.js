const User = require("./user.model");

module.exports.create = async inputUser => {
  let user = new User(inputUser);
  user = await user.save();
  return user.toObject();
};

module.exports.patch = async (id, inputUser) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: inputUser },
    { new: true }
  );
  if (!user) {
    throw new Error(`usuário não encontrado com id ${id}`);
  }
  return user;
};

module.exports.findById = async id => {
  const user = await User.findById(id);
  return user;
};

module.exports.findOne = filters => {
  return User.findOne(filters);
};
