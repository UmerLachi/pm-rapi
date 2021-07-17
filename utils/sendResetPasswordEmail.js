import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import sendEmail from './sendEmail.js';
import Token from '../models/token.js';
import { getResetPasswordTextBody } from '../config/constants.js';

const sendResetPasswordEmail = async (options) => {
  const __dirname = path.resolve();
  const hash = crypto.randomBytes(60).toString('hex');
  const url = `${process.env.FE_HOST}/reset-password/edit/${hash}`;

  try {
    await Token.create({
      token: hash,
      email: options.email,
      expires: Date.now() + 60 * 60 * 1000, // after 1 hour
    });

    const emailTemplate = await fs.readFile(
      path.join(__dirname, 'email-templates', 'reset-passowrd.html'),
      'utf8'
    );

    const htmlBody = emailTemplate
      .replace('[url]', url)
      .replace('[firstName]', options.firstName);

    await sendEmail({
      from: 'iamumerlachi@gmail.com',
      to: options.email,
      subject: 'Resetting Your Password',
      html: htmlBody,
      text: getResetPasswordTextBody(options.firstName, url),
    });
  } catch (err) {
    console.log(err.message);
  }
};

export default sendResetPasswordEmail;
