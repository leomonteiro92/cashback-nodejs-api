const bcrypt = require("bcrypt");
const chai = require("chai");
const faker = require("faker");
const UserService = require("./user.service");

chai.use(require("chai-as-promised"));
const { expect } = chai;

let conn;

before(() => {
  const { db } = require("../../database/index");
  conn = db;
});

after(() => {
  if (conn) {
    conn.close();
  }
});

beforeEach(async () => {
  if (conn) {
    await conn.collections.users.deleteMany();
  }
});

describe("Create a user", () => {
  it("should create a user with name, email, valid cpf and password", async () => {
    const inputUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: faker.internet.password()
    };

    const user = await UserService.create(inputUser);
    expect(user).to.haveOwnProperty("_id");
    expect(user._id).to.not.be.null;
    expect(user.cpf).to.be.eql(inputUser.cpf);
    expect(user).to.haveOwnProperty("password");
    expect(user).to.haveOwnProperty("createdAt");
    expect(user).to.haveOwnProperty("updatedAt");
    expect(user.email).to.be.eql(inputUser.email.toLowerCase());
    expect(user.name).to.be.eql(inputUser.name);
  });

  it("should throw error if the user' email already exists", async () => {
    const inputUser1 = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "86026447016",
      password: faker.internet.password()
    };
    const inputUser2 = {
      name: faker.name.findName(),
      email: inputUser1.email, //same email as inputUser1
      cpf: "18667376000",
      password: faker.internet.password()
    };

    await UserService.create(inputUser1);
    await expect(UserService.create(inputUser2)).to.be.rejectedWith(
      `E-mail: ${inputUser1.email} already exists`
    );
  });

  it("should throw error if the user' cpf is empty", async () => {
    const inputUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };
    await expect(UserService.create(inputUser)).to.be.rejectedWith(
      '"cpf" is required'
    );
  });
  it("should throw error if the user's email is empty", async () => {
    const inputUser = {
      name: faker.name.findName(),
      cpf: "70310966000",
      password: faker.internet.password()
    };
    await expect(UserService.create(inputUser)).to.be.rejectedWith(
      '"email" is required'
    );
  });
  it("should throw error if the user's password is empty", async () => {
    const inputUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000"
    };
    await expect(UserService.create(inputUser)).to.be.rejectedWith(
      '"password" is required'
    );
  });
  it("should throw error if the user's name is empty", async () => {
    const inputUser = {
      email: faker.internet.email(),
      cpf: "70310966000",
      password: faker.internet.password()
    };
    await expect(UserService.create(inputUser)).to.be.rejectedWith(
      '"name" is required'
    );
  });
  it("should throw error if the user's cpf is invalid", async () => {
    const inputUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "12312312345", //invalid cpf
      password: faker.internet.password()
    };
    await expect(UserService.create(inputUser)).to.be.rejectedWith(
      `CPF ${inputUser.cpf} is invalid`
    );
  });
});

describe("User Sign In", () => {
  it("should find an user by username, validate the password and return", async () => {
    const testUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: faker.internet.password()
    };
    const inputUser = {
      ...testUser,
      email: testUser.email.toLowerCase(),
      password: bcrypt.hashSync(testUser.password, bcrypt.genSaltSync(10))
    };
    // Populate user;
    await conn.collections.users.insertOne(inputUser);

    const user = await UserService.signIn(
      testUser.email.toLowerCase(),
      testUser.password
    );
    expect(user).to.not.be.null;
    expect(user.password).to.be.undefined;
  });

  it("should throw error if attempts to sign in with an e-mail that not exists", async () => {
    const testUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: faker.internet.password()
    };
    // The user was not persisted!

    await expect(
      UserService.signIn(testUser.email.toLowerCase(), testUser.password)
    ).to.be.rejectedWith(
      `user not found with e-mail ${testUser.email.toLowerCase()}`
    );
  });

  it("should throw error if the password is incorrect", async () => {
    const testUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: faker.internet.password()
    };
    const inputUser = {
      ...testUser,
      email: testUser.email.toLowerCase(),
      password: bcrypt.hashSync(testUser.password, bcrypt.genSaltSync(10))
    };
    // Populate user;
    await conn.collections.users.insertOne(inputUser);
    await expect(
      UserService.signIn(testUser.email.toLowerCase(), "incorrect_password")
    ).to.be.rejectedWith(`incorrect password, try again`);
  });
});
