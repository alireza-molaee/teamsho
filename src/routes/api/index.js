import express from 'express';
import userRoutes from './user';
import eventRoutes from './event';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/event', eventRoutes);

export default router;