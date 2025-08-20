import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config() //very important

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    })

    console.log('Email sent:', info.messageId)
  } catch (err) {
    console.error('Error sending email:', err)
  }
}
