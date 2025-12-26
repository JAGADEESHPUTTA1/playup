import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    console.log("ORDER API HIT");
    console.log("REQ BODY:", req.body);

    const order = new Order({
      customerName: req.body.customerName,
      phone: req.body.phone,
      address: req.body.address,
      consoleType: req.body.consoleType,
      rentAmount: req.body.rentAmount,
      depositAmount: req.body.depositAmount,
      paymentStatus: "pending"
    });

    await order.save();

    console.log("ORDER SAVED:", order._id);

    res.status(201).json(order);
  } catch (error) {
    console.error("ORDER ERROR FULL:", error);
    res.status(500).json({
      message: "Order creation failed",
      error: error.message
    });
  }
};
