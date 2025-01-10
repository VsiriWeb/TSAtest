const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // To load environment variables

const app = express();
app.use(bodyParser.json());
app.use(cors());

// POST endpoint to handle email
app.post("/send-email", async (req, res) => {
    const { name, email, datetime, select1, message } = req.body;

    // Basic validation
    if (!name || !email || !datetime || !select1) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "gmail", // Using Gmail as the email service
        auth: {
            user: process.env.EMAIL_USER, // Replace with your email
            pass: process.env.EMAIL_PASS, // Replace with your email password or app password
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reservation Confirmation - Restoran",
        text: `Hi ${name},\n\nThank you for reserving a table with us!\n\nReservation Details:\n- Date & Time: ${datetime}\n- Number of People: ${select1}\n- Special Request: ${message}\n\nWe look forward to serving you!\n\nBest regards,\nRestoran Team`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
