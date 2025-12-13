import express from "express";
const UserRoute = express.Router();
import User from "../modules/UserModule.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticat from "../middleware/Authentication.js";
import upload from "../config/Upload.js";
import connectCloudinary from "../config/Cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

connectCloudinary();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.secret_key);
};

// create signup api
UserRoute.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    const token = createToken(newUser._id);

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token: token,
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// login user api

UserRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }
    const loginuser = await User.findOne({ email: email });
    if (!loginuser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const comparePassword = await bcrypt.compare(password, loginuser.password);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Password' });
    }

    const token = createToken(loginuser._id);

    res.status(200).json({
      user: {
        _id: loginuser._id,
        name: loginuser.name,
        email: loginuser.email,
        image: loginuser.image || '',
      },
      token,
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

UserRoute.put(
  "/update-pro-pic",
  authenticat,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No image provided" });

      // upload to cloudinary
      const filePath = req.file.path;
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "car-website/profile-pics",
        use_filename: true,
        unique_filename: false,
        resource_type: "image",
      });

      // update user
      req.user.image = result.secure_url;
      await req.user.save();

      // remove local file
      fs.unlink(filePath, (err) => {
        if (err) console.warn("Failed to remove temp file", err);
      });

      res.json({ success: true, image: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default UserRoute;
