// routes/orderRouter.js

import express from 'express';
import { 
    createOrder, 
    getUserOrders, 
    updateOrderStatus, 
    getAllOrders, 
    deleteOrder,
    applyCoupon 
} from '../controllers/OrderController.js';
import { protect } from '../models/authMiddleware.js'; 

const orderRouter = express.Router();

// Public/Protected Routes (User access)
orderRouter.post('/', protect, createOrder); 
orderRouter.get('/user/:id', protect, getUserOrders); 

// Coupon Route
orderRouter.post('/apply-coupon', protect, applyCoupon); 

// Admin Routes (Admin Dashboard access)
orderRouter.get('/', protect, getAllOrders); 
orderRouter.put('/:orderId/status', protect, updateOrderStatus); 
orderRouter.delete('/:orderId', protect, deleteOrder); 

export default orderRouter;