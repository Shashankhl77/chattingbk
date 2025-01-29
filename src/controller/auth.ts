import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user";
import { accesstoken } from "../models/accesstoken";
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

    const userExists = await UserModel.findOne({ username });
    if (userExists) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, password: hashedPassword });
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    const newAccessToken = new accesstoken({
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

    res.status(200).json({ username, accessToken, refreshToken });
  } catch (error) {
    console.error("Error during signup:", error);
    next(error);
  }
}
export async function login(req: Request, res: Response): Promise<void> {
  try {
    console.log("-------------", req.user);
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.password) {
      throw new Error("Password is missing for the user");
    }
    const isMatch = bcrypt.compare(password, user.password);
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
    const newAccessToken = new accesstoken({
      userId: user._id,
      token: accessToken,
    });
    await newAccessToken.save();

    const newRefreshToken = new RefreshToken({
      userId: user._id,
      token: refreshToken,
    });
    await newRefreshToken.save();
    res.status(200).json({ username, accessToken, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function refresh(req: Request, res: Response) {
  const { refreshtoken } = req.body;

  if (!refreshtoken) {
    res.status(401).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const storedToken = await RefreshToken.findOne({ token: refreshtoken });
    if (!storedToken) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    jwt.verify(refreshtoken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
      if (err)
        res.status(403).json({ message: "Invalid or expired refresh token" });
      const newAccessToken = jwt.sign(
        { userId: user.userId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error generating access token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function logout(req: Request, res: Response): Promise<void> {
  const { refreshtoken } = req.body;

  if (!refreshtoken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  try {
    // Find the refresh token in the database
    const tokenDoc = await RefreshToken.findOne({ token: refreshtoken });

    if (!tokenDoc) {
      res.status(403).json({ message: "Invalid or expired refresh token" });
      return;
    }

    // Delete the refresh token from the database to invalidate it
    await RefreshToken.deleteOne({ token: refreshtoken });

    res.status(200).json({ message: "Logout successful" });
    return;
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
