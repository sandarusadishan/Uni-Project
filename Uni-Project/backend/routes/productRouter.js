import express from "express";
import { getProducts, addProduct, deleteProduct, updateProduct } from "../controllers/ProductController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
