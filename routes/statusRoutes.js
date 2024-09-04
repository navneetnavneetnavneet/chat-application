const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { uploadStatus, getAllStatus } = require("../controllers/statusControllers");

// POST /status/upload
router.post("/upload", isAuthenticated, uploadStatus);

// GET /status
router.get("/", isAuthenticated, getAllStatus);

module.exports = router;
