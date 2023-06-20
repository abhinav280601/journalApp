const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");
const { sendEmail } = require("../config/mailer");
const fs = require("fs");

async function createJournal(req, res) {
  try {
    const { title, description, attachment, username } = req.body;

    const selectQuery = `SELECT id FROM teachers WHERE username = :username`;
    const [teacher] = await sequelize.query(selectQuery, {
      replacements: { username },
      type: QueryTypes.SELECT,
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const [journal] = await sequelize.query(
      `INSERT INTO journals (title, description, attachment, teacher_id) VALUES (:title, :description, :attachment, :teacherId)`,
      {
        replacements: {
          title,
          description,
          attachment: attachment || "",
          teacherId: teacher.id,
        },
        type: QueryTypes.INSERT,
      }
    );

    res.json({ journalId: journal });
  } catch (error) {
    console.error("Error creating journal:", error);
    res.status(500).json({ message: "Failed to create journal" });
  }
}

async function publishJournal(req, res) {
  try {
    const { title, tagged_students } = req.body;

    const [journal] = await sequelize.query(
      `SELECT id FROM journals WHERE title = :title`,
      {
        replacements: { title },
        type: QueryTypes.SELECT,
      }
    );

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    const [existingJournal] = await sequelize.query(
      `SELECT journal_id FROM tags WHERE journal_id = :journalId`,
      {
        replacements: { journalId: journal.id },
      }
    );

    if (existingJournal.length > 0) {
      return res.status(400).json({ message: "Journal already published" });
    }
    for (let i = 0; i < tagged_students.length; i++) {
      const [student] = await sequelize.query(
        `SELECT id FROM students WHERE username = :username`,
        {
          replacements: { username: tagged_students[i] },
          type: QueryTypes.SELECT,
        }
      );

      const [emails] = await sequelize.query(
        `SELECT * FROM students WHERE username = :username`,
        {
          replacements: { username: tagged_students[i] },
          type: QueryTypes.SELECT,
        }
      );

      const [teacher] = await sequelize.query(
        `SELECT * FROM journals WHERE id = :journal_id`,
        {
          replacements: { journal_id: journal.id },
          type: QueryTypes.SELECT,
        }
      );

      const [teacherName] = await sequelize.query(
        `SELECT * FROM teachers WHERE id = :teacher_id`,
        {
          replacements: { teacher_id: teacher.teacher_id },
          type: QueryTypes.SELECT,
        }
      );

      sendEmail(emails.email, emails.username, title, teacherName.username);

      if (!student) {
        return res
          .status(404)
          .json({ message: `Student ${tagged_students[i]} not found` });
      }

      await sequelize.query(
        `INSERT INTO tags (journal_id, student_id) VALUES (:journalId, :studentId)`,
        {
          replacements: {
            journalId: journal.id,
            studentId: student.id,
          },
          type: QueryTypes.INSERT,
        }
      );
    }

    res.json({ message: "Journal Published!" });
  } catch (error) {
    console.error("Error publishing journal:", error);
    res.status(500).json({ message: "Failed to publish journal" });
  }
}

async function updateJournal(req, res) {
  try {
    const { title, description } = req.body;
    const { journalId } = req.params;

    await sequelize.query(
      `UPDATE journals SET title = :title, description = :description WHERE id = :journalId`,
      {
        replacements: {
          title,
          description,
          journalId,
        },
        type: QueryTypes.UPDATE,
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating journal:", error);
    res.status(500).json({ message: "Failed to update journal" });
  }
}

async function deleteJournal(req, res) {
  try {
    const { journalId } = req.params;
    const [journal] = await sequelize.query(
      `SELECT id FROM journals WHERE title = :journalId`,
      {
        replacements: { journalId },
      }
    );

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    await sequelize.query(`DELETE FROM journals WHERE id = :journalId`, {
      replacements: {
        journalId,
      },
      type: QueryTypes.DELETE,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting journal:", error);
    res.status(500).json({ message: "Failed to delete journal" });
  }
}

async function getJournalByTeacher(req, res) {
  try {
    const { username } = req.body;

    const [teacher] = await sequelize.query(
      `SELECT id FROM teachers WHERE username = :username`,
      {
        replacements: { username },
        type: QueryTypes.SELECT,
      }
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const journals = await sequelize.query(
      `SELECT * FROM journals WHERE teacher_id = :teacherId`,
      {
        replacements: { teacherId: teacher.id },
        type: QueryTypes.SELECT,
      }
    );

    res.json(journals);
  } catch (error) {
    console.error("Error retrieving journals:", error);
    res.status(500).json({ message: "Failed to retrieve journals" });
  }
}

async function getJournalByStudent(req, res) {
  try {
    const { username } = req.body;

    const [student] = await sequelize.query(
      `SELECT id FROM students WHERE username = :username`,
      {
        replacements: { username },
        type: QueryTypes.SELECT,
      }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const tags = await sequelize.query(
      `SELECT * FROM tags WHERE student_id = :studentId`,
      {
        replacements: { studentId: student.id },
        type: QueryTypes.SELECT,
      }
    );

    if (tags.length === 0) {
      return res.json({ message: "No journals found" });
    }

    const journalIds = tags.map((tag) => tag.journal_id);

    const journals = await sequelize.query(
      `SELECT * FROM journals WHERE id IN (:journalIds)`,
      {
        replacements: { journalIds },
        type: QueryTypes.SELECT,
      }
    );

    res.json(journals);
  } catch (error) {
    console.error("Error retrieving journals:", error);
    res.status(500).json({ message: "Failed to retrieve journals" });
  }
}

async function getTaggedJournals(req, res) {
  try {
    const { studentId } = req.params;

    const journals = await sequelize.query(
      `SELECT * FROM journals WHERE tagged_students LIKE :studentId`,
      {
        replacements: { studentId: `%${studentId}%` },
        type: QueryTypes.SELECT,
      }
    );

    res.json(journals);
  } catch (error) {
    console.error("Error retrieving tagged journals:", error);
    res.status(500).json({ message: "Failed to retrieve tagged journals" });
  }
}

module.exports = {
  createJournal,
  updateJournal,
  deleteJournal,
  getTaggedJournals,
  publishJournal,
  getJournalByTeacher,
  getJournalByStudent,
};
