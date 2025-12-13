import express from "express";
import Bookmark from "../modules/BookmarkModule.js";
import Product from "../modules/ProductModule.js";
import mongoose from "mongoose";
import authenticat from "../middleware/Authentication.js";

const router = express.Router();



// Create a new bookmark
router.post("/create-bookmark", authenticat, async (req, res) => {
  try {
    const {
      user,
      product,
      pickupDate,
      pickupLocation,
      returnDate,
      returnLocation,
      totalPrice,
      status,
      notes,
    } = req.body;

    // Validate product existence
    const car = await Product.findById(product);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Create bookmark
    const bookmark = new Bookmark({
      user,
      product,
      pickupDate,
      pickupLocation,
      returnDate,
      returnLocation,
      totalPrice,
      status,
      notes,
    });

    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all bookmarks for a user (optional userId query param)
router.get("/", authenticat, async (req, res) => {
  try {
    const userId = req.query.userId;
    let query = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.user = userId;
    }
    const bookmarks = await Bookmark.find(query)
      .populate("product")
      .populate("user");
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a bookmark by ID
router.delete("/:id", authenticat, async (req, res) => {
  try {
    const bookmarkId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookmarkId)) {
      return res.status(400).json({ message: "Invalid bookmark ID" });
    }
    const deleted = await Bookmark.findByIdAndDelete(bookmarkId);
    if (!deleted) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Check availability of a car for given pickup and return dates
router.post("/check-availability", authenticat, async (req, res) => {
  try {
    const { productId, pickupDate, returnDate } = req.body;

    if (!productId || !pickupDate || !returnDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find bookmarks for the product that overlap with the requested dates
    const overlappingBookings = await Bookmark.find({
      product: productId,
      $or: [
        {
          pickupDate: { $lte: new Date(returnDate) },
          returnDate: { $gte: new Date(pickupDate) },
        },
      ],
      status: { $in: ["pending", "confirmed"] },
    });

    const isAvailable = overlappingBookings.length === 0;

    res.json({ available: isAvailable});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
