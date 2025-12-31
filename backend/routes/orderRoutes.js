import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderDetails,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// USER ROUTES
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:orderId", protect, getOrderById);
router.patch("/:orderId/edit", protect, updateOrderDetails);

export default router;
