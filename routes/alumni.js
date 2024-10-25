const express = require("express");
const { Alumni } = require("../models/alumni");
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

router.get("/:id", auth, async (req, res) => {
  try {
    const alumni = await Alumni.findByPk(req.params.id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }
    res.json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const [updated] = await Alumni.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedAlumni = await Alumni.findByPk(req.params.id);
      return res.json(updatedAlumni);
    }
    throw new Error("Alumni not found");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
    throw new Error("Alumni not found");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
