import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_SERVER_USER,
        pass: process.env.MAIL_SERVER_PASS,
      },
    });

    console.log(`Sending Email To: ${options.to}`);

    await transporter.sendMail(options);

    console.log(`Email Sent To: ${options.to}`);

    return true;
  } catch (err) {
    // log the error
    console.log(err.message);
    return false;
  }
};

export default sendEmail;
