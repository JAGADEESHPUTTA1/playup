import Brevo from "@getbrevo/brevo";

// Initialize Brevo Transactional Email API
const apiInstance = new Brevo.TransactionalEmailsApi();

// Set API key from environment
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendOtpMail = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        name: "Play Up",
        email: "no-reply@playup.com", // works on Brevo free tier
      },
      to: [
        {
          email,
        },
      ],
      subject: "Your Play Up OTP Code",
      htmlContent: `
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
      <div style="background:#1b2240;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;">🎮 Play Up</h1>
        <p style="color:#cfd5ff;font-size:14px;">Console Rental Platform</p>
      </div>

      <div style="padding:24px;text-align:center;">
        <h2 style="color:#1b2240;">Your One-Time Password</h2>

        <div style="
          display:inline-block;
          background:#f1f3ff;
          padding:14px 24px;
          border-radius:6px;
          font-size:26px;
          font-weight:bold;
          letter-spacing:6px;
          color:#29366a;">
          ${otp}
        </div>

        <p style="font-size:13px;color:#777;margin-top:12px;">
          This OTP is valid for <strong>5 minutes</strong>.
        </p>
      </div>

      <div style="background:#f4f6fb;padding:12px;text-align:center;font-size:11px;color:#888;">
        © ${new Date().getFullYear()} Play Up. All rights reserved.
      </div>
    </div>
  </div>
      `,
    });

    console.log("✅ OTP sent via Brevo");
  } catch (error) {
    console.error("❌ Brevo email error:", error?.response?.body || error);
    throw error;
  }
};
