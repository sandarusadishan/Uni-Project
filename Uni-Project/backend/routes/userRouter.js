import express from "express";
import { createUsers, deleteUsers, getUsers } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUsers);
userRouter.delete("/", deleteUsers);

export default userRouter;
