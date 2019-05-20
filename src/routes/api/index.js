import express from 'express';
import userRoutes from './user';
import eventRoutes from './event';
import categoriesRoutes from './categories';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/event', eventRoutes);
router.use('/category', categoriesRoutes);

export default router;