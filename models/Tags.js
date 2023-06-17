// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Tags = sequelize.define(
  "tags",
  {
    journal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Tags;
