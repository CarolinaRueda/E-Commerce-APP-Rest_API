const router = require("express").Router();
const {
  getOutOrders,
  getOutOrdersByID,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordersController");

router.get("/", getOutOrders);

router.route("/:id").get(getOutOrdersByID).put(updateOrder);

router.delete("/:id/cancel", deleteOrder);

module.exports = router;
