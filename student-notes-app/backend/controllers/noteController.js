const Note = require("../models/note");

const syncReactionCounts = (note) => {
  note.likes = note.likedBy.length;
  note.dislikes = note.dislikedBy.length;
};

const normalizeReactionArrays = (note) => {
  note.likedBy = Array.isArray(note.likedBy)
    ? note.likedBy.map((id) => id.toString())
    : [];
  note.dislikedBy = Array.isArray(note.dislikedBy)
    ? note.dislikedBy.map((id) => id.toString())
    : [];
};

const normalizeFilepath = (filepath = "", filename = "") => {
  if (!filepath) {
    return filename ? `uploads/${filename}` : "";
  }

  const normalizedPath = filepath.replace(/\\/g, "/");

  if (normalizedPath.startsWith("uploads/")) {
    return normalizedPath;
  }

  const uploadsIndex = normalizedPath.toLowerCase().lastIndexOf("/uploads/");

  if (uploadsIndex !== -1) {
    return normalizedPath.slice(uploadsIndex + 1);
  }

  return filename ? `uploads/${filename}` : normalizedPath;
};

const formatNoteForResponse = (noteDoc) => {
  const note = noteDoc.toObject ? noteDoc.toObject() : noteDoc;

  return {
    ...note,
    filepath: normalizeFilepath(note.filepath, note.filename)
  };
};

const uploadNote = async (req, res) => {
  try {
    const { title, subject, topic } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const note = await Note.create({
      title: title?.trim() || "Untitled",
      subject: subject?.trim() || "General",
      topic: topic?.trim() || "General",
      userId: req.user.userId,
      filename: req.file.filename,
      filepath: `uploads/${req.file.filename}`
    });

    return res.status(201).json({
      message: "Uploaded successfully",
      note
    });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed" });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ uploadedAt: -1 });
    return res.json(notes.map(formatNoteForResponse));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notes" });
  }
};

const getMyUploads = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    return res.json(notes.map(formatNoteForResponse));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch your uploads" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or not owned by you" });
    }

    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

const likeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    const userId = req.user.userId.toString();

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    normalizeReactionArrays(note);

    if (note.likedBy.includes(userId)) {
      note.likedBy = note.likedBy.filter((id) => id !== userId);
    } else {
      note.likedBy.push(userId);
      note.dislikedBy = note.dislikedBy.filter((id) => id !== userId);
    }

    syncReactionCounts(note);
    await note.save();

    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: "Like failed" });
  }
};

const dislikeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    const userId = req.user.userId.toString();

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    normalizeReactionArrays(note);

    if (note.dislikedBy.includes(userId)) {
      note.dislikedBy = note.dislikedBy.filter((id) => id !== userId);
    } else {
      note.dislikedBy.push(userId);
      note.likedBy = note.likedBy.filter((id) => id !== userId);
    }

    syncReactionCounts(note);
    await note.save();

    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: "Dislike failed" });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.comments.push({ text: text.trim() });
    await note.save();

    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: "Comment failed" });
  }
};

module.exports = {
  uploadNote,
  getNotes,
  getMyUploads,
  deleteNote,
  likeNote,
  dislikeNote,
  addComment
};
