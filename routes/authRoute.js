const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.buildLoginView);

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/auth/login" }), (req, res) => {
   // Successful authentication
   //  res.json({ message: "Authentication successful", user: req.user });
   res.redirect("/auth/dashboard");
});

router.get("/dashboard", authController.buildDashboardView);

router.get("/management", authController.buildManagementView);

router.get("/logout", authController.logout);

module.exports = router;
