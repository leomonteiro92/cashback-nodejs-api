const { Router } = require("express");
const OrderController = require("./order.controller");

const router = Router();
router.delete("/:id", OrderController.remove);
router.get("/:id", OrderController.findById);
router.get("/", OrderController.list);
router.post("/", OrderController.create);
router.put("/:id", OrderController.patch);

module.exports = router;
