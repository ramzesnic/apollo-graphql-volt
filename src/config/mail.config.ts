export default () => ({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  login: process.env.SMTP_LOGIN,
  password: process.env.SMTP_PASSWORD,
  subject: process.env.MAIL_SUBJECT,
});
