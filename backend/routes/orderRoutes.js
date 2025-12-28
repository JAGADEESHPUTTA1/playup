import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrder,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, getAllOrder);
router.get("/:orderId", protect, getOrderById);
router.patch("/:orderId/status", protect, updateOrderStatus);
router;

export default router;
