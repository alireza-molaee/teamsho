import express from 'express';
const router = express.Router();
import admin from './admin';
import landing from './home';

router.use('/admin', admin)
router.use('/', landing)

export default router;