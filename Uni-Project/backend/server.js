// server.js - Production ready code for Render deployment

import express from "express";
import mongoose from "mongoose";
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js"; 
import rewardRouter from "./routes/rewardRoutes.js";
import User from "./models/User.js"; 
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; 
import { fileURLToPath } from 'url'; // Required for __dirname in ES Modules

dotenv.config();

// Define __dirname for consistent path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -----------------------------------------------------------------
// 🛠️ HOST and PORT Configuration for Cloud Deployment (Render Fix)
// -----------------------------------------------------------------

// HOST must be '0.0.0.0' for Render/cloud platforms to bind correctly.
const HOST = '0.0.0.0'; 
// Use the port provided by the environment (Render) or default to 3000.
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; // Retrieved from Render Environment Variables.
// Frontend URL for CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const httpServer = createServer(app);

// -----------------------------------------------------------------
// 🌐 Socket.IO Server and CORS Setup
// -----------------------------------------------------------------

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL, // Use the correct Frontend URL for production
    methods: ["GET", "POST"]
  }
});

// -----------------------------------------------------------------
// 💾 Database Connection and Seeding
// -----------------------------------------------------------------

mongoose.connect(MONGO_URI).then(async () => {
  console.log("Database Connected Successfully. ✅");
  try {
    // Admin Seeding Logic
    const adminUser = await User.findOne({ email: 'admin@burger.com' });
    if (!adminUser) {
      // WARNING: Password should be HASHED before saving to the database in a real application!
      await User.create({
        name: 'Admin',
        email: 'admin@burger.com',
        password: 'admin123', 
        role: 'admin',
      });
      console.log('Admin user created for seeding.');
    } 
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}).catch((err) => console.error("Database connection error:", err));

// -----------------------------------------------------------------
// ⚙️ Middlewares
// -----------------------------------------------------------------

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json()); 

// Attach the Socket.IO instance to the request object for use in controllers.
app.use((req, res, next) => {
  req.io = io;
  next();
});

// -----------------------------------------------------------------
// 📡 Socket.IO Connection Logic
// -----------------------------------------------------------------

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  // Listener for the admin dashboard to join a dedicated room.
  socket.on('join_admin_room', () => {
      console.log(`Socket ${socket.id} joined the admin room.`);
      socket.join('admin_room'); 
  });
});

// -----------------------------------------------------------------
// 🖼️ Static Files and Routes
// -----------------------------------------------------------------

// Serve 'public' folder from the root path (/).
app.use(express.static(path.join(__dirname, 'public')));

// Serve 'uploads' folder for user/product images.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check Route: Crucial for cloud platforms to verify server is running.
app.get("/health", (req, res) => {
  res.status(200).send("Server is alive and ready!");
});

// API Routes Registration
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter); 
app.use("/api/rewards", rewardRouter);

// -----------------------------------------------------------------
// 🚀 Server Listening (Applying Host Binding Fix)
// -----------------------------------------------------------------

// By explicitly passing HOST ('0.0.0.0'), we prevent the Render Timeout error.
httpServer.listen(PORT, HOST, () => {
  console.log(`Server successfully started on http://${HOST}:${PORT}`);
});