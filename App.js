import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { json, urlencoded } from 'express';

import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initDb } from './config/database.js';

const app = express();

// init DB connection pool
initDb().catch(err => {
    console.error('Failed to initialize DB', err);
    process.exit(1);
});

app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// dev logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// API versioning
app.use('/api/v1', routes);

// Error handler (last middleware)
app.use(errorHandler);

export default app;
