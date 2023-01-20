const dashboard = require("../controllers/dashboardController");
const router = require("express").Router();

router.get("/", dashboard);

module.exports = router;
