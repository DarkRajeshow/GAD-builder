import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import DesignRoutes from "./routes/Design.js";
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();
const app = express();
const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use("/api/uploads", express.static("public/uploads"));

// Routes
app.use("/api/user", UserRoutes);
app.use("/api/designs", DesignRoutes);

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Root route
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello Guys chay pi lo...",
  });
});

// Database connection
const connectDB = async () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:");
    console.error(error);
    process.exit(1); // Exit process with failure
  }
};

startServer();
