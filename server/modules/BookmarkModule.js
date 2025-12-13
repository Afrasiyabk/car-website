import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    returnLocation: {
      type: String,
      required: true,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

export default Bookmark;
