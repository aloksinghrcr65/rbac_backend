const { createTransport } = require("nodemailer");
const { config } = require("../config/config");
const { EMAIL, SECURE_PASS } = config;

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: SECURE_PASS,
  },
});

/**
 * Function to send an email with login credentials.
 * @param {string} to - Recipient email.
 * @param {string} subject - Email subject.
 * @param {string} htmlContent - HTML content of the email.
 */

const sendMail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: EMAIL,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = sendMail;
