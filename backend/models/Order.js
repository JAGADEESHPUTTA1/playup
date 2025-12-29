import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /* ---------------- USER LINK ---------------- */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Denormalized (copied from User at order time for admin ease)
    customerName: {
      type: String,
      trim: true,
    },

    customerPhone: {
      type: String,
      trim: true,
    },

    /* ---------------- DELIVERY ---------------- */
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    /* ---------------- CONSOLE DETAILS ---------------- */
    consoleType: {
      type: String,
      enum: ["PS4", "PS5"],
      required: true,
    },

    noOfControllers: {
      type: Number,
      required: true,
      min: 1,
    },

    /* ---------------- RENTAL PERIOD ---------------- */
    rentalStartDate: {
      type: Date,
      required: true,
    },

    gamesList: {
      type: String,
      required: true,
    },

    rentalEndDate: {
      type: Date,
      required: true,
    },

    hours: {
      type: Number,
    },

    /* ---------------- PRICING ---------------- */
    rentAmount: {
      type: Number,
      required: true,
    },

    depositAmount: {
      type: Number,
      default: 0,
    },

    /* ---------------- ORDER LIFECYCLE ---------------- */
    status: {
      type: String,
      enum: [
        "pending", // order placed
        "confirmed", // admin approved
        "delivered", // console delivered
        "active", // rental running
        "returned", // console returned
        "completed", // settled
        "cancelled",
      ],
      default: "pending",
    },

    /* ---------------- PAYMENT ---------------- */
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    /* ---------------- RETURN / DAMAGE ---------------- */
    returnedAt: Date,
    damageNotes: String,
    penaltyAmount: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
