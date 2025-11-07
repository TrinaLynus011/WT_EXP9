// ===== IMPORTS =====
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// ===== CONFIG =====
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===== USER SCHEMA =====
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ===== ROUTES =====

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully on Vercel!");
});

// Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "Username already exists!" });

    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPass });
    await user.save();
    res.json({ message: "✅ Registration Successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Incorrect password!" });

    res.json({
      message: "🎉 Login Successful! Welcome to your Campaign Tracker!",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// ===== EXPORT FOR VERCEL =====
export default app;
