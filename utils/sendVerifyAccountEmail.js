import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import sendEmail from './sendEmail.js';
import Token from '../models/token.js';
import { getConfirmEmailTextBody } from '../config/constants.js';

const sendVerifyAccountEmail = async (options) => {
  const __dirname = path.resolve();
  const hash = crypto.randomBytes(60).toString('hex');
  const confirmUrl = `${process.env.FE_HOST}/confirm-email?hash=${hash}`;

  try {
    await Token.create({
      token: hash,
      email: options.email,
      expires: Date.now() + 60 * 60 * 1000, // after 1 hour
    });

    const emailTemplate = await fs.readFile(
      path.join(__dirname, 'email-templates', 'confirm-email.html'),
      'utf8'
    );

    const htmlBody = emailTemplate
      .replace('[url]', confirmUrl)
      .replace('[firstName]', options.firstName);

    await sendEmail({
      from: 'iamumerlachi@gmail.com',
      to: options.email,
      subject: 'Please Verify Your Email Address',
      html: htmlBody,
      text: getConfirmEmailTextBody(options.firstName, confirmUrl),
    });
  } catch (err) {
    console.log(err.message);
  }
};

export default sendVerifyAccountEmail;
