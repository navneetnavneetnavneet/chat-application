require("dotenv").config({
  path: "./.env",
});
const express = require("express");
const app = express();
const logger = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/errors");

// db connection
require("./config/db").connectDatabase();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logger
app.use(logger("tiny"));

// routes
app.use("/users", require("./routes/userRoutes"));

// error handling
app.all("*", (req, res, next) => {
  return next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});
app.use(generatedErrors);

// create server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
