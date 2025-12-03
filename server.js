const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// POST: Send message
app.post("/api/contact", async (req, res) => {
    const { name, email, company, phone, subject, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.OWNER_EMAIL,      // your gmail
                pass: process.env.APP_PASSWORD      // your generated app password
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.OWNER_EMAIL,
            subject: `New Contact Message: ${subject}`,
            html: `
                <h3>You received a new message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || "Not provided"}</p>
                <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong><br>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Message sent successfully!" });

    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
