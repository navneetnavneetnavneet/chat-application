require("dotenv").config({
  path: "./.env",
});
const express = require("express");
// const app = express();
const {app, server} = require("./socket/socket");
const logger = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/errors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressFileupload = require("express-fileupload");

// db connection
require("./config/db").connectDatabase();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// session and cookie-parser
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(cookieParser());

// express-fileupload
app.use(expressFileupload());

// logger
app.use(logger("tiny"));

// routes
app.use("/users", require("./routes/userRoutes"));
app.use("/messages", require("./routes/messageRoutes"));

// error handling
app.all("*", (req, res, next) => {
  return next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});
app.use(generatedErrors);

// create server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
