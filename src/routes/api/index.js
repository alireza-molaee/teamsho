import express from 'express';
import userRoutes from './user';
import eventRoutes from './event';
import categoriesRoutes from './categories';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = YAML.load('./openapi.yaml');

const router = express.Router();

router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/user', userRoutes);
router.use('/event', eventRoutes);
router.use('/category', categoriesRoutes);

export default router;