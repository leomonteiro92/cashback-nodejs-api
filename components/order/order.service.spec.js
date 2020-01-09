const chai = require("chai");
const faker = require("faker");
const Types = require("mongoose").Types;
const OrderService = require("./order.service");

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
    await Promise.all([
      conn.collections.users.deleteMany(),
      conn.collections.orders.deleteMany()
    ]);
  }
});

describe("Create an order", () => {
  it("should create an order with status under_review if cpf != 153.509.460-56", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: 999.0,
      code: faker.finance.amount(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };

    const order = await OrderService.create(inputOrder);
    expect(order).to.not.be.null;
    expect(order.status).to.be.eql("under_review");
    expect(order).to.haveOwnProperty("_id");
    expect(order).to.haveOwnProperty("createdAt");
    expect(order).to.haveOwnProperty("updatedAt");
  });
  it("should create an order with status approved if cpf = 153.509.460-56", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "15350946056",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: 999.0,
      code: faker.finance.amount(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };

    const order = await OrderService.create(inputOrder);
    expect(order).to.not.be.null;
    expect(order.status).to.be.eql("approved");
    expect(order).to.haveOwnProperty("_id");
    expect(order).to.haveOwnProperty("createdAt");
    expect(order).to.haveOwnProperty("updatedAt");
  });

  it("should create an order with amount lesser than $1000, orderDate, code and user \
        and return with cashbackValue and cashbackPercentage = 10%", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    const order = await OrderService.create(inputOrder);
    expect(order).to.not.be.null;
    expect(order.cashbackPercentage).to.be.eql(10);
    expect(order.cashbackValue).to.be.eql(99.9);
  });

  it("should create an order with amount = $1000, orderDate, code and user \
        and return with cashbackValue and cashbackPercentage = 15%", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: 1000.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    const order = await OrderService.create(inputOrder);
    expect(order).to.not.be.null;
    expect(order.cashbackPercentage).to.be.eql(15);
    expect(order.cashbackValue).to.be.eql(150);
  });

  it("should create an order with amount = $15000, orderDate, code and user \
        and return with cashbackValue and cashbackPercentage = 15%", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: 1500.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    const order = await OrderService.create(inputOrder);
    expect(order).to.not.be.null;
    expect(order.cashbackPercentage).to.be.eql(15);
    expect(order.cashbackValue).to.be.eql(225.0);
  });

  it("should create an order with amount between $1000 and $15000, orderDate, code and user \
        and return with cashbackValue and cashbackPercentage = 15%", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: 1350.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    const order = await OrderService.create(inputOrder);
    expect(order).to.not.be.null;
    expect(order.cashbackPercentage).to.be.eql(15);
    expect(order.cashbackValue).to.be.eql(202.5);
  });

  it("should create an order with amount greater than $1500, orderDate, code and user \
        and return with cashbackValue and cashbackPercentage > 20%", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: 1501.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    const order = await OrderService.create(inputOrder);
    expect(order).to.not.be.null;
    expect(order.cashbackPercentage).to.be.eql(20);
    expect(order.cashbackValue).to.be.eql(300.2);
  });

  it("should throw error if amount is null", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      code: faker.random.number(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    await expect(OrderService.create(inputOrder)).to.be.rejectedWith(
      '"amount" is required'
    );
  });

  it("should throw error if amount is not a number", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: "$1000.00",
      code: faker.random.number(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    await expect(OrderService.create(inputOrder)).to.be.rejectedWith(
      '"amount" must be a number'
    );
  });

  it("should throw error if orderDate is null", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: faker.finance.amount(),
      code: faker.random.number(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    await expect(OrderService.create(inputOrder)).to.be.rejectedWith(
      '"orderDate" is required'
    );
  });

  it("should throw error if orderDate is not a valid date", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: faker.finance.amount(),
      code: faker.random.number(),
      orderDate: "lorem ipsum",
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    await expect(OrderService.create(inputOrder)).to.be.rejected;
  });

  it("should throw error if user is null", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: faker.finance.amount(),
      code: faker.random.number(),
      orderDate: faker.date.past()
    };
    await expect(OrderService.create(inputOrder)).to.be.rejectedWith(
      '"user" is required'
    );
  });

  it("should throw error if user not exists", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    // The fake user was not persisted !

    const inputOrder = {
      amount: faker.finance.amount(),
      orderDate: faker.date.past(),
      code: faker.random.number(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    await expect(OrderService.create(inputOrder)).to.be.rejectedWith(
      '"user" is invalid'
    );
  });

  it("should throw error if code is null", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);
    const inputOrder = {
      amount: faker.finance.amount(),
      orderDate: faker.date.past(),
      user: {
        _id: testUser._id,
        cpf: testUser.cpf
      }
    };
    await expect(OrderService.create(inputOrder)).to.be.rejectedWith(
      '"code" is required'
    );
  });
});

