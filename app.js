require("dotenv").config({
  path: "./.env",
});
const express = require("express");
const app = express();
const logger = require("morgan");

// db connection
require("./config/db").connectDatabase();

// logger
app.use(logger("tiny"));

app.get("/", (req, res, next) => {
    res.json("homepage");
})

// create server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
