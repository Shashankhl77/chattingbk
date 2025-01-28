import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import AccessToken from "../models/accesstoken";
import RefreshToken from "../models/refreshtoken";

const ACCESS_TOKEN_SECRET = "your_access_token_secret";
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    const newAccessToken = new AccessToken({
      userId: user._id,
      token: accessToken,
    });
    await newAccessToken.save();

    const newRefreshToken = new RefreshToken({
      userId: user._id,
      token: refreshToken,
    });
    await newRefreshToken.save();

    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error during signup:", error);
    next(error);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    const newAccessToken = new AccessToken({
      userId: user._id,
      token: accessToken,
    });
    await newAccessToken.save();

    const newRefreshToken = new RefreshToken({
      userId: user._id,
      token: refreshToken,
    });
    await newRefreshToken.save();
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
