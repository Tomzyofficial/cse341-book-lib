const Author = require("../models/Author");

// Get all authors
const getAllAuthors = async (req, res) => {
   try {
      // Fetch all authors from the database without any filters
      const authors = await Author.find();

      res.status(200).json(authors);
   } catch (error) {
      console.error("Error fetching authors (Mongoose):", error);
      res.status(500).json({
         error: "Failed to fetch authors",
         message: "An error occurred while retrieving authors",
      });
   }
};

// Get a specific author by ID
const getSingleAuthor = async (req, res) => {
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
};

// POST book - Create a new book
const createAuthor = async (req, res) => {
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
};

// Update an author by ID
const updateAuthorById = async (req, res) => {
   try {
      // Check if name being updated already exists
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

      //  Check for truthy
      if (!author) {
         return res.status(404).json({
            error: "Author not found",
            message: "No author found with the provided ID",
         });
      }

      //   Update the record
      res.json({
         success: true,
         message: "Author updated successfully",
         data: author,
      }).status(200);
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
};

// Delete an author by ID
const deleteAuthorById = async (req, res) => {
   try {
      const author = await Author.findByIdAndDelete(req.params.id);

      if (!author) {
         return res.status(404).json({
            error: "Author not found",
            message: "No author found with the provided ID",
         });
      }

      res.json({
         success: true,
         message: "Author deleted successfully",
      }).status(200);
   } catch (error) {
      console.error("Error deleting author:", error);
      res.status(500).json({
         error: "Failed to delete author",
         message: "An error occurred while deleting the author",
      });
   }
};

module.exports = {
   getAllAuthors,
   getSingleAuthor,
   createAuthor,
   updateAuthorById,
   deleteAuthorById,
};
