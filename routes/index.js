const { BalanceRoute } = require("../components/balance");
const { OrderRoute } = require("../components/order");
const { UserRoute } = require("../components/user");

module.exports = app => {
  app.use("/balance", app.oauth.authenticate(), BalanceRoute);
  app.use("/orders", app.oauth.authenticate(), OrderRoute);
  app.use("/users", UserRoute);
};
