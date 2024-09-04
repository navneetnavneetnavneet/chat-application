const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { uploadStatus } = require("../controllers/statusControllers");

// POST /status/upload
router.post("/upload", isAuthenticated, uploadStatus);

module.exports = router;
