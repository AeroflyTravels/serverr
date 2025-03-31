import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
      // Nodemailer setup
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,  // true for port 465, false for 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${firstName} ${lastName}" <${process.env.EMAIL_USER}>`,
        to: 'your-email@example.com',  // Change this to your preferred email
        subject: subject || 'New Contact Form Submission',
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: 'Message sent successfully!' });
    } catch (error) {
      console.error('Email Error:', error);
      return res.status(500).json({ error: 'Failed to send message. Try again later.' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
