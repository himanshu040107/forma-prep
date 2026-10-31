import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import BlackList from "../models/blacklist.model.js";
import cookie from "cookie-parser";

const authCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 3600000,
};
/**
 * @name registerUser
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email, and password" });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, authCookieOptions);
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      data: { email: newUser.email, username: newUser.username },
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @name loginUser
 * @description Authenticate a user and return a JWT token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "email not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, authCookieOptions);
    res.status(200).json({
      message: "User logged in successfully",
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @name logoutUser
 * @description Logout a user by clearing the JWT token cookie
 * @route GET /api/auth/logout
 * @access Public
 */
export const logoutUser = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(400).json({ message: "No token found" });
  }
  await BlackList.create({ token });
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({ message: "User logged out successfully" });
};

/**
 * @name getMe
 * @description Get the authenticated user's information
 * @route GET /api/auth/get-me
 * @access Private
 */
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User information retrieved successfully", user: {
        id:user._id,
        email:user.email,
        username:user.username,
      } });
  } catch (error) {
    console.error("Error getting user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
