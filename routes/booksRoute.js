const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const Book = require("../models/Book");

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

// GET /books - Get all books
router.get(
  "/",
  /*   [
    query("genre")
      .optional()
      .isIn(["Mystery", "Fantasy", "Biography", "History", "Self-Help"])
      .withMessage("Invalid genre"),
    query("available")
      .optional()
      .isBoolean()
      .withMessage("Available must be a boolean"),
  ], */
  validateRequest,
  async (req, res) => {
    try {
      // Build filter object
      const filter = {};
      if (req.query.genre) filter.genre = req.query.genre;
      if (req.query.available !== undefined)
        filter.available = req.query.available === "true";

      const books = await Book.find(filter);

      res.json(books).status(200);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({
        error: "Failed to fetch books",
        message: "An error occurred while retrieving books",
      });
    }
  }
);

// GET /api/books/:id - Get a specific book by ID
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid book ID")],
  validateRequest,
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({
          error: "Book not found",
          message: "No book found with the provided ID",
        });
      }

      res.json({
        success: true,
        data: book,
      });
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({
        error: "Failed to fetch book",
        message: "An error occurred while retrieving the book",
      });
    }
  }
);

// POST /api/books - Create a new book
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title is required and must be 1-200 characters"),
    body("author")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Author is required and must be 1-100 characters"),
    body("isbn")
      .trim()
      .matches(/^[0-9]{10}$|^[0-9]{13}$/)
      .withMessage("ISBN must be 10 or 13 digits"),
    body("genre")
      .isIn(["Mystery", "Fantasy", "Biography", "History", "Self-Help"])
      .withMessage("Invalid genre"),
    body("publicationYear")
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage("Publication year must be between 1000 and current year"),
    body("pages")
      .isInt({ min: 1, max: 10000 })
      .withMessage("Pages must be between 1 and 10,000"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),
    body("available")
      .optional()
      .isBoolean()
      .withMessage("Available must be a boolean"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      // Check if ISBN already exists
      const existingBook = await Book.findOne({ isbn: req.body.isbn });
      if (existingBook) {
        return res.status(409).json({
          error: "ISBN already exists",
          message: "A book with this ISBN already exists in the library",
        });
      }

      const book = new Book(req.body);
      await book.save();

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      console.error("Error creating book:", error);
      if (error.code === 11000) {
        res.status(409).json({
          error: "Duplicate entry",
          message: "A book with this ISBN already exists",
        });
      } else {
        res.status(500).json({
          error: "Failed to create book",
          message: "An error occurred while creating the book",
        });
      }
    }
  }
);

// PUT /api/books/:id - Update a book
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid book ID"),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be 1-200 characters"),
    body("author")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Author must be 1-100 characters"),
    body("isbn")
      .optional()
      .trim()
      .matches(/^[0-9]{10}$|^[0-9]{13}$/)
      .withMessage("ISBN must be 10 or 13 digits"),
    body("genre")
      .optional()
      .isIn(["Mystery", "Fantasy", "Biography", "History", "Self-Help"])
      .withMessage("Invalid genre"),
    body("publicationYear")
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage("Publication year must be between 1000 and current year"),
    body("pages")
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage("Pages must be between 1 and 10,000"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),
    body("available")
      .optional()
      .isBoolean()
      .withMessage("Available must be a boolean"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      // Check if ISBN is being updated and if it already exists
      if (req.body.isbn) {
        const existingBook = await Book.findOne({
          isbn: req.body.isbn,
          _id: { $ne: req.params.id },
        });
        if (existingBook) {
          return res.status(409).json({
            error: "ISBN already exists",
            message: "A book with this ISBN already exists in the library",
          });
        }
      }

      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!book) {
        return res.status(404).json({
          error: "Book not found",
          message: "No book found with the provided ID",
        });
      }

      res.json({
        success: true,
        message: "Book updated successfully",
        data: book,
      });
    } catch (error) {
      console.error("Error updating book:", error);
      if (error.code === 11000) {
        res.status(409).json({
          error: "Duplicate entry",
          message: "A book with this ISBN already exists",
        });
      } else {
        res.status(500).json({
          error: "Failed to update book",
          message: "An error occurred while updating the book",
        });
      }
    }
  }
);

// DELETE /api/books/:id - Delete a book
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid book ID")],
  validateRequest,
  async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);

      if (!book) {
        return res.status(404).json({
          error: "Book not found",
          message: "No book found with the provided ID",
        });
      }

      res.json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({
        error: "Failed to delete book",
        message: "An error occurred while deleting the book",
      });
    }
  }
);

module.exports = router;
