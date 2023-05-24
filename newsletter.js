const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtps.virgilio.it",
  port: 465,
  secure: true,
  auth: {
    user: "aitimes@virgilio.it",
    password: "7word?PASS",
  },
});

async function sendNewsletter(subscribers, subject, content) {
  try {
    const mailOptions = {
      from: "aitimes@virgilio.it",
      to: subscribers.join(","),
      subject: subject,
      html: content,
    };

    const res = await transporter.sendMail(mailOptions);
    console.log("[newsletter.js] Newsletter sent: ", res.response);
  } catch (error) {
    console.error("[newsletter.js] Error sending newsletter: ", error);
  }
}

sendNewsletter(["gianmarco.longiaru@gmail.com, eleonoramazz04@gmail.com"], "Test Newsletter", "Meow meow meow");
