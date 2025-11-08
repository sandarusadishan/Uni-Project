import express from "express";
import { createUser, getAllUsers, loginUser } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/register", createUser)
userRouter.post("/login", loginUser)
userRouter.get("/", getAllUsers)

export default userRouter;
