const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  subject: String,
  topic: String,
  filename: String,
  filepath: String,
  userId: String,

  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: {
    type: [String],
    default: []
  },
  dislikedBy: {
    type: [String],
    default: []
  },

  comments: [
    {
      text: String,
      date: { type: Date, default: Date.now }
    }
  ],

  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Note", noteSchema);
