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
function sendEmail(toEmails) {
  const mailOptions = {
    from: "abhinavloan28@gmail.com",
    to: toEmails.join(", "),
    subject: "Journal App",
    text: "You have been tagged in a journal.",
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
