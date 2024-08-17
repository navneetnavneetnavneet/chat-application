const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { sendMessage } = require("../controllers/messageControllers");

// POST /messages/send/:id
router.post("/send/:id", isAuthenticated, sendMessage);

module.exports = router;
