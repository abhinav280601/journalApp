// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define(
  "students",
  {
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Student;
