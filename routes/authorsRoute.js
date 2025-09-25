const express = require("express");
const router = express.Router();

const { param, body, validationResult } = require("express-validator");

const authorsController = require("../controllers/authorsController");

// Validation middleware
const validateRequest = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({
         error: "Validation failed",
         details: errors.array(),
      });
   }
   next();
};

// Get all authors
router.get("/", authorsController.getAllAuthors);

// Get an author by ID
router.get("/:id", [param("id").isMongoId().withMessage("Invalid author ID")], validateRequest, authorsController.getSingleAuthor);

// POST - create a new author
router.post(
   "/",
   [
      body("fullname").trim().isLength({ min: 1, max: 50 }).withMessage("Full name is required and must be 1-50 characters"),
      body("country").trim().isLength({ min: 1, max: 50 }).withMessage("Country is required and must be 1-50 characters"),
      body("gender").isIn(["Male", "Female", "Other"]).withMessage("Gender must be one of the predefined categories"),
      body("birthdate").notEmpty().withMessage("Birth date is required"),
   ],
   validateRequest,
   authorsController.createAuthor
);

// Put - update a book by ID
router.put(
   "/:id",
   [
      param("id").isMongoId().withMessage("Invalid author ID"),
      body("fullname").optional().trim().isLength({ min: 1, max: 50 }).withMessage("Full name must be 1-50 characters"),
      body("country").optional().trim().isLength({ min: 1, max: 50 }).withMessage("Country must be 1-50 characters"),
      body("gender").optional().isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),
      body("birthdate").notEmpty().withMessage("Birth date is required"),
   ],
   validateRequest,
   authorsController.updateAuthorById
);

router.delete("/:id", [param("id").isMongoId().withMessage("Invalid author ID")], validateRequest, authorsController.deleteAuthorById);

module.exports = router;
