const indexRouter = require("express").Router(),
  cartRouter = require("./cartRouter"),
  checkoutRouter = require("./checkoutRouter"),
  loginRouter = require("./loginRouter"),
  logoutRouter = require("./logoutRouter"),
  ordersRouter = require("./ordersRouter"),
  productsRouter = require("./productsRouter"),
  registerRouter = require("./registerRouter"),
  usersRouter = require("./usersRouter"),
  pageRouter = require("./pageRouter"),
  dashboardRouter = require("./dashboardRouter"),
  { isNotAuthenticate } = require("../middleware/auth");

indexRouter.use("/user", isNotAuthenticate, cartRouter);
indexRouter.use("/checkout", isNotAuthenticate, checkoutRouter);
indexRouter.use("/dashboard", dashboardRouter);
indexRouter.use("/login", loginRouter);
indexRouter.use("/logout", isNotAuthenticate, logoutRouter);
indexRouter.use("/orders", isNotAuthenticate, ordersRouter);
indexRouter.use("/", pageRouter);
indexRouter.use("/products", isNotAuthenticate, productsRouter);
indexRouter.use("/register", registerRouter);
indexRouter.use("/users", isNotAuthenticate, usersRouter);

module.exports = indexRouter;
