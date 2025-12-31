import express from "express";
import {
  getAllOrder,
  updateOrderStatus,
  adminStats,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ADMIN ROUTES
router.get("/orders", protect, getAllOrder);
router.get("/orders/:orderId", protect, getOrderById);
router.patch("/orders/:orderId/status", protect, updateOrderStatus);
router.get("/stats", protect, adminStats);

export default router;
