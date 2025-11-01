import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const monogourl = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(monogourl).then(() => {
  console.log("Database Connected");
}).catch((err) => console.error("Database connection error:", err));

app.use(cors());
app.use(express.json()); // Replaces bodyParser.json()

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
