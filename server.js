require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models/db");
const authRoutes = require("./routes/auth");
const alumniRoutes = require("./routes/alumni");

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/alumni", alumniRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
