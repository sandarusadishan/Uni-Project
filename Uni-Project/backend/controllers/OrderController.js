import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    const { items, total, address, userId } = req.body;

    if (!items || !total || !address || !userId) {
        return res.status(400).json({ message: 'Missing required order fields.' });
    }

    try {
        const newOrder = await Order.create({
            userId,
            items,
            totalAmount: total,
            address,
            // Status is defaulted to 'pending' in model
        });

        res.status(201).json({ 
            message: 'Order placed successfully.', 
            orderId: newOrder._id 
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error placing order.' });
    }
};

// 2. Get All Orders for a Specific User (For OrderTracking Page)
export const getUserOrders = async (req, res) => {
    // Note: In a secure app, you should use the JWT user ID, not req.params.
    const { id } = req.params; // Expecting userId
    
    try {
        const orders = await Order.find({ userId: id })
                                  .sort({ createdAt: -1 }); // Newest first

        res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch user orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

// 3. Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    
    // Authorization Check: Only Admin can update status
    // Assuming the user role is available in req.user from JWT middleware
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only administrators can change order status.' });
    }

    if (!['preparing', 'on-the-way', 'delivered', 'pending'].includes(newStatus)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ 
            message: `Order ${orderId} status updated to ${newStatus}.`,
            order: updatedOrder
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error updating order status.' });
    }
};

// 4. Get All Orders (Admin Dashboard)
export const getAllOrders = async (req, res) => {
    try {
        // 🎯 Populate: userId path එක User model එකෙන් name field එක සමඟ Load කරයි.
        const orders = await Order.find()
                                  .sort({ createdAt: -1 })
                                  .populate('userId', 'name email'); 
                                  
        res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch all orders error:', error);
        res.status(500).json({ message: 'Server error fetching all orders.' });
    }
};