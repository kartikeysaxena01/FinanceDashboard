const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/authRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Swagger here (IMPORTANT)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/test", (req, res) => {
  res.send("API is working");
});
app.use("/auth", authRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

module.exports = app;