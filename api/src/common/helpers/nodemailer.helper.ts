import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nathanrosxhild@gmail.com",
    pass: "clpe etpu anpd onpo"
  }
})