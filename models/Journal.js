// models/Journal.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Journal = sequelize.define(
  "journals",
  {
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
      defaultValue: [],
    },
    // tagged_students: {
    //   type: DataTypes.JSON,
    //   defaultValue: [],
    // },
    publish_time: {
      type: DataTypes.DATE,
      defaultValue: [],
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      defaultValue: [],
      foreignKey: true,
    },
  },
  { timestamps: false }
);

module.exports = Journal;
