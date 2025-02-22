const express = require("express");
const mysql = require("mysql");

const router = express.Router();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

router.post("/sendMessage", (req, res) => {
    let { message } = req.body;

    // Ensure message is provided
    if (!message) {
        return res.status(400).send("Message is required.");
    }
    const sender_id = 1;
    const receiver_id = 1;
    // Insert message into the database
    db.query(
        "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
        [sender_id, receiver_id, message],
        (error, results) => {
            if (error) {
                console.error("Error saving message:", error);
                return res.status(500).send("Error saving message");
            }

            // Redirect to chat page after successfully inserting message
            res.redirect(
                `/chat/messages?senderId=${sender_id}&receiverId=${receiver_id}`
            );
        }
    );
});

module.exports = router;
