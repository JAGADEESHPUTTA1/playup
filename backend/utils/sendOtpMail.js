import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail APP PASSWORD
      },
      connectionTimeout: 10_000, // prevent hanging on Render
    });

    // 🔍 Verify SMTP connection (fails fast if blocked)
    await transporter.verify();
    console.log("✅ Gmail SMTP verified");

    await transporter.sendMail({
      from: `"Play Up" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Play Up OTP Code",
      html: `
  <div style="
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f4f6fb;
    padding: 24px;
  ">
    <div style="
      max-width: 480px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    ">
      
      <!-- Header -->
      <div style="
        background-color: #1b2240;
        padding: 20px;
        text-align: center;
      ">
        <h1 style="
          color: #ffffff;
          margin: 0;
          font-size: 22px;
          letter-spacing: 1px;
        ">
          🎮 Play Up
        </h1>
        <p style="
          color: #cfd5ff;
          margin: 6px 0 0;
          font-size: 14px;
        ">
          Console Rental Platform
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 24px; text-align: center;">
        <h2 style="
          color: #1b2240;
          margin-bottom: 12px;
          font-size: 20px;
        ">
          Your One-Time Password
        </h2>

        <p style="
          color: #555;
          font-size: 14px;
          margin-bottom: 20px;
        ">
          Use the OTP below to verify your account on <strong>Play Up</strong>.
        </p>

        <!-- OTP Box -->
        <div style="
          display: inline-block;
          background-color: #f1f3ff;
          padding: 14px 24px;
          border-radius: 6px;
          font-size: 26px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #29366a;
          margin-bottom: 16px;
        ">
          ${otp}
        </div>

        <p style="
          color: #777;
          font-size: 13px;
          margin-top: 12px;
        ">
          This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <p style="
          color: #999;
          font-size: 12px;
          margin-top: 20px;
        ">
          If you did not request this OTP, please ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background-color: #f4f6fb;
        padding: 12px;
        text-align: center;
        font-size: 11px;
        color: #888;
      ">
        © ${new Date().getFullYear()} Play Up. All rights reserved.
      </div>

    </div>
  </div>
      `,
    });

    console.log("✅ OTP email sent successfully");
  } catch (error) {
    console.error("❌ OTP MAIL ERROR:", error);
    throw error; // let controller handle response
  }
};
