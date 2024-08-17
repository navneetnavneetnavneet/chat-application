const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
  sendMessage,
  getMessage,
} = require("../controllers/messageControllers");

// POST /messages/send/:id
router.post("/send/:id", isAuthenticated, sendMessage);

// GET /messages/:id
router.get("/:id", isAuthenticated, getMessage);

module.exports = router;
