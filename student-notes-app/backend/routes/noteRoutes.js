const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  uploadNote,
  getNotes,
  getMyUploads,
  deleteNote,
  likeNote,
  dislikeNote,
  addComment
} = require("../controllers/noteController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.get("/notes", verifyToken, getNotes);
router.get("/my-uploads", verifyToken, getMyUploads);
router.post("/upload", verifyToken, upload.single("file"), uploadNote);
router.delete("/notes/:id", verifyToken, deleteNote);
router.post("/like/:id", verifyToken, likeNote);
router.post("/dislike/:id", verifyToken, dislikeNote);
router.post("/comment/:id", verifyToken, addComment);

module.exports = router;
