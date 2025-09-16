const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bookRoute = require("./routes/booksRoute");
const authorRoute = require("./routes/authorsRoute");

const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const port = process.env.PORT || 8080;
const app = express();

app
  .use(cors())
  .use(express.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  // .get("/", (req, res) => {
  //   res.json({ message: "Welcome to the Book Library API" });
  // })
  .use("/books", bookRoute)
  .use("/authors", authorRoute)

  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
})();
