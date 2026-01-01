import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
  try {
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("🔑 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔥 FORCE AUTH CHECK
    await transporter.verify();
    console.log("✅ Gmail transporter verified");

    const info = await transporter.sendMail({
      from: `"Play Up" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Play Up OTP Code",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    console.log("✅ Mail sent:", info.response);
  } catch (err) {
    console.error("❌ MAIL ERROR FULL:", err);
    throw err; // DO NOT swallow error
  }
};
