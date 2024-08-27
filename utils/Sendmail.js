const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");

module.exports.sendMail = (req, res, next, url) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Mail Private Limited",
    to: req.body.email,
    subject: "Password Reset Link",
    html: `<h1>Click link below to reset password</h1>
                <a href="${url}">Password Reset Link</a>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      return new ErrorHandler(err, 500);
    }

    return res.json({
      message: "Mail Sent Successfully",
      url,
    });
  });
};
