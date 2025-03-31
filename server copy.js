import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON requests

// Contact Form API Endpoint
app.post("/api/contact", async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
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
            from: `"${firstName} ${lastName}" <${email}>`,
            to: "mysky.del@outlook.com", // Change this to your preferred email
            subject: subject || "New Contact Form Submission",
            text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send message. Try again later." });
    }
});

// Start Server Locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
