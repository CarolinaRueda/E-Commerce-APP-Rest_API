const router = require("express").Router();
const {
  getOutCarts,
  getOutCartByID,
  addNewCart,
  updateCart,
  deleteCart,
  deleteOneItem,
} = require("../controllers/cartController");
const { checkOut } = require("../controllers/checkoutController");

router.route("/cart").get(getOutCarts).post(addNewCart);

router.route("/cart/:cartId").get(getOutCartByID).delete(deleteCart);

router.post("/cart/:cartId/checkout", checkOut);

router.post("/:userId/cart/:cartId", updateCart);

router.delete("/cart/:id", deleteOneItem);

module.exports = router;
