const express = require("express");
const {
  homepage,
  currentUser,
  signupUser,
  signinUser,
  signoutUser,
  editUserProfile,
} = require("../controllers/userControllers");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// GET /users
router.get("/", isAuthenticated, homepage);

// GET /users/currentuser
router.get("/currentuser", isAuthenticated, currentUser);

// POST /users/signup
router.post("/signup", signupUser);

// POST /users/signin
router.post("/signin", signinUser);

// GET /users/signout
router.get("/signout", isAuthenticated, signoutUser);

// POST /users/edit
router.post("/edit", isAuthenticated, editUserProfile);

module.exports = router;
