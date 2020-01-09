const { Router } = require("express");
const BalanceController = require("./balance.controller");

const router = Router();
router.get("/", BalanceController.get);

module.exports = router;
