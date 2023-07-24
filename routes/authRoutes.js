// routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const cors = require("cors");

const router = express.Router();
router.use(cors());

router.post("/loginStudent", authController.loginStudent);
router.post("/registerStudent", authController.registerStudent);
router.post("/loginTeacher", authController.loginTeacher);
router.post("/registerTeacher", authController.registerTeacher);
router.get("/getTeachers", authController.getTeachers);
router.get("/getStudents", authController.getStudents);

module.exports = router;
