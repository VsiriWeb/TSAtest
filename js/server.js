const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/send-email", async (req, res) => {
    const { name, email, datetime, select1, message } = req.body;

    if (!name || !email || !datetime || !select1) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reservation Confirmation",
        text: `Hi ${name},\n\nThank you for reserving a table with us!\n\nReservation Details:\n- Date & Time: ${datetime}\n- Guests: ${select1}\n- Special Request: ${message || "None"}\n\nBest regards,\nRestoran Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: `Failed to send email: ${error.message}` });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
