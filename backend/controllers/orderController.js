import Order from "../models/Order.js";
import User from "../models/User.js";

/**
 * CREATE ORDER (USER)
 * JWT REQUIRED
 */
export const createOrder = async (req, res) => {
  try {
    const {
      consoleType,
      noOfControllers,
      rentalStartDate,
      rentalEndDate,
      hours,
      rentAmount,
      depositAmount,
      deliveryAddress,
    } = req.body;

    if (
      !consoleType ||
      !noOfControllers ||
      !rentalStartDate ||
      !rentalEndDate ||
      !rentAmount ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🔒 BLOCK DUPLICATE ACTIVE ORDERS
    const existingOrder = await Order.findOne({
      user: req.user.userId,
      status: { $nin: ["completed", "cancelled"] },
    });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an ongoing order. Please complete or cancel it before creating a new one.",
      });
    }

    // 🔐 Get user from JWT
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user",
      });
    }

    const order = await Order.create({
      user: user._id,

      // denormalized for admin ease
      customerName: user.name,
      customerPhone: user.phone,

      consoleType,
      noOfControllers,
      rentalStartDate,
      rentalEndDate,
      hours,

      rentAmount,
      depositAmount,

      deliveryAddress,

      paymentStatus: "pending",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

/**
 * GET MY ORDERS (USER)
 * JWT REQUIRED
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL ORDERS (ADMIN)
 * JWT + ADMIN ROLE REQUIRED
 */
export const getAllOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "user",
      "name email phone role"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔒 USER CAN SEE ONLY THEIR ORDER
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "delivered",
      "active",
      "returned",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    // Auto timestamps
    if (status === "returned") {
      order.returnedAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
