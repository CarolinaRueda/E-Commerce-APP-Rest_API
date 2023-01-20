const router = require("express").Router();
const { checkOut, getCheckout } = require("../controllers/checkoutController");

router.get("/", getCheckout);

router.post("/cart/:cartId", checkOut);

module.exports = router;
