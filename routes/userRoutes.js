const express = require("express");
const { homepage, signupUser, signinUser } = require("../controllers/userControllers");
const router = express.Router();

// GET /
router.get("/", homepage);

// POST /users/signup
router.post("/signup", signupUser);

// POST /users/signin
router.post("/signin", signinUser);

module.exports = router;
