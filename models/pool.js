require("dotenv").config();
const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`;

module.exports = new Pool({ connectionString });
