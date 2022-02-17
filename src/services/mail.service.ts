import { AppConfiguration } from '../config';
import { Service } from 'typedi';
import * as nodemailer from 'nodemailer';

@Service()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: AppConfiguration) {
    const { mailConfig } = config;
    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: true,
      auth: {
        user: mailConfig.login,
        pass: mailConfig.password,
      },
    });
  }

  send(to: string, body: string): any {
    const { mailConfig } = this.config;
    const mailOptions = {
      from: mailConfig.login,
      to,
      subject: mailConfig.subject,
      text: body,
    };

    return this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error.message;
      }
      return `Email send ${info.response}`;
    });
  }
}
