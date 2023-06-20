// routes/journalRoutes.js
const express = require("express");
const journalController = require("../controllers/journalController");
const authenticateToken = require("../middlewares/authMiddleware");
const multer = require("multer");
//multer middleware instance
const upload = multer();

const router = express.Router();

router.post(
  "/journals",
  authenticateToken,
  upload.single("attachment"),
  journalController.createJournal
);
router.post("/publish", authenticateToken, journalController.publishJournal);
router.put(
  "/journals/:journalId",
  authenticateToken,
  journalController.updateJournal
);
router.delete(
  "/journals/:journalId",
  authenticateToken,
  journalController.deleteJournal
);
// router.get(
//   "/tagged-journals/:studentId",
//   authenticateToken,
//   journalController.getTaggedJournals
// );
router.get(
  "/teacher-journals",
  authenticateToken,
  journalController.getJournalByTeacher
);
router.get(
  "/student-journals",
  authenticateToken,
  journalController.getJournalByStudent
);

module.exports = router;
