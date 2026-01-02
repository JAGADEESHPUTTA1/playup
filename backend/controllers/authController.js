import User from "../models/User.js";
import Otp from "../models/otp.js";
import { sendOtpMail } from "../utils/sendOtpMail.js";
import { generateToken } from "../utils/jwt.js";

export const sendOtp = async (req, res) => {
  try {
    const { name, email, phone, identifier, mode } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    if (mode === "login") {
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Account disabled" });
      }

      user.otp = otp;
      user.otpExpiresAt = expiry;
      await user.save();

      await sendOtpMail(user.email, otp);

      return res.json({ message: "OTP sent" });
    }

    if (mode === "signup") {
      if (!name || !email || !phone) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      await Otp.findOneAndUpdate(
        { email },
        { name, email, phone, otp, expiresAt: expiry },
        { upsert: true }
      );

      await sendOtpMail(email, otp);

      return res.json({ message: "OTP sent" });
    }

    res.status(400).json({ message: "Invalid mode" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { identifier, email, otp, mode } = req.body;

    if (mode === "login") {
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      });

      if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();

      const token = generateToken({ id: user._id });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: "Login successful",
        user,
      });
    }

    if (mode === "signup") {
      const record = await Otp.findOne({ email });

      if (!record || record.otp !== otp || new Date() > record.expiresAt) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      const user = await User.create({
        name: record.name,
        email: record.email,
        phone: record.phone,
        role: "user",
        isActive: true,
      });

      await Otp.deleteOne({ email });

      const token = generateToken({ id: user._id });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: "Signup successful",
        user,
      });
    }

    res.status(400).json({ message: "Invalid mode" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  res.json({ success: true, message: "Logged out" });
};
