import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import User from "./models/User.js"; // <-- Import the User model
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const monogourl = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(monogourl).then(async () => {
  console.log("Database Connected");
  // Seed an admin user if one doesn't exist
  try {
    const adminUser = await User.findOne({ email: 'admin@burger.com' });
    if (!adminUser) {
      await User.create({
        name: 'Admin',
        email: 'admin@burger.com',
        password: 'admin123', // In a real app, use a more secure password
        role: 'admin',
      });
      console.log('Admin user created');
    } 
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}).catch((err) => console.error("Database connection error:", err));

app.use(cors());
app.use(express.json()); // Replaces bodyParser.json()

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
