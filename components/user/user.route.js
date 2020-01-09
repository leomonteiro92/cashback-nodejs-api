const { Router } = require("express");
const UserController = require("./user.controller");

const router = Router();
router.post("/", UserController.signUp);

module.exports = router;
