import express from 'express';

import { playDailyReward, getDailyPlayStatus } from '../controllers/rewardController.js'; 
import { protect } from '../models/authMiddleware.js'; 

const rewardRouter = express.Router();

rewardRouter.get('/status', protect, getDailyPlayStatus);
rewardRouter.post('/play', protect, playDailyReward);

export default rewardRouter;