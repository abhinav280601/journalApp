// config/database.js
const { Sequelize } = require("sequelize");
const os = require("os");

const sequelize = new Sequelize({
  dialect: "sqlite",
  // storage: process.cwd() + "./db_directory/database.sqlite3", // Path to SQLite database file
  storage: "./db_directory/database.sqlite3", // Path to SQLite database file
});

module.exports = sequelize;
