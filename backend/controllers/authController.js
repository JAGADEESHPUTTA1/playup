import User from "../models/User.js";
import Otp from "../models/otp.js";
import { sendOtpMail } from "../utils/sendOtpMail.js";
import { generateToken } from "../utils/jwt.js";

/* =========================
   SEND OTP
========================= */
export const sendOtp = async (req, res) => {
  try {
    const { name, email, phone, identifier } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    /* ---------- LOGIN FLOW ---------- */
    if (identifier) {
      const cleanIdentifier = identifier.trim().toLowerCase();

      const user = await User.findOne({
        $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No account found. Please signup.",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account is disabled",
        });
      }

      user.otp = otp;
      user.otpExpiresAt = expiry;
      await user.save();

      await sendOtpMail(user.email, otp);

      return res.json({
        success: true,
        message: "OTP sent to registered email",
      });
    }

    /* ---------- SIGNUP FLOW ---------- */
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      {
        name,
        email: cleanEmail,
        phone: cleanPhone,
        otp,
        expiresAt: expiry,
      },
      { upsert: true }
    );

    await sendOtpMail(cleanEmail, otp);

    res.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

/* =========================
   VERIFY OTP
========================= */
export const verifyOtp = async (req, res) => {
  try {
    const { identifier, email, otp } = req.body;

    /* ---------- LOGIN VERIFY ---------- */
    if (identifier) {
      const cleanIdentifier = identifier.trim().toLowerCase();

      const user = await User.findOne({
        $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }],
      });

      if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP",
        });
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
        success: true,
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

    /* ---------- SIGNUP VERIFY ---------- */
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = await Otp.findOne({ email: cleanEmail });

    if (!record || record.otp !== otp || new Date() > record.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.create({
      name: record.name,
      email: cleanEmail,
      phone: record.phone,
      role: "user",
      isActive: true,
    });

    await Otp.deleteOne({ email: cleanEmail });

    const token = generateToken({ id: user._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

/* =========================
   LOGOUT
========================= */
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
