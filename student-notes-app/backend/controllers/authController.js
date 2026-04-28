const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "student-notes-secret";
const JWT_EXPIRES_IN = "1d";

const buildAuthPayload = (user) => ({
  token: jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  }),
  user: {
    userId: user._id,
    name: user.name,
    email: user.email
  }
});

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hash
    });

    return res.status(201).json({
      message: "User registered successfully",
      ...buildAuthPayload(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.json({
      message: "Login successful",
      ...buildAuthPayload(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

module.exports = {
  signup,
  login,
  JWT_SECRET
};
