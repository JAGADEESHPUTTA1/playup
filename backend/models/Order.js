import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,

  consoleType: {
    type: String,
    enum: ["PS4", "PS5"]
  },

  rentAmount: Number,
  depositAmount: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);
