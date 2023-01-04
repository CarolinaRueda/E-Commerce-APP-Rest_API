//
const express = require("express"),
  app = express(),
  session = require("express-session"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  { SERVER_SECRET, PORT } = require("./config"),
  initializePassport = require("./passport"),
  {
    checkDuplicate,
    addUser,
    getOutProducts,
    getOutProductsByID,
    addNewProduct,
    updateProduct,
    deleteProduct,
    getOutOrders,
    getOutUsers,
    getOutUsersByID,
    updateUser,
    deleteUser,
    getOutCarts,
    getOutCartByID,
    addNewCart,
    updateCart,
    deleteCart,
    deleteOneItem,
    updateOrder,
    deleteOrder,
    checkOut,
    logout,
  } = require("./db/queries");

//*Passport initialization
initializePassport(passport);

// *Server Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// *Session Setup
app.use(
  session({
    secret: SERVER_SECRET,
    cookie: {
      secure: false,
      maxAge: 30 * 60 * 1000,
    },
    saveUninitialized: false,
    resave: false,
    sameSite: "none",
  })
);

// *Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// *Authentication Setup
const isAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user");
  }
  next();
};

const isNotAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// *Home Routes

app.get("/", (req, res) => {
  res.send("Welcome!");
});

// *Register section

app.get("/register", isAuthenticate, (req, res) => {
  res.send("Enter your info");
});

app.post("/register", checkDuplicate, addUser);

// *Login section

app.get("/login", (req, res) => {
  res.send("Login now");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login",
  })
);

// *User section

//select all users
app.get("/users", getOutUsers);

// select users by id
app.get("/users/:id", getOutUsersByID);

// update user
app.put("/users/:id", updateUser);

// delete user
app.delete("/users/:id", deleteUser);

// *Cart section

// select all carts
app.get("/users/cart", getOutCarts);

// select cart by id
app.get("/users/cart/:cartId", getOutCartByID);

// create new cart
app.post("/cart", addNewCart);

// update cart
app.post("/users/:userId/cart/:cartId", updateCart);

// delete cart
app.delete("/cart/:cartId", deleteCart);

// delete one item
app.delete("/users/cart/:id", deleteOneItem);

// *Orders section

//orders CRUD routes

//select all orders
app.get("/orders", getOutOrders);

// select orders by id
app.get("/orders/:id", getOutProductsByID);

// update order
app.put("/orders/:id", updateOrder);

// delete order
app.delete("/orders/:id/cancel", deleteOrder);

// *Products section

//select all products
app.get("/products", getOutProducts);

// select product by id
app.get("/products/:id", getOutProductsByID);

// add product
app.post("/products", addNewProduct);

// update product
app.put("/products/:id", updateProduct);

// delete product
app.delete("/products/:id", deleteProduct);

// *Checkout section

// select checkout
app.get("/checkout", (req, res) => {
  res.send("/checkout GET request received");
});

// add checkout
app.post("/cart/:cartId/checkout", checkOut);

// *Logout section

app.get("/logout", logout);

// *Server start
app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
