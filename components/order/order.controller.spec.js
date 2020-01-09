const faker = require("faker");
const sinon = require("sinon");
const OrderController = require("./order.controller");
const Types = require("mongoose").Types;
const { db: conn } = require("../../database/index");

async function seedTestUser() {
  const testUser = {
    _id: Types.ObjectId("5e1716bbe11965806372cc42"),
    name: faker.name.findName(),
    email: faker.internet.email(),
    cpf: "70310966000",
    password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
  };
  await conn.collections.users.insertOne(testUser);
  return testUser;
}

function mockResponse(testUser) {
  return {
    locals: {
      oauth: {
        token: {
          user: {
            _id: testUser._id,
            cpf: testUser.cpf
          }
        }
      }
    },
    status: sinon.stub(),
    json: sinon.stub()
  };
}

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
  it("should create an order and return status 201", async () => {
    const testUser = await seedTestUser();

    const req = {
      body: {
        amount: 999.0,
        code: faker.finance.amount(),
        orderDate: faker.date.past()
      }
    };
    const res = mockResponse(testUser);

    await OrderController.create(req, res);
    sinon.assert.calledWith(res.status, 201);
  });

  it("should return status 400 if amount is null", async () => {
    const testUser = await seedTestUser();

    const req = {
      body: {
        code: faker.finance.amount(),
        orderDate: faker.date.past()
      }
    };
    const res = mockResponse(testUser);

    await OrderController.create(req, res);
    sinon.assert.calledWith(res.status, 400);
  });

  it("should return status 400 if amount is not a number", async () => {
    const testUser = await seedTestUser();

    const req = {
      body: {
        amount: "$1000",
        code: faker.finance.amount(),
        orderDate: faker.date.past()
      }
    };
    const res = mockResponse(testUser);

    await OrderController.create(req, res);
    sinon.assert.calledWith(res.status, 400);
  });

  it("should return status 400 if orderDate is null", async () => {
    const testUser = await seedTestUser();

    const req = {
      body: {
        amount: 999.0,
        code: faker.finance.amount()
      }
    };
    const res = mockResponse(testUser);

    await OrderController.create(req, res);
    sinon.assert.calledWith(res.status, 400);
  });

  it("should return status 400 if orderDate is not a valid date", async () => {
    const testUser = await seedTestUser();

    const req = {
      body: {
        amount: 999.0,
        code: faker.finance.amount(),
        orderDate: "28/12/1992"
      }
    };
    const res = mockResponse(testUser);

    await OrderController.create(req, res);
    sinon.assert.calledWith(res.status, 400);
  });

  it("should return status 400 if code is null", async () => {
    const testUser = await seedTestUser();

    const req = {
      body: {
        amount: 999.0,
        orderDate: faker.date.past()
      }
    };
    const res = mockResponse(testUser);

    await OrderController.create(req, res);
    sinon.assert.calledWith(res.status, 400);
  });
});

describe("Update an order", () => {
  it('should return status 200 if the order`s status is "under_review"', async () => {
    //Populate data
    const testUser = await seedTestUser();
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
    await conn.collections.orders.insertOne(testOrder);
    //Mock request and response
    const req = {
      params: {
        id: testOrderId
      },
      body: {
        status: "approved"
      }
    };
    const res = mockResponse(testUser);
    //Assert
    await OrderController.patch(req, res);
    sinon.assert.calledWith(res.status, 200);
  });
  it("should return status 400 if the order`s status is approved", async () => {
    //Populate data
    const testUser = await seedTestUser();
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
    await conn.collections.orders.insertOne(testOrder);
    //Mock request and response
    const req = {
      params: {
        id: testOrderId
      },
      body: {
        amount: 3000
      }
    };
    const res = mockResponse(testUser);
    //Assert
    await OrderController.patch(req, res);
    sinon.assert.calledWith(res.status, 400);
  });
  it("should return status 400 if the order`s status is rejected", async () => {
    const testUser = await seedTestUser();
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
    await conn.collections.orders.insertOne(testOrder);

    const req = {
      params: {
        id: testOrderId
      },
      body: {
        amount: 30000
      }
    };
    const res = mockResponse(testUser);

    await OrderController.patch(req, res);
    sinon.assert.calledWith(res.status, 400);
  });
});

describe("Remove an order", () => {
  it('should return status 200 if the order`s status is "under_review"', async () => {
    //Populate data
    const testUser = await seedTestUser();
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
    await conn.collections.orders.insertOne(testOrder);
    //Mock request and response
    const req = {
      params: {
        id: testOrderId
      },
      body: {
        status: "approved"
      }
    };
    const res = mockResponse(testUser);
    //Assert
    await OrderController.remove(req, res);
    sinon.assert.calledWith(res.status, 204);
  });

  it("should return status 400 if the order`s status is approved", async () => {
    //Populate data
    const testUser = await seedTestUser();
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
    await conn.collections.orders.insertOne(testOrder);
    //Mock request and response
    const req = {
      params: {
        id: testOrderId
      },
      body: {
        amount: 3000
      }
    };
    const res = mockResponse(testUser);
    //Assert
    await OrderController.remove(req, res);
    sinon.assert.calledWith(res.status, 400);
  });

  it("should return status 400 if the order`s status is rejected", async () => {
    const testUser = await seedTestUser();
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
    await conn.collections.orders.insertOne(testOrder);

    const req = {
      params: {
        id: testOrderId
      },
      body: {
        amount: 30000
      }
    };
    const res = mockResponse(testUser);

    await OrderController.remove(req, res);
    sinon.assert.calledWith(res.status, 400);
  });
});

describe("Fetch an order", () => {
  it("should return status 200 after searching an order", async () => {
    //Populate data
    const testUser = await seedTestUser();
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
    await conn.collections.orders.insertOne(testOrder);
    //Mock request and response
    const req = {
      params: {
        id: testOrderId
      }
    };
    const res = mockResponse(testUser);
    //Assert
    await OrderController.findById(req, res);
    sinon.assert.calledWith(res.status, 200);
  });
  it("should return status 404 after searching an order that do not exists", async () => {
    //Populate data
    const testUser = await seedTestUser();
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
    //The order was not persisted!

    //Mock request and response
    const req = {
      params: {
        id: testOrderId
      }
    };
    const res = mockResponse(testUser);
    //Assert
    await OrderController.findById(req, res);
    sinon.assert.calledWith(res.status, 404);
  });
});

describe("List orders", () => {
  it("should return status 200 after request a list of orders", async () => {
    //Populate data
    const testUser = await seedTestUser();
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
    await conn.collections.orders.insertMany([testOrder1, testOrder2]);

    //Mock request and response
    const req = {};
    const res = mockResponse(testUser);
    //Assert
    await OrderController.list(req, res);
    sinon.assert.calledWith(res.status, 200);
  });
});
