/* eslint-disable @typescript-eslint/no-explicit-any */
import { transporter } from './mailConfig';
import type { SendMailOptions } from 'nodemailer';

// Interface for additional mail options like template and context
interface MailOptions extends SendMailOptions {
  template: string;
  context: any;
}

interface IMailContext {
  subject: string;
  data: any;
}

const sendEmail = async (
  receiverEmail: Array<string>,
  context: IMailContext,
  template: string
): Promise<boolean> => {
  try {
    const mailOptions: MailOptions = {
      from: '"Email Verification"',
      to: receiverEmail,
      subject: context.subject,
      template: template, // 'template' property is added here
      context: context.data, // 'context' property is added here
    };

    const reports = await transporter.sendMail(mailOptions);
    console.log(reports);
    return true;
  } catch (err) {
    console.log(err);
    console.log('EMAIL SEND FAILED');
    return false;
  }
};

export default sendEmail;
