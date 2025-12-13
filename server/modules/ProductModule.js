import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 300 , required: true },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    seats: { type: Number, default: 4 },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      default: "automatic",
    },
    fuelType: {
      type: String,
      enum: [ "petrol" ,"gasoline", "diesel", "electric", "hybrid"],
      default: "petrol",
    },
    pricePerDay: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
    features: [{ type: String }],
    location: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
