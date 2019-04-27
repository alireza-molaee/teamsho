import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './routes/api';
import view from './routes/view';

const app = express();

app.use(morgan(process.env.MORGAN_LOG));
app.use(bodyParser.json());
app.use('/static', express.static('public'));
app.use('/api', api);
app.use('/', view);

export default app;

