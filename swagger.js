const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Book API",
    description: "This is Book API",
  },
  host: "localhost:8080",
};

const outputFile = "./swagger.json";
const routes = ["./routes/booksRoute.js", "./routes/authorsRoute.js"];

swaggerAutogen(outputFile, routes, doc);
