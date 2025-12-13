import Player from "../schemas/player.schema.js";
import User from "../schemas/user.schema.js";
import { JWTSECRETS } from "../secret.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return next(errorHandler(400, "Oops!, All fields are required"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "Oops!, user already exists"));
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    const { password: _, ...safeUser } = user._doc;

    await Player.create({
      userId: user._id,
      fullName: user.fullName,
    });

    const token = await jwt.sign(
      { userId: user._id, role: user.role },
      JWTSECRETS,
      { expiresIn: "7d" }
    );

    return res
      .status(201)
      .cookie("token", token, { httpOnly: true })
      .json({ status: true, message: "Sign up success!", safeUser, token });
  } catch (error) {
    console.log("Signup error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "Oops!, all field are required"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "Oops! Invalid email Or password"));
    }
    const isPasswwordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswwordMatch) {
      return next(errorHandler(400, "Oops! invalid email Or password"));
    }
    const token = await jwt.sign(
      { userId: user._id, role: user.role },
      JWTSECRETS,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user._doc;

    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({ success: true, message: "Signin success", safeUser, token });
  } catch (error) {
    console.error("Sign-in Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getYourTeamDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const playerDetails = await Player.findOne({ userId })
      .populate({
        path: "userId",
        select: "fullName email role",
      })
      .populate({
        path: "teamId",
        select: "name wins draws losses points goalsFor goalsAgainst",
      });

    return res
      .status(200)
      .json({
        success: true,
        message: "team fetched successfully",
        playerDetails,
      });
  } catch (error) {
    console.error("Details fetching error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "You are Logged Out!" });
  } catch (error) {
    next(error);
  }
};
