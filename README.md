# Book Library API

A RESTful API for managing a book library, built with Node.js, Express, and MongoDB. This API allows you to manage books and authors, supporting CRUD operations, filtering, and validation. It also includes Swagger documentation for easy API exploration.

**This is just a school project**

## Features

- **Books Management**: Create, read, update, and delete books.
- **Authors Management**: Create, read, update, and delete authors.
- **Validation**: Robust input validation using `express-validator`.
- **MongoDB Integration**: Uses Mongoose for schema modeling and database operations.
- **Swagger Documentation**: Interactive API docs available at `/api-docs`.
- **CORS Support**: Cross-origin requests enabled.
- **Environment Variables**: Configuration via `.env` file.

## Project Structure

```
.
├── models/
│   ├── Author.js         # Mongoose schema for authors
│   └── Book.js           # Mongoose schema for books
├── routes/
│   ├── authorsRoute.js   # Express routes for authors
│   └── booksRoute.js     # Express routes for books
├── sample-authors.json   # Sample data for authors
├── sample-books.json     # Sample data for books
├── server.js             # Main server entry point
├── swagger.js            # Swagger autogen script
├── swagger.json          # Generated Swagger documentation
├── .env                  # Environment variables (not committed)
├── .gitignore            # Git ignore file
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Tomzyofficial/cse341-book-lib
   cd cse341-book-lib
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**

   - Create a `.env` file in the root directory:

4. **Run the server:**
   ```sh
   npm run dev
   ```
   The server will start on `http://localhost:8080`.

### API Documentation

- **Swagger UI:**  
  Visit [http://localhost:8080/api-docs](http://localhost:8080/api-docs) for interactive API documentation.

- **Regenerate Swagger docs:**
  ```sh
  npm run swagger
  ```

## Example Endpoints

### Authors

- `GET /authors` — List all authors (supports filtering by `fullname`, `country`, `gender`, `birthdate`)
- `POST /authors` — Create a new author
- `GET /authors/:id` — Get author by ID
- `PUT /authors/:id` — Update author by ID
- `DELETE /authors/:id` — Delete author by ID

### Books

- `GET /books` — List all books (supports filtering by `genre`, `available`)
- `POST /books` — Create a new book
- `GET /books/:id` — Get book by ID
- `PUT /books/:id` — Update book by ID
- `DELETE /books/:id` — Delete book by ID

## Sample Data

- `sample-authors.json` and `sample-books.json` provide example data for testing.

## License

ISC © [Chukwuebuka Ibeh](https://github.com/Tomzyofficial)

---

**Happy reading!**
