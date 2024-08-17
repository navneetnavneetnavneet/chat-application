const express = require("express");
const {
  homepage,
  currentUser,
  signupUser,
  signinUser,
  signoutUser,
} = require("../controllers/userControllers");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// GET /users
router.get("/", isAuthenticated, homepage);

// POST /users/currentuser
router.post("/currentuser", isAuthenticated, currentUser);

// POST /users/signup
router.post("/signup", signupUser);

// POST /users/signin
router.post("/signin", signinUser);

// GET /users/signout
router.get("/signout", isAuthenticated, signoutUser);

module.exports = router;
