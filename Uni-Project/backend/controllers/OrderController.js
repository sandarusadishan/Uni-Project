import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js'; 
export const createOrder = async (req, res) => {
    const { items, total, address, userId, couponId, paymentMethod } = req.body; 

    if (!items || !total || !address || !userId || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required order fields.' });
    }

    try {
        const newOrder = await Order.create({
            userId,
            items,
            totalAmount: total, 
            address,
            paymentMethod, 
        });

    
        if (couponId) {
            await Coupon.findByIdAndUpdate(couponId, { isUsed: true });
        }

        
        const notificationPayload = {
            orderId: newOrder._id,
            totalAmount: newOrder.totalAmount,
            timestamp: newOrder.createdAt,
            message: `New order #${newOrder._id.toString().slice(-6)} received!`
        };
        req.io.to('admin_room').emit('new_order', notificationPayload);

        res.status(201).json({ message: 'Order placed successfully.', orderId: newOrder._id });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error placing order.' });
    }
};


export const getUserOrders = async (req, res) => {
    const { id } = req.params; 
    try {
        const orders = await Order.find({ userId: id }).sort({ createdAt: -1 }); 
        res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch user orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

// 3. Update Order Status (Admin Only) - (unchanged)
export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only administrators can change order status.' });
    }
    
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

       
        if (order.status === 'delivered') {
            return res.status(400).json({ message: 'This order has already been delivered and its status cannot be changed.' });
        }

        order.status = newStatus;
        const updatedOrder = await order.save();

        res.status(200).json({ message: `Order ${orderId} status updated to ${newStatus}.`, order: updatedOrder });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error updating order status.' });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email'); 
        res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch all orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

// 5. Delete Order (Admin Only) - (unchanged)
export const deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only administrators can delete orders.' });
    }
    // ... (rest of the logic)
    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found.' });
        res.status(200).json({ message: 'Order successfully deleted.' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ message: 'Server error deleting order.' });
    }
};

// 6. 🎯 Apply Coupon (Check Validity and Calculate Discount)
export const applyCoupon = async (req, res) => {
    const userId = req.user._id; 
    const { code, cartTotal } = req.body;

    if (!code || cartTotal === undefined) {
        return res.status(400).json({ message: 'Coupon code and cart total are required.' });
    }

    try {
        const coupon = await Coupon.findOne({ code });

        if (!coupon) return res.status(404).json({ message: 'Invalid coupon code.' });
        if (coupon.assignedTo.toString() !== userId.toString()) return res.status(403).json({ message: 'This coupon is not assigned to your account.' });
        if (coupon.isUsed) return res.status(400).json({ message: 'This coupon has already been used.' });
        if (coupon.expiryDate < new Date()) return res.status(400).json({ message: 'This coupon has expired.' });

        let discountAmount = 0;

        // 5. Discount ගණනය කිරීම
        if (coupon.discountType === 'flat') {
            discountAmount = coupon.value;
        } else if (coupon.discountType === 'percentage') {
            discountAmount = cartTotal * coupon.value; 
            discountAmount = Math.round(discountAmount * 100) / 100; // Rounding
        } else if (coupon.discountType === 'free_item') {
            discountAmount = 300; // Fixed value for free item
        }
        
        
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        res.json({
            success: true,
            discount: discountAmount, // Final discount amount
            prizeName: coupon.prizeName,
            couponId: coupon._id 
        });

    } catch (error) {
        console.error('Coupon application error:', error);
        res.status(500).json({ message: 'Server error during coupon application.' });
    }
};