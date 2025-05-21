import { userModel } from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, password, role } = req.body;

    if (!username || !password || typeof password !== "string") {
      return res.status(400).json({
        status: false,
        message: "All fields are required and password must be a string...",
      });
    }

    const alreadyUser = await userModel.findOne({ username });
    if (alreadyUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exist, please login" });
    }

    const passwordString = String(password);
    const hashedPassword = await bcrypt.hash(passwordString, 10);

    const newUser = new userModel({
      fullname,
      username,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    return res.status(200).json({
      status: true,
      message: "Registered successfull...",
      data: {
        fullname: newUser?.fullname,
        username: newUser?.username,
        role: newUser?.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.MY_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      status: true,
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
