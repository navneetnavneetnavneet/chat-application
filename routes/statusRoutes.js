const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
  uploadStatus,
  getAllStatus,
  deleteStatus,
} = require("../controllers/statusControllers");

// POST /status/upload
router.post("/upload", isAuthenticated, uploadStatus);

// GET /status
router.get("/", isAuthenticated, getAllStatus);

// GET /status/delete/:statusId
router.get("/delete/:id", isAuthenticated, deleteStatus);

module.exports = router;
