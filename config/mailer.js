const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abhinavloan28@gmail.com",
    pass: "mjzuneyvmefsbbtz",
  },
});

// Function to send an email to a dynamic email address
function sendEmail(toEmail, studentName, journalName, teacherName) {
  const mailOptions = {
    from: "abhinavloan28@gmail.com",
    to: toEmail,
    subject: journalName + " Journal Notification",
    text:
      "Dear " +
      studentName +
      ", You have been tagged in " +
      journalName +
      " journal by " +
      teacherName +
      ". Please log in to your account to view the journal.",
    html: `
      <h3>Dear ${studentName},</h3>
      <p>You have been tagged in <strong >${journalName}</strong> journal by <em style="color: red;">${teacherName}</em>.</p>
      <p style="color: red;"> Please <a href="https://journalapptest.onrender.com/auth/loginStudent" style="color: blue;">log in </a> to your account to view the journal.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { sendEmail };
