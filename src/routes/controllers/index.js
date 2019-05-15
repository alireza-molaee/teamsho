import express from 'express';
const router = express.Router();

router.get('/admin', (req, res) => {
    res.render('index', { page: {title: 'salam'} });
})

export default router;