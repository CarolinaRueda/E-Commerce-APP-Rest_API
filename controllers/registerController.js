const pool = require("../db/dbConfig");
const bcrypt = require("bcrypt");

const getRegister = (req, res) => {
  res.send("Enter your info");
};

const checkDuplicate = async (req, res, next) => {
  const { email } = req.body;

  const text = "Select * from users where email = $1";
  const values = [email];

  try {
    const check = await (await pool.query(text, values)).rowCount;
    console.log(check);
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

module.exports = {
  getRegister,
  checkDuplicate,
  addUser,
};
