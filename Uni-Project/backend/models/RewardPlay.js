import mongoose from 'mongoose';

const rewardPlaySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    lastPlayedDate: { 
        type: Date, 
        required: true 
    },
    lastPrize: { 
        type: String, 
        default: 'TRY AGAIN' 
    }
}, { timestamps: true });

export default mongoose.model('RewardPlay', rewardPlaySchema);
// OR: module.exports = mongoose.model('RewardPlay', rewardPlaySchema);