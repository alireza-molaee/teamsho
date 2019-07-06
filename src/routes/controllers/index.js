import express from 'express';
const router = express.Router();
import landing from './home';

// router.use('/admin', admin)
router.use('/', landing)

export default router;