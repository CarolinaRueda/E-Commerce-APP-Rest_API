const router = require("express").Router();
const passport = require("passport");
const { login } = require("../controllers/loginController");

router
  .route("/")
  .get(login)
  .post(
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
    })
  );

module.exports = router;
