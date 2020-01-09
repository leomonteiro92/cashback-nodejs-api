const bcrypt = require("bcrypt");
const { validateUserCPF } = require("./helpers");
const UserDAL = require("./user.dal");
const Joi = require("@hapi/joi");

module.exports.create = async inputUser => {
  const schema = Joi.object({
    cpf: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    name: Joi.string().required(),
    password: Joi.string().required()
  });
  const { error } = schema.validate(inputUser);
  if (error) throw new Error(error.message);
  const { cpf, email } = inputUser;
  const exists = await UserDAL.findOne({ email });
  if (exists) {
    throw new Error(`E-mail: ${email} already exists`);
  }
  if (!validateUserCPF(cpf)) {
    throw new Error(`CPF ${cpf} is invalid`);
  }
  const user = await UserDAL.create(inputUser);
  user.password = undefined;
  return user;
};

module.exports.findById = id => {
  return UserDAL.findById(id);
};

module.exports.signIn = async (email, password) => {
  const user = await UserDAL.findOne({ email });
  if (!user) {
    throw new Error(`user not found with e-mail ${email}`);
  }
  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error(`incorrect password, try again`);
  }
  user.password = undefined;
  return user;
};
