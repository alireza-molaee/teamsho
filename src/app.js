import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './routes/api';
import view from './routes/view';
import errorHandler, { handleValidationError } from './middlewares/error-handling';
import fileUpload from 'express-fileupload';

const app = express();

app.use(morgan(process.env.MORGAN_LOG));
app.use(bodyParser.json());
app.use(fileUpload({
    fileSize: 50 * 1024 * 1024,
    abortOnLimit: true,
    createParentPath: true,
}))
// app.use(handleValidationError);
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/api', api);
app.use('/', view);
app.use(errorHandler);

export default app;

