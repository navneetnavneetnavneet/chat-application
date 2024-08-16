const express = require("express");
const { homepage, signupUser } = require("../controllers/userControllers");
const router = express.Router();

// GET /
router.get("/", homepage);

// POST /users/signup
router.post("/signup", signupUser);

module.exports = router;
