const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
    maxlength: [100, "Author name cannot exceed 100 characters"],
  },
  isbn: {
    type: String,
    required: [true, "ISBN is required"],
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$|^[0-9]{13}$/, "ISBN must be 10 or 13 digits"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    trim: true,
    enum: {
      values: ["Mystery", "Fantasy", "Biography", "History", "Self-Help"],
      message: "Genre must be one of the predefined categories",
    },
  },
  publicationYear: {
    type: Number,
    required: [true, "Publication year is required"],
    min: [1000, "Publication year must be after 1000"],
    max: [new Date().getFullYear(), "Publication year cannot be in the future"],
  },
  pages: {
    type: Number,
    required: [true, "Number of pages is required"],
    min: [1, "Book must have at least 1 page"],
    max: [10000, "Book cannot have more than 10,000 pages"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Book", bookSchema);
