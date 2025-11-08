// server.js

import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js"; // 🎯 Order Router import kirima
import User from "./models/User.js"; 
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; 

dotenv.config();

const app = express();
const monogourl = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(monogourl).then(async () => {
  console.log("Database Connected");
  try {
    const adminUser = await User.findOne({ email: 'admin@burger.com' });
    if (!adminUser) {
      await User.create({
        name: 'Admin',
        email: 'admin@burger.com',
        password: 'admin123', 
        role: 'admin',
        // Note: Password should be hashed before saving to DB
      });
      console.log('Admin user created');
    } 
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}).catch((err) => console.error("Database connection error:", err));

app.use(cors());
app.use(express.json()); 

// ✅ Profile Images ප්‍රවේශ කිරීමට Static Middleware සකස් කිරීම.
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter); // 🎯 Order Router register kirima

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});