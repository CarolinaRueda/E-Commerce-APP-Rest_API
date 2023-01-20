const pool = require("../db/dbConfig");

const getCheckout = (req, res) => {
  res.send("/checkout GET request received");
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

module.exports = { getCheckout, checkOut };
