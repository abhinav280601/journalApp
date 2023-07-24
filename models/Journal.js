// models/Journal.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Journal = sequelize.define(
  "journals",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachment: {
      type: DataTypes.BLOB,
    },
    publish_time: {
      type: DataTypes.DATE,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
  },
  { timestamps: false }
);

module.exports = Journal;
