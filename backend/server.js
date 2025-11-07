// ===== IMPORTS =====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

// ===== APP CONFIG =====
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== MONGODB CONNECTION =====
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/campaignLoginDB";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// ===== USER SCHEMA =====
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", userSchema);

// ===== ROUTES =====

// Register Route
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Username already exists!" });

    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPass });
    await user.save();
    res.json({ message: "Registration Successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Incorrect password!" });

    res.json({ message: "Login Successful! Welcome to your Campaign Tracker!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
