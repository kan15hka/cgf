const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Alumni } = require("../models/db");
const { Verification } = require("../models/db");
// const sendVerificationEmail = require("../utils/emailService");

const router = express.Router();

router.post("/register", async (req, res) => {
  const {
    email,
    password,
    fullName,
    gender,
    contactNumber,
    postalAddress,
    yearOfGraduation,
    departmentAndSpecialization,
    branch,
    currentJobTitle,
    companyName,
    industrySector,
    linkedInProfileUrl,
    topicsOfInterest,
    preferredModeOfSession,
    participateInFutureSessions,
  } = req.body;

  try {
    const existingUser = await Alumni.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Alumni.create({
      email,
      password: hashedPassword,
      fullName,
      gender,
      contactNumber,
      postalAddress,
      yearOfGraduation,
      departmentAndSpecialization,
      branch,
      currentJobTitle,
      companyName,
      industrySector,
      linkedInProfileUrl,
      topicsOfInterest,
      preferredModeOfSession,
      participateInFutureSessions,
    });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    console.log(verificationToken)
    await Verification.create({
      userId: newUser.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "User registered. Please check your email for verification.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Alumni.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const verification = await Verification.findOne({ where: { token } });
    if (!verification) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    if (verification.expiresAt < new Date()) {
      await verification.destroy();
      return res
        .status(400)
        .json({ message: "Verification token has expired" });
    }

    await Alumni.update(
      { isVerified: true },
      { where: { id: verification.userId } }
    );
    await verification.destroy();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
