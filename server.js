const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bookRoute = require("./routes/booksRoute");
const authorRoute = require("./routes/authorsRoute");
const authRoute = require("./routes/authRoute");
const homeRoute = require("./routes/homeRoute");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const port = process.env.PORT || 8080;
const app = express();

app.set("view engine", "ejs")
   .set("views", path.join(__dirname, "views"))
   .use(
      session({
         secret: process.env.GOOGLE_CLIENT_SECRET || "secret",
         resave: false,
         saveUninitialized: false,
      })
   )
   .use(passport.initialize())
   .use(passport.session())

   .use(cors())
   .use(express.json())
   .use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
   })
   .use("/", homeRoute)
   .use("/auth", authRoute)
   .use("/books", bookRoute)
   .use("/authors", authorRoute)

   .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

   .use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
   });

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
