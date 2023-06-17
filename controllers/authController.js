const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const sequelize = require("../config/database");
const { json } = require("sequelize");
const env = require("dotenv").config();

async function registerTeacher(req, res) {
  try {
    const { username, password, email } = req.body;

    // Check if the user already exists
    const query = `SELECT username FROM teachers WHERE username = ?`;
    const existingUser = await sequelize.query(query, {
      replacements: [username],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user record
    const insertQuery = `
      INSERT INTO teachers (username, password, email) VALUES (?, ?, ?)
    `;
    const [user] = await sequelize.query(insertQuery, {
      replacements: [username, hashedPassword, email],
    });

    res.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
}

async function registerStudent(req, res) {
  try {
    const { username, password, email } = req.body;

    // Check if the user already exists
    const query = `SELECT username FROM students WHERE username = ?`;
    const [existingUser] = await sequelize.query(query, {
      replacements: [username],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user record
    const insertQuery = `
      INSERT INTO students (username, password, email)VALUES (?, ?, ?)`;
    const [user] = await sequelize.query(insertQuery, {
      replacements: [username, hashedPassword, email],
    });

    res.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
}

async function loginTeacher(req, res) {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const query = `SELECT * FROM teachers WHERE username = ?`;
    const [user] = await sequelize.query(query, { replacements: [username] });
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
    req.session.token = token;
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Failed to login" });
  }
}

async function loginStudent(req, res) {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const query = `SELECT * FROM students WHERE username = ?`;
    const [user] = await sequelize.query(query, { replacements: [username] });
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
    req.session.token = token;
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Failed to login" });
  }
}

async function getTeacherById(req, res) {
  try {
    const { userId } = req.params;

    const query = `SELECT * FROM teachers WHERE id = ?`;
    const [user] = await sequelize.query(query, { replacements: [userId] });

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
}

async function getStudentById(req, res) {
  try {
    const { userId } = req.params;

    const query = `SELECT * FROM students WHERE id = ?`;
    const [user] = await sequelize.query(query, { replacements: [userId] });

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
}

async function getTeachers(req, res) {
  try {
    const query = `SELECT username FROM teachers`;
    const [teachers] = await sequelize.query(query);

    res.json(teachers);
  } catch (error) {
    console.error("Error getting teachers:", error);
    res.status(500).json({ message: "Failed to get teachers" });
  }
}

async function getStudents(req, res) {
  try {
    const query = `SELECT username FROM students`;
    const [students] = await sequelize.query(query);

    res.json(students);
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).json({ message: "Failed to get students" });
  }
}

module.exports = {
  registerTeacher,
  registerStudent,
  loginTeacher,
  loginStudent,
  getTeacherById,
  getStudentById,
  getTeachers,
  getStudents,
};
