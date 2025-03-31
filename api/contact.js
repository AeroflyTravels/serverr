import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export default async (req, res) => {
  // Ensure that this route is handling only POST requests
  if (req.method === 'POST') {
    const { firstName, lastName, email, subject, message } = req.body;

    // Validate inputs
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Missing email configuration in environment variables.");
      }

      // Setup Nodemailer transporter for Gmail or your email provider
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${firstName} ${lastName}" <${process.env.EMAIL_USER}>`,
        to: "mysky.del@outlook.com", // Replace with your email
        subject: subject || "New Contact Form Submission",
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
      console.error("Email Error:", error.message);
      return res.status(500).json({ error: "Failed to send message. Try again later." });
    }
  } else {
    // Handle non-POST requests
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
