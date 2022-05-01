import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import newsRouter from './news/route';
const app = express();

const appRoutes = express.Router();

appRoutes.use('/api', cors(), newsRouter);

app.use(appRoutes);

export { app };
