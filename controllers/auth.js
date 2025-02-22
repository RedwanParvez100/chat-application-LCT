const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password } = req.body;

    db.query(
        "SELECT email FROM users WHERE email = ?",
        [email],
        async (error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render("register", {
                    message: "That email is already in use",
                });
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            db.query(
                "INSERT INTO users SET ?",
                {
                    name: name,
                    email: email,
                    password: hashedPassword,
                },
                (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.render("register", {
                            message: "User registered",
                        });
                    }
                }
            );
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    console.log("Login request received with email:", email);

    if (!email || !password) {
        console.log("Missing email or password");
        return res.render("login", {
            message: "Please enter email and password",
        });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (error, results) => {
            if (error) {
                console.error("Database Query Error:", error);
                return res.render("login", { message: "Database error" });
            }

            console.log("Database query results:", results);

            if (results.length === 0) {
                console.log("User not found");
                return res.render("login", {
                    message: "Incorrect email or password",
                });
            }

            const user = results[0];
            console.log("User found in database:", user);

            // Compare hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match:", isMatch);

            if (!isMatch) {
                console.log("Incorrect password");
                return res.render("login", {
                    message: "Incorrect email or password",
                });
            }

            console.log("Login successful for:", user.email);

            // Send response
            return res.redirect("/dashboard");
        }
    );
};
