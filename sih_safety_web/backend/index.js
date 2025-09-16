
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Profile } from "./models/Profile.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ----------------- MongoDB connection -----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ----------------- Firebase Admin setup -----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build an absolute path to the service account file
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ----------------- SIGNUP -----------------
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      token: customToken,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- LOGIN -----------------
app.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(user.uid);
    res.status(200).json({ token: customToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- GOOGLE LOGIN -----------------
app.post("/google-login", async (req, res) => {
  const { credential } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(credential);
    const customToken = await admin.auth().createCustomToken(decodedToken.uid);
    res.status(200).json({ token: customToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- Create / Update Profile -----------------
app.post("/profile", async (req, res) => {
  const { name, email, contact, altContact, gender, age } = req.body;

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

// ----------------- Send Email OTP -----------------
app.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    let profile = await Profile.findOne({ email });
    if (!profile) profile = new Profile({ email });
    profile.otpEmail = otp;
    await profile.save();

    // For testing only: return OTP in response
    res.status(200).json({ message: "OTP generated for email", otp });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- Verify Email OTP -----------------
app.post("/verify-email-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const profile = await Profile.findOne({ email });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    if (profile.otpEmail === otp) {
      profile.emailVerified = true;
      profile.otpEmail = null;
      await profile.save();
      return res.status(200).json({ message: "Email verified successfully" });
    }
    res.status(400).json({ error: "Invalid OTP" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- Send Contact OTP -----------------
app.post("/send-contact-otp", async (req, res) => {
  const { contact } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    let profile = await Profile.findOne({ contact });
    if (!profile) profile = new Profile({ contact });
    profile.otpContact = otp;
    await profile.save();

    // For testing only: return OTP in response
    res.status(200).json({ message: "OTP generated for contact", otp });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- Verify Contact OTP -----------------
app.post("/verify-contact-otp", async (req, res) => {
  const { contact, otp } = req.body;
  try {
    const profile = await Profile.findOne({ contact });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    if (profile.otpContact === otp) {
      profile.contactVerified = true;
      profile.otpContact = null;
      await profile.save();
      return res.status(200).json({ message: "Contact verified successfully" });
    }
    res.status(400).json({ error: "Invalid OTP" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);


