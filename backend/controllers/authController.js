import User from "../models/User.js";
import Otp from "../models/otp.js";
import { sendOtpMail } from "../utils/sendOtpMail.js";
import { generateToken } from "../utils/jwt.js";

export const sendOtp = async (req, res) => {
  try {
    const { name, email, phone, identifier } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    if (identifier) {
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "No account found. Please signup." });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Account is disabled" });
      }

      user.otp = otp;
      user.otpExpiresAt = expiry;
      await user.save();

      await sendOtpMail(user.email, otp);

      return res.json({ message: "OTP sent to registered email" });
    }

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Name, email and phone are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists. Please login." });
    }

    await Otp.findOneAndUpdate(
      { email },
      { name, email, phone, otp, expiresAt: expiry },
      { upsert: true }
    );

    await sendOtpMail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { identifier, email, otp } = req.body;

    if (identifier) {
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      });

      if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();

      const token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

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

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch {
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

  res.json({ success: true, message: "Logged out successfully" });
};
