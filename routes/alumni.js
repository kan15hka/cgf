const express = require("express");
const { Alumni } = require("../models/db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const alumni = await Alumni.findAll();
    res.json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/get-profile", auth, async (req, res) => {
  const userId=req.user;
  try {
    const alumni = await Alumni.findByPk(userId);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }
    res.json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update-profile", auth, async (req, res) => {
  const userId = req.user;
  // console.log(userId,"hihihihihi")
  const {
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
    // console.log(Alumni)
    const updated = await Alumni.update(
      {
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
      },
      {
        where: { id: userId },
      }
    );

    if (updated) {
      const updatedUser = await Alumni.findOne({ where: { id: userId } });
      return res.status(200).json(updatedUser);
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Alumni.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.json({ message: "Alumni deleted" });
    }
    else{
      return res.json({message:"Alumni not found"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
