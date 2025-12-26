import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

export const createPayment = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency: "INR"
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment" });
  }

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "paid",
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id
  });

  res.json({ success: true });
};
