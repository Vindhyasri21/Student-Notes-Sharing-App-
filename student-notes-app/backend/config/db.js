const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://vindhyasrienamala_db_user:Vindhyasri27@cluster0.fm9ecq7.mongodb.net/notesDB?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB Connected");
};

module.exports = connectDB;
