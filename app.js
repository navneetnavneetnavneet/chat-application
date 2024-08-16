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

// logger
app.use(logger("tiny"));

app.get("/", (req, res, next) => {
  res.json("homepage");
});

// error handling
app.all("*", (req, res, next) => {
  return next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});
app.use(generatedErrors);

// create server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
