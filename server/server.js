import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/Db.js";
import UserRoute from "./routes/UserRoute.js";
import connectCloudinary from "./config/Cloudinary.js";
import ProductRouter from "./routes/ProductRoute.js";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

// connections
connectDB();
connectCloudinary();

// API routes
app.use("/api/user", UserRoute);
app.use("/api/product", ProductRouter);

// Serve static frontend
app.use(express.static(path.join(__dirname, "client/dist")));

// React SPA fallback (NO WILDCARD!)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

app.get("/", (req, res) => {
  res.send("API is running...");
});


// start server
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
