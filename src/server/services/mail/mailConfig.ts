import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import handlebarOptions from "./viewEngine";

// Explicitly type the SMTP transport options
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT), // Ensure port is a number
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as SMTPTransport.Options); // Explicitly cast the object as SMTP transport options

// Set the handlebars template engine
transporter.use("compile", hbs(handlebarOptions));
