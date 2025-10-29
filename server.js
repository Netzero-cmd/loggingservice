import dotenv from 'dotenv';
dotenv.config({ override: true });

import app from './app.js';
import { disconnectDb } from './config/database.js';

const PORT = process.env.PORT || 3000;


const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (env=${process.env.NODE_ENV || 'development'})`);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received: shutting down gracefully...');
    server.close(async () => {
        console.log('HTTP server closed.');
        await disconnectDb();
        console.log('Database disconnected.');
        process.exit(0);
    });
});