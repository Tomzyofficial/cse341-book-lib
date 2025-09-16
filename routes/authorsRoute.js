const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const Author = require("../models/Author");

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// GET /authors - Get all authors
router.get("/", validateRequest, async (req, res) => {
  try {
    // Build filter object
    const filter = {};
    if (req.query.fullname) filter.fullname = req.query.fullname;
    if (req.query.country) filter.country = req.query.country;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.birthdate) filter.birthdate = req.query.birthdate;

    const authors = await Author.find(filter);

    res.json(authors).status(200);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({
      error: "Failed to fetch authors",
      message: "An error occurred while retrieving authors",
    });
  }
});

// GET /api/authors/:id - Get a specific author by ID
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid author ID")],
  validateRequest,
  async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);

      if (!author) {
        return res.status(404).json({
          error: "Author not found",
          message: "No author found with the provided ID",
        });
      }

      res.json(author).status(200);
    } catch (error) {
      console.error("Error fetching author:", error);
      res.status(500).json({
        error: "Failed to fetch author",
        message: "An error occurred while retrieving the author",
      });
    }
  }
);

// POST /api/books - Create a new book
router.post(
  "/",
  [
    body("fullname")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Full name is required and must be 1-50 characters"),
    body("country")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Country is required and must be 1-50 characters"),
    body("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Gender must be one of the predefined categories"),
    body("birthdate").notEmpty().withMessage("Birth date is required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      // Check if author already exists
      const existingAuthor = await Author.findOne({
        fullname: req.body.fullname,
      });
      if (existingAuthor) {
        return res.status(409).json({
          error: "Author already exists",
          message: "An author with this name already exists in the library",
        });
      }

      const author = new Author(req.body);
      await author.save();

      res.status(201).json({
        success: true,
        message: "Author created successfully",
        data: author,
      });
    } catch (error) {
      console.error("Error creating author:", error);
      if (error.code === 11000) {
        res.status(409).json({
          error: "Duplicate entry",
          message: "An author with this name already exists",
        });
      } else {
        res.status(500).json({
          error: "Failed to create author",
          message: "An error occurred while creating the author",
        });
      }
    }
  }
);

// PUT /api/authors/:id - Update an author
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid author ID"),
    body("fullname")
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Full name must be 1-50 characters"),
    body("country")
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Country must be 1-50 characters"),
    body("gender")
      .optional()
      .isIn(["Male", "Female", "Other"])
      .withMessage("Invalid gender"),
    body("birthdate").notEmpty().withMessage("Birth date is required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      // Check if name is being updated and if it already exists
      if (req.body.fullname) {
        const existingAuthor = await Author.findOne({
          fullname: req.body.fullname,
          _id: { $ne: req.params.id },
        });
        if (existingAuthor) {
          return res.status(409).json({
            error: "Author already exists",
            message: "An author with this name already exists in the library",
          });
        }
      }

      const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!author) {
        return res.status(404).json({
          error: "Author not found",
          message: "No author found with the provided ID",
        });
      }

      res
        .json({
          success: true,
          message: "Author updated successfully",
          data: author,
        })
        .status(200);
    } catch (error) {
      console.error("Error updating author:", error);
      if (error.code === 11000) {
        res.status(409).json({
          error: "Duplicate entry",
          message: "An author with this name already exists",
        });
      } else {
        res.status(500).json({
          error: "Failed to update author",
          message: "An error occurred while updating the author",
        });
      }
    }
  }
);

// DELETE /api/authors/:id - Delete an author by ID
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid author ID")],
  validateRequest,
  async (req, res) => {
    try {
      const author = await Author.findByIdAndDelete(req.params.id);

      if (!author) {
        return res.status(404).json({
          error: "Author not found",
          message: "No author found with the provided ID",
        });
      }

      res
        .json({
          success: true,
          message: "Author deleted successfully",
        })
        .status(200);
    } catch (error) {
      console.error("Error deleting author:", error);
      res.status(500).json({
        error: "Failed to delete author",
        message: "An error occurred while deleting the author",
      });
    }
  }
);

module.exports = router;
