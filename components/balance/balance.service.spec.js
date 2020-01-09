const chai = require("chai");
const BalanceService = require("./balance.service");

chai.use(require("chai-as-promised"));
const { expect } = chai;

describe("Fetch the balance", () => {
  it("should return the credit balance for a given cpf", async () => {
    const cpf = "70310966000";
    const result = await BalanceService.get(cpf);
    expect(result).to.not.be.null;
    expect(result.credit).to.be.a("number");
  });
});
