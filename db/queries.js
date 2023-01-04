const pool = require("./dbConfig");
const bcrypt = require("bcrypt");

// LOGIN

const checkDuplicate = async (req, res, next) => {
  const { email } = req.body;

  const text = "Select * from users where email = $1";
  const values = [email];

  try {
    const check = pool.query(text, values);
    if (check) {
      res.redirect("/login");
    } else {
      return next();
    }
  } catch (err) {
    throw err;
  }
};

const addUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const text =
    "insert into users (first_name, last_name, email, password) values($1, $2, $3, $4) RETURNING *";
  const values = [first_name, last_name, email, hashedPass];

  try {
    await pool.query(text, values);
    res.send(`User created!`);
  } catch (err) {
    throw err;
  }
};

// USERS

const getOutUsers = async (req, res) => {
  try {
    const users = await pool.query("select * from users");
    res.send(users.rows);
  } catch (err) {
    throw err;
  }
};

const getOutUsersByID = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query("select * from where id = $1", [id]);
    res.send(user.rows[0]);
  } catch (err) {
    throw err;
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name } = req.body;

  const cases = {
    1: {
      query: "UPDATE users SET first_name = $1 WHERE id = $2 RETURNING *",
      values: [first, id],
    },
    2: {
      query: "UPDATE users SET last_name = $1 WHERE id = $2 RETURNING *",
      values: [last, id],
    },
    3: {
      query:
        "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *",
      values: [first, last, id],
    },
  };

  try {
    if (first_name && !last_name) {
      await pool.query(cases[1].query, cases[1].values);
      res.send(`user updated, new values ${first_name}`);
    }
    if (!first_name && last_name) {
      await pool.query(cases[2].query, cases[2].values);
      res.send(`user updated, new values ${last_name}`);
    }
    if (first_name && last_name) {
      await pool.query(cases[3].query, cases[3].values);
      res.send(`user updated, new values ${first_name} | ${last_name}`);
    }
    res.redirect(`/users/${id}`);
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("delete from users where id = $1", [id]);
    res.send(`Deleted user with ID: ${id}`);
  } catch (err) {
    throw err;
  }
};

// CART

const getOutCarts = async (req, res) => {
  try {
    const carts = await pool.query("select * from cart");
    res.send(carts.rows);
  } catch (err) {
    throw err;
  }
};

const getOutCartByID = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await pool.query(
      "select * from cart_items where cart_id = $1",
      [cartId]
    );
    res.send(cart.rows);
  } catch (err) {
    throw err;
  }
};

const addNewCart = async (req, res) => {
  const created = new Date().toISOString().split("T")[0];

  try {
    const cart = await pool.query(
      "insert into cart (created) values ($1) returnig *",
      [created]
    );
    res.send(`New cart created with ID : ${cart.rows[0].id}`);
  } catch (err) {
    throw err;
  }
};

const updateCart = async (req, res) => {
  const { userId, cartId } = req.params;
  const { quantity, product_id } = req.body;
  const modified = new Date().toISOString().split("T")[0];

  try {
    await pool.query("update cart set modified = $1 where id = $2", [
      modified,
      cartId,
    ]);

    const newItem = await pool.query(
      "insert into cart_items (product_id, user_id, quantity, modified,  cart_id) values ($1, $2, $3, $4, $5) returning *",
      [product_id, userId, quantity, modified, cartId]
    );
    res.send(newItem.rows[0]);
  } catch (err) {
    throw err;
  }
};

const deleteCart = async (req, res) => {
  const { cartId } = req.params;

  try {
    await pool.query("delete from carts where id = $1", [cartId]);
    res.send(`Deleted cart with ID: ${cartId}`);
  } catch (err) {
    throw err;
  }
};

const deleteOneItem = async (req, res) => {
  const { id } = req.params;
  const { product_id } = req.body;

  try {
    await pool.query(
      "delete from cart_items where user_id = $1 and product_id = $2 returning *",
      [id, product_id]
    );

    const itemName = await pool.query(
      "select name from products where id = $1",
      [product_id]
    );
    res.send(`Succesfully deleted ${itemName.rows[0]} from cart`);
  } catch (err) {
    throw err;
  }
};

