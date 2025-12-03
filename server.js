const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Brevo = require("@getbrevo/brevo");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/contact", async (req, res) => {
    const { name, email, company, phone, subject, message } = req.body;

    try {
        const apiInstance = new Brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(
            Brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );

        const sendSmtpEmail = new Brevo.SendSmtpEmail();

        sendSmtpEmail.subject = `New Contact Message: ${subject}`;
        sendSmtpEmail.htmlContent = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong><br>${message}</p>
        `;
        sendSmtpEmail.sender = { 
    name: "REL Group Website",
    email: process.env.OWNER_EMAIL 
};
        sendSmtpEmail.to = [{ email: process.env.OWNER_EMAIL }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        res.json({ message: "Message sent successfully!" });

    } catch (err) {
        console.error("Brevo Error:", err);
        res.status(500).json({ message: "Failed to send message" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
