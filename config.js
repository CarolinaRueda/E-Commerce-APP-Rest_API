require("dotenv").config();

module.exports = {
  SERVER_SECRET: process.env.SERVER_SECRET,
  PORT: process.env.PORT || 3000,
  DB: {
    USER: process.env.DBUSER,
    HOST: process.env.DBHOST,
    NAME: process.env.DBNAME,
    PASSWORD: process.env.DBPASSWORD,
    PORT: process.env.DBPORT,
  },
};
