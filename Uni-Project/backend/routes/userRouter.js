import express from "express";
import { createUser, getAllUsers, loginUser, updateUser, deleteUser, getSingleUser, changePassword } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/register", createUser)
userRouter.post("/login", loginUser)
userRouter.get("/", getAllUsers) 
userRouter.get("/:id", getSingleUser)
userRouter.put("/:id", updateUser) // Photo upload/Update route

userRouter.put("/change-password/:id", changePassword)

userRouter.delete("/:id", deleteUser)

export default userRouter;