import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

/* -------- Security Headers -------- */
app.use(helmet());

/* -------- Rate Limiting (GLOBAL) -------- */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later",
  })
);

/* -------- Core Middlewares -------- */
app.use(express.json());
app.use(cookieParser());

/* -------- CORS (CRITICAL) -------- */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://playuprentals.vercel.app"],
    credentials: true,
  })
);

/* -------- Routes -------- */
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

/* -------- Global Error Handler -------- */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
