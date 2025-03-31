import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

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
            to: "mysky.del@outlook.com", // Change this to your email
            subject: subject || "New Contact Form Submission",
            text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message. Try again later." });
    }
}
