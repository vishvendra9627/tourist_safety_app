// index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { Profile } from "./models/Profile.js";
import {
  createDigitalIdRouter,
  digitalIdSchema,
} from "./DigitalidForm.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ----------------- Middleware -----------------
app.use(cors());
app.use(bodyParser.json());

// ----------------- MongoDB connections -----------------
mongoose
  .connect(process.env.MONGO_URI2)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const digitalIdConnection = mongoose.createConnection(process.env.MONGO_URI2);

digitalIdConnection.on("connected", () => {
  console.log("✅ MongoDB (Digital ID DB) connected");
});
digitalIdConnection.on("error", (err) => {
  console.error("❌ MongoDB (Digital ID DB) error:", err);
});

const DigitalId = digitalIdConnection.model("DigitalId", digitalIdSchema);

// ----------------- User Schema -----------------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ----------------- Authentication Middleware -----------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains userId + email
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ----------------- Rate Limiting Middleware -----------------
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: "Too many requests, please try again after 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// ----------------- Public Routes -----------------
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- Protected Routes -----------------
app.post("/profile", authMiddleware, async (req, res) => {
  const { name, contact, altContact, gender, age } = req.body;
  const email = req.user.email;

  if (age < 18) {
    return res.status(400).json({ error: "Age must be 18 or above" });
  }

  try {
    let profile = await Profile.findOne({ email });
    if (profile) {
      profile.name = name;
      profile.contact = contact;
      profile.altContact = altContact;
      profile.gender = gender;
      profile.age = age;
      await profile.save();
    } else {
      profile = new Profile({
        name,
        email,
        contact,
        altContact,
        gender,
        age,
      });
      await profile.save();
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- Digital ID Route -----------------
const digitalIdRouter = createDigitalIdRouter(DigitalId);
app.use("/api", authMiddleware, digitalIdRouter);

// ----------------- Start Server -----------------
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
