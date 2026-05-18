import { upsertStreamUser } from "../lib/Stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


// ================= SIGNUP =================
export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Avatar
    const randomAvatar = `https://ui-avatars.com/api/?name=${fullName}&background=random`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    // ✅ Stream user
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image:
          newUser.profilePic ||
          `https://ui-avatars.com/api/?name=${newUser.fullName}`,
      });

      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    // ✅ Token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}


// ================= LOGIN =================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Stream user update
    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image:
          user.profilePic ||
          `https://ui-avatars.com/api/?name=${user.fullName}`,
      });

      console.log(`Stream user ready for ${user.fullName}`);
    } catch (error) {
      console.log("Stream error:", error.message);
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ success: true, user });

  } catch (error) {
    console.log("Login error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


// ================= LOGOUT =================
export async function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
}


// ================= ONBOARD =================
export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      profilePic, // ✅ IMPORTANT
    } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        profilePic, // ✅ SAVE IMAGE
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update Stream user
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image:
          updatedUser.profilePic ||
          `https://ui-avatars.com/api/?name=${updatedUser.fullName}`,
      });

      console.log("Stream user updated");
    } catch (error) {
      console.log("Stream onboarding error:", error.message);
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.log("Onboard error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// ================= GET USER =================
export async function getUser(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("Get user error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}