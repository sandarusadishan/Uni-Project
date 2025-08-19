import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const monogourl =process.env.mongo_db_url;

mongoose.connect(monogourl, {});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Database Connected");
});

app.use(bodyParser.json());

app.use("/api/users", userRouter);

app.listen(3000, () => {
  console.log("Server is rinning on port 3000");
});