// ORDERS

const getOutOrders = async (req, res) => {
  try {
    const orders = await pool.query("select * from orders");
    res.send(orders.rows);
  } catch (err) {
    throw err;
  }
};

const getOutOrdersByID = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await pool.query("select * from orders where id = $1", [id]);
    res.send(orders.rows[0]);
  } catch (err) {
    throw err;
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const modified = new Date().toISOString().split("T")[0];

  try {
    const order = await pool.query(
      "update orders set status = $1, modified = $2 where id = $3 returning *",
      [status, modified, id]
    );
    if (order.rows[0].status === "cancelled") {
      res.redirect(`/orders/cancel/${id}`);
    } else {
      res.redirect("/orders");
    }
  } catch (err) {
    throw err;
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "select quantity, product_id from order_items where order_id = $1",
      [id]
    );

    for (const product of rows) {
      const { quantity, product_id } = product;

      await pool.query(
        "update products set quantity = quantity + $1 where id = $2",
        [quantity, product_id]
      );
    }

    await pool.query("delete from order_items where order_1 = $1", [1]);
    await pool.query("delete from orders where id = $1", [id]);
    res.send(`Deleted order with ID: ${id}`);
  } catch (err) {
    throw err;
  }
};

// PRODUCTS

const getOutProducts = async (req, res) => {
  try {
    const products = await pool.query("select * from products");
    res.send(products.rows);
  } catch (err) {
    throw err;
  }
};

const getOutProductsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await pool.query("select * from products where id = $1", [
      id,
    ]);
    res.send(products.rows[0]);
  } catch (err) {
    throw err;
  }
};

const addNewProduct = async (req, res) => {
  const { name, quantity, description, price } = req.body;
  const text =
    "insert into products (name, quantity, description, price) values($1, $2, $3, $4)";
  const values = [name, quantity, description, price];

  try {
    const product = await pool.query(text, values);
    res.send(product.rows[0]);
  } catch (err) {
    throw err;
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, description, price } = req.body;
    const product = await pool.query(
      "update products set name = $1, quantity = $2, description = $3, price = $4 where id = $5 returning *",
      [name, quantity, description, price, id]
    );
    res.send(product.rows[0]);
  } catch (err) {
    throw err;
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("delete from products where id = $1", [id]);
    res.send(`Product with id:${id} successfully removed.`);
  } catch (err) {
    throw err;
  }
};

const checkOut = async (req, res) => {
  const { cartId } = req.params;
  const { date, user_id, status, total, products } = req.body;
  const modified = new Date().toISOString().split("T")[0];

  try {
    const newOrder = await pool.query(
      "insert into orders (date, user_id, status, modified, total) values ($1, $2, $3, $4, $5)",
      [date, user_id, status, modified, total]
    );

    for (const product of products) {
      const { id, quantity, price } = product;

      await pool.query("delete from cart_items where product_id = $1", [id]);

      const cartCheck = await pool.query(
        "select * from cart_items where cart_id = $1",
        [cartId]
      );

      if (!cartCheck.rowCount) {
        await pool.query("delete from cart where id = $1", [cartId]);
      }

      await pool.query(
        "insert into order_item (order_id, product_id, quantity, price) values ($1, $2, $3, $4)",
        [newOrder.rows[0].id, id, quantity, price]
      );

      await pool.query(
        "update products set quantity = quantity - $1 where id = $2",
        [quantity, id]
      );
    }
    res.send(
      `Order placed by user: ${user_id} with a total: ${newOrder.rows[0].total}`
    );
  } catch (err) {
    throw err;
  }
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

module.exports = {
  checkDuplicate,
  addUser,
  getOutProducts,
  getOutProductsByID,
  addNewProduct,
  updateProduct,
  deleteProduct,
  getOutOrders,
  getOutOrdersByID,
  updateOrder,
  deleteOrder,
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
  checkOut,
  logout,
};
