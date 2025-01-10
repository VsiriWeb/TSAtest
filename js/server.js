const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // To load environment variables

const app = express();
app.use(bodyParser.json());
app.use(cors());

// POST endpoint to send an email
app.post("/send-email", async (req, res) => {
    const { name, email, datetime, select1, message } = req.body;

    // Basic validation for required fields
    if (!name || !email || !datetime || !select1) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Create a transporter object for sending emails
    const transporter = nodemailer.createTransport({
        service: "gmail", // You can use other services (e.g., Outlook, Yahoo) if required
        auth: {
            user: process.env.EMAIL_USER, // Your email address from environment variables
            pass: process.env.EMAIL_PASS, // Your email password or app password
        },
    });

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email address
        to: email, // Recipient's email address
        subject: "Reservation Confirmation - Restoran",
        text: `Hi ${name},\n\nThank you for reserving a table with us!\n\nHere are your reservation details:\n- Date & Time: ${datetime}\n- Number of People: ${select1}\n- Special Request: ${message}\n\nWe look forward to serving you!\n\nBest Regards,\nRestoran Team`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email. Please try again later." });
    }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable for the port or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
