const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const bookController = require("../controllers/booksController");

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
router.get("/", bookController.getAllBooks);

// GET /api/books/:id - Get a specific book by ID
router.get(
   "/:id",

   [param("id").isMongoId().withMessage("Invalid book ID")],
   validateRequest,
   bookController.getSingleBook
);

// POST - Create a new book
router.post(
   "/",
   [
      body("title").trim().isLength({ min: 1, max: 200 }).withMessage("Title is required and must be 1-200 characters"),
      body("author").trim().isLength({ min: 1, max: 100 }).withMessage("Author is required and must be 1-100 characters"),
      body("isbn")
         .trim()
         .matches(/^[0-9]{10}$|^[0-9]{13}$/)
         .withMessage("ISBN must be 10 or 13 digits"),
      body("genre").isIn(["Mystery", "Fantasy", "Biography", "History", "Self-Help"]).withMessage("Invalid genre"),
      body("publicationYear")
         .isInt({ min: 1000, max: new Date().getFullYear() })
         .withMessage("Publication year must be between 1000 and current year"),
      body("pages").isInt({ min: 1, max: 10000 }).withMessage("Pages must be between 1 and 10,000"),
      body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
      body("available").optional().isBoolean().withMessage("Available must be a boolean"),
   ],
   validateRequest,
   bookController.createBook
);

// PUT /api/books/:id - Update a book
router.put(
   "/:id",
   [
      param("id").isMongoId().withMessage("Invalid book ID"),
      body("title").optional().trim().isLength({ min: 1, max: 200 }).withMessage("Title must be 1-200 characters"),
      body("author").optional().trim().isLength({ min: 1, max: 100 }).withMessage("Author must be 1-100 characters"),
      body("isbn")
         .optional()
         .trim()
         .matches(/^[0-9]{10}$|^[0-9]{13}$/)
         .withMessage("ISBN must be 10 or 13 digits"),
      body("genre").optional().isIn(["Mystery", "Fantasy", "Biography", "History", "Self-Help"]).withMessage("Invalid genre"),
      body("publicationYear")
         .optional()
         .isInt({ min: 1000, max: new Date().getFullYear() })
         .withMessage("Publication year must be between 1000 and current year"),
      body("pages").optional().isInt({ min: 1, max: 10000 }).withMessage("Pages must be between 1 and 10,000"),
      body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
      body("available").optional().isBoolean().withMessage("Available must be a boolean"),
   ],
   validateRequest,
   bookController.updateBookById
);

// DELETE - Delete a book
router.delete("/:id", [param("id").isMongoId().withMessage("Invalid book ID")], validateRequest, bookController.deleteBookById);

module.exports = router;
