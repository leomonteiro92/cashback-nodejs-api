const chai = require("chai");
const faker = require("faker");

chai.use(require("chai-as-promised"));
chai.use(require("chai-http"));
const { expect } = chai;

const app = require("../app");

let conn;

before(() => {
  const { db } = require("../database/index");
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

describe("Login validation", () => {
  it("should return an object with access token for an user previously created", async () => {
    const testUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      cpf: "70310966000",
      password: "$2a$10$tPSm2M4PWMpxb9DfunJUaOSuWSGT3CBH6EX0.DuAnPtbGYnBGkp3a" //stands for 123456
    };
    await conn.collections.users.insertOne(testUser);

    chai
      .request(app)
      .post("/token")
      .send({
        client_id: "c@shb@ck",
        client_secret: "c@shb@ck",
        grant_type: "password",
        username: testUser.email.toLowerCase(),
        password: "123456"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty("access_token");
      });
  });
});
