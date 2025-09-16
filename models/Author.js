const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    maxlength: [50, "Full name cannot exceed 50 characters"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
    maxlength: [50, "Country name cannot exceed 50 characters"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["Male", "Female", "Other"],
      message: "Gender must be one of the predefined categories",
    },
  },
  birthdate: {
    type: String,
    required: [true, "Birthdate is required"],
  },
});

module.exports = mongoose.model("Author", authorSchema);
