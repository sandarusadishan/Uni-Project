import mongoose from 'mongoose'; // ✅ 'require' වෙනුවට 'import' භාවිතා කර ඇත.

const couponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true,
        unique: true 
    },
    prizeName: { 
        type: String, 
        required: true 
    },
    discountType: { // 'flat', 'percentage', 'free_item'
        type: String,
        required: true 
    },
    value: { // 100 or 0.10 (for 10%)
        type: Number,
        required: true
    },
    isUsed: { 
        type: Boolean, 
        default: false 
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    expiryDate: {
        type: Date,
        default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) 
    }
}, { timestamps: true });


const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;