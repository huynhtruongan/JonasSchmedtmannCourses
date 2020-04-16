const nodemailer = require("nodemailer");
const sendEmail = async options => {
  // 1) Create stranporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.PORT_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2) Define email options
  const mailOptions = {
    from: "An Dev <admin12@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
