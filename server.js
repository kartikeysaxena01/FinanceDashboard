require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const PORT = process.env.PORT || 5000;

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

})
.catch((error) => {
    console.log("DB Error", error);
});