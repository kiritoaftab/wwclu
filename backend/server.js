// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// ================================
// MongoDB Connection
// ================================
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/studentdb";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================================
// Schema Definition
// ================================
const registrationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]+$/, // numbers only
    },
    studentId: {
      type: String,
      default: null,
    },
    majorProgram: {
      type: String,
      required: true,
    },
    additionalProgram: {
      type: String,
      default: null,
    },
    semester: {
      type: String,
      required: true,
    },
    expectedGraduationDate: {
      type: String, // stored as dd/mm/yyyy
    },
    totalSemesterHours: {
      type: Number,
      default: 0,
    },
    paymentId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

// ================================
// Routes
// ================================

// Test route
app.get("/", (req, res) => {
  res.send("Student Registration API is running ✅");
});

// Create a new registration
app.post("/api/register", async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      studentId,
      majorProgram,
      additionalProgram,
      semester,
      expectedGraduationDate,
      totalSemesterHours,
      paymentId,
      paymentStatus,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !majorProgram ||
      !semester
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRegistration = new Registration({
      firstName,
      middleName,
      lastName,
      email,
      phone,
      studentId,
      majorProgram,
      additionalProgram,
      semester,
      expectedGraduationDate,
      totalSemesterHours,
      paymentId,
      paymentStatus,
    });

    const savedRegistration = await newRegistration.save();
    res.status(201).json({
      message: "Registration successful",
      data: savedRegistration,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ================================
// Start Server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
