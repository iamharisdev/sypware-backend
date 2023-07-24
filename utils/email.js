const nodemailer = require('nodemailer');

const sendEmail = async (options, encoded, otp, res) => {
  // 1) Create a Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.verify();

  // 2) We need to define Email options
  const mailOptions = {
    from: 'ViralSquare <muhammad.ashfaq@viralsquare.org>',
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // 3) Send the email with node mailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (info) {
      let obj = {
        status: 'success',
        verification_key: encoded,
        OTP: otp,
        message: 'OTP Successfully send',
      };

      res.status(200).json(obj);
    } else {
      res.status(400).json({ status: 400, message: error });
    }
  });
};

module.exports = sendEmail;
