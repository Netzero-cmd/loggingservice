import dotenv from 'dotenv';
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectDb, disconnectDb } from "./config/database.js";
import infoRoutes from "./routes/info.routes.js";
import errorRoutes from "./routes/error.routes.js";
import warnRoutes from "./routes/warn.routes.js";
import activityRoutes from './routes/activity.routes.js';
import { constants } from './utils/utils.js';
dotenv.config({ override: true })


const app = express();
const PORT = process.env.PORT || 3000

console.log(PORT);


// Security + body parser
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (constants.NODE_ENV !== "production") app.use(morgan("dev"));

// DB connect
 connectDb();
console.log('db donnected');

// Base routes
app.get('/', (req, res) => {
    res.send("Logging Servicerunning")
})
app.use("/logging/info", infoRoutes);
app.use("/logging/error", errorRoutes);
app.use("/logging/warn", warnRoutes);
app.use('/logging/activity', activityRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} env=${constants.NODE_ENV || 'development'}`);
}
);
process.on('SIGINT', async () => {
    console.log('SIGINT received: shutting down gracefully...');
    server.close(async () => {
        console.log('HTTP server closed.');
        await disconnectDb();
        console.log('Database disconnected.');
        process.exit(0);
    });
});

