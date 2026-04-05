const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

module.exports = app;