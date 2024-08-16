const express = require("express");
const { homepage } = require("../controllers/userControllers");
const router = express.Router();

router.get("/", homepage);

module.exports = router;
