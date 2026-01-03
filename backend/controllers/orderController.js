import Order from "../models/Order.js";
import User from "../models/User.js";
import { calculateBookingPrice } from "../utils/priceCalculator.js";

export const createOrder = async (req, res) => {
  try {
    const {
      consoleType,
      noOfControllers,
      rentalStartDate,
      rentalEndDate,
      hours,
      depositAmount,
      deliveryAddress,
      gamesList,
    } = req.body;

    if (
      !consoleType ||
      !noOfControllers ||
      !rentalStartDate ||
      !rentalEndDate ||
      !deliveryAddress ||
      !gamesList
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = req.user;
    console.log(user, req.user, "REQQ");
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }
    const existingPendingOrder = await Order.findOne({
      user: user._id,status:"pending"
    });
    if (existingPendingOrder) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an active order. Please complete or cancel it before creating a new one.",
      });
    }
    const normalizedConsoleType = consoleType?.toLowerCase();
    const controllersCount = Number(noOfControllers) || 1;

    // 🔥 BACKEND PRICE CALCULATION
    const rentAmount = calculateBookingPrice({
      consoleType: normalizedConsoleType,
      rentalStartDate,
      rentalEndDate,
      hours,
      noOfControllers: controllersCount,
    });
    console.log("before", user);
    
    const order = await Order.create({
      user: user._id,
      customerName: user.name,
      customerPhone: user.phone,
      consoleType,
      noOfControllers,
      rentalStartDate,
      rentalEndDate,
      hours,
      gamesList,
      rentAmount, // ✅ backend calculated
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

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
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
      order.user._id.toString() !== req.user._id.toString()
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

export const updateOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    // 🔍 Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔒 Permission check
    if (req.user.role !== "admin") {
      if (
        order.user.toString() !== req.user.id.toString() ||
        order.paymentStatus !== "pending"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Order cannot be edited after payment. Please contact support.",
        });
      }
    }

    // ✅ Allowed editable fields
    const allowedFields = [
      "rentalStartDate",
      "rentalEndDate",
      "hours",
      "noOfControllers",
      "gamesList",
      "consoleType",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        order[field] = updates[field];
      }
    });

    // 🔐 Normalize values BEFORE price calc
    const normalizedConsoleType = order.consoleType?.toLowerCase();
    const normalizedHours = Number(order.hours) || 0;
    const normalizedControllers = Number(order.noOfControllers) || 1;

    if (!normalizedConsoleType) {
      return res.status(400).json({
        success: false,
        message: "Invalid console type",
      });
    }

    // 🔥 Recalculate price (SINGLE SOURCE OF TRUTH)
    order.rentAmount = calculateBookingPrice({
      consoleType: normalizedConsoleType,
      rentalStartDate: order.rentalStartDate,
      rentalEndDate: order.rentalEndDate,
      hours: normalizedHours,
      noOfControllers: normalizedControllers,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update order details",
      error: error.message,
    });
  }
};

export const adminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied, Admin access only",
      });
    }

    const [totalOrders, pendingOrders, returnedOrders, activeOrders] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: "returned" }),
        Order.countDocuments({ status: "active" }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        returnedOrders,
        activeOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to fetch stats",
    });
  }
};
