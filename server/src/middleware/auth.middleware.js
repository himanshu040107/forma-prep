import jwt from "jsonwebtoken";
import config from "../config/config.js";
import BlackList from "../models/blacklist.model.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  const isTokenBlacklisted=await BlackList.findOne({token});
  if(isTokenBlacklisted){
    return res.status(401).json({ message: "Token is Invalid." });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

