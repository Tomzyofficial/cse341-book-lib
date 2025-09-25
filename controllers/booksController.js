const Book = require("../models/Book");

// Get all books
const getAllBooks = async (req, res) => {
   try {
      // Fetch all books from the database without any filters
      const books = await Book.find();

      res.status(200).json(books);
   } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({
         error: "Failed to fetch books",
         message: "An error occurred while retrieving books",
      });
   }
};

// Get a specific book by ID
const getSingleBook = async (req, res) => {
   try {
      const book = await Book.findById(req.params.id);

      if (!book) {
         return res.status(404).json({
            error: "book not found",
            message: "No book found with the provided ID",
         });
      }

      res.json(book).status(200);
   } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({
         error: "Failed to fetch book",
         message: "An error occurred while retrieving the book",
      });
   }
};

// POST book - Create a new book
const createBook = async (req, res) => {
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
};

// Update a book by ID
const updateBookById = async (req, res) => {
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
};

// Delete a book by ID
const deleteBookById = async (req, res) => {
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
};

module.exports = {
   getAllBooks,
   getSingleBook,
   createBook,
   updateBookById,
   deleteBookById,
};
