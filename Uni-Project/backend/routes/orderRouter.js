

import express from 'express';
import { createOrder, getUserOrders, updateOrderStatus, getAllOrders } from '../controllers/OrderController.js';
import { protect } from '../models/authMiddleware.js';// ඔබගේ Auth Middleware එක

const orderRouter = express.Router();

// Public/Protected Routes
orderRouter.post('/', protect, createOrder); // Order create kirima. protect middleware ekak yoda ganna.
orderRouter.get('/user/:id', protect, getUserOrders); // Ek user kenekge orders ganna.

// Admin Routes (Admin Dashboard)
orderRouter.get('/', protect, getAllOrders); // Siyalu orders ganna. (Admin Dashboard walata)
orderRouter.put('/:orderId/status', protect, updateOrderStatus); // Status update kirima.

export default orderRouter;