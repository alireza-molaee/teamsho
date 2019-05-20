import express from 'express';

const router = express.Router()

import { getCategories } from './handlers';

router.get('/', getCategories);

export default router;