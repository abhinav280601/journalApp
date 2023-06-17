// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Teacher = sequelize.define(
  "teachers",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Teacher;