describe("Update an order", () => {
  it("should update an order with status under_review and return the updated result", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 99.9,
      status: "under_review",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    const inputOrder = {
      status: "approved"
    };
    const result = await OrderService.patch(testOrderId, inputOrder);
    expect(result).to.not.be.null;
    expect(result.status).to.be.eql("approved");
    expect(result.amount).to.be.eql(testOrder.amount);
    expect(result.cashbackPercentage).to.be.eql(testOrder.cashbackPercentage);
    expect(result.cashbackValue).to.be.eql(testOrder.cashbackValue);
  });

  it("should update an order with status under_review \
   to a amount lesser than $1000, and return the updated result\
   with the right cashback values", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 1200,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 15,
      cashbackValue: 180,
      status: "under_review",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    const inputOrder = {
      amount: 900
    };
    const result = await OrderService.patch(testOrderId, inputOrder);
    expect(result.amount).to.be.eql(900);
    expect(result.cashbackPercentage).to.be.eql(10);
    expect(result.cashbackValue).to.be.eql(90);
  });
  it("should update an order with status under_review \
   to a amount between $1000 and $1500, and return the updated result\
   with the right cashback values", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 900,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 90,
      status: "under_review",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    const inputOrder = {
      amount: 1200
    };
    const result = await OrderService.patch(testOrderId, inputOrder);
    expect(result.amount).to.be.eql(1200);
    expect(result.cashbackPercentage).to.be.eql(15);
    expect(result.cashbackValue).to.be.eql(180);
  });
  it("should update an order with status under_review \
   to a amount greater than $1500, and return the updated result\
   with the rigth cashback values", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 1000,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 15,
      cashbackValue: 150,
      status: "under_review",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    const inputOrder = {
      amount: 2000
    };
    const result = await OrderService.patch(testOrderId, inputOrder);
    expect(result.amount).to.be.eql(2000);
    expect(result.cashbackPercentage).to.be.eql(20);
    expect(result.cashbackValue).to.be.eql(400);
  });

  it("should throw error if the order status is approved", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 99.9,
      status: "approved",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    const inputOrder = {
      amount: 2000.0
    };
    await expect(
      OrderService.patch(testOrderId, inputOrder)
    ).to.be.rejectedWith(
      `Order: ${testOrderId} is approved and cannot be updated`
    );
  });

  it("should throw error if the order status is rejected", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 99.9,
      status: "rejected",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    const inputOrder = {
      amount: 2000.0
    };
    await expect(
      OrderService.patch(testOrderId, inputOrder)
    ).to.be.rejectedWith(
      `Order: ${testOrderId} is rejected and cannot be updated`
    );
  });
  it("should not update if attempts modify the user", async () => {});
  it("should not update if attempts modify the cashbackValue", async () => {});
  it("should not update if attempts modify the cashbackPercentage", async () => {});
});

describe("List orders", () => {
  it("should return an array of orders of the given user", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrder1 = {
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 99.9,
      status: "under_review",
      user: testUser._id
    };
    const testOrder2 = {
      amount: 1200,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 15,
      cashbackValue: 180,
      status: "approved",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertMany([testOrder1, testOrder2]);

    const result = await OrderService.list(testUser._id);
    expect(result.count).to.be.eql(2);
    expect(result.orders).to.be.an("array");
    expect(result.orders).to.have.lengthOf(2);
  });
});

describe("Fetch an order", () => {
  it("should return an order previously created", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 99.9,
      status: "under_review",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    const result = await OrderService.findById(testOrderId);
    expect(result).to.not.be.null;
    expect(result.code).to.be.eql(testOrder.code);
  });
});

describe("Delete an order", () => {
  it("should delete an order previously created with status under_review", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 99.9,
      status: "under_review",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    await OrderService.remove(testOrderId);

    const result = await conn.collections.orders.findOne({ _id: testOrderId });
    expect(result).to.be.null;
  });
  it("should throw error if the order does not exists", async () => {});
  it("should throw error if the order status is approved", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 99.9,
      status: "approved",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    await expect(OrderService.remove(testOrderId)).to.be.rejectedWith(
      `Order: ${testOrderId} is approved and cannot be deleted`
    );
  });
  it("should throw error if the order status is rejected", async () => {
    const testUser = {
      _id: Types.ObjectId("5e1716bbe11965806372cc42"),
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    const testOrderId = "5e1729977f83ec615cceae36";
    const testOrder = {
      _id: Types.ObjectId(testOrderId),
      amount: 999.0,
      code: faker.random.number(),
      orderDate: faker.date.past(),
      cashbackPercentage: 10,
      cashbackValue: 99.9,
      status: "rejected",
      user: testUser._id
    };
    await conn.collections.users.insertOne(testUser);
    await conn.collections.orders.insertOne(testOrder);

    await expect(OrderService.remove(testOrderId)).to.be.rejectedWith(
      `Order: ${testOrderId} is rejected and cannot be deleted`
    );
  });
});
