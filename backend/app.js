import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

/* ===============================
   CORS (MUST BE FIRST)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://playuprentals.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-side requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===============================
   SECURITY
================================ */
app.use(helmet());

/* ===============================
   RATE LIMITING
================================ */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ===============================
   CORE MIDDLEWARE
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

/* ===============================
   HEALTH CHECK
================================ */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked this request",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
