const pool = require("../db/dbConfig");

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

module.exports = {
  getOutCarts,
  getOutCartByID,
  addNewCart,
  updateCart,
  deleteCart,
  deleteOneItem,
};
