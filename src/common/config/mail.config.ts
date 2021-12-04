import { MailerOptions } from "@nestjs-modules/mailer";

const mailerconfig: MailerOptions = {
  transport: `smtps://${process.env["MAILER_USER_DOMAIN"]}:${process.env["MAILER_SMTP_PASS"]}@${process.env["MAILER_SMTP_DOMAIN"]}`,
};

export = mailerconfig;