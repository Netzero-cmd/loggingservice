import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { json, urlencoded } from "express";
import { connectDb } from "./config/database.js";
import { clientIpMiddleware } from "./middleware/clientIp.middleware.js";

import infoRoutes from "./routes/info.routes.js";
import errorRoutes from "./routes/error.routes.js";
import warnRoutes from "./routes/warn.routes.js";
import activityRoutes from './routes/activity.routes.js';

const app = express();

// Security + body parser
app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(clientIpMiddleware);

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// DB connect
await connectDb();

// Base routes
app.use("/logging/info", infoRoutes);
app.use("/logging/error", errorRoutes);
app.use("/logging/warn", warnRoutes);
app.use('/logging/activity', activityRoutes);

app.get("/health", (req, res) => res.json({ status: "UP", ip: req.clientIp }));

app.listen(process.env.PORT || 3000, () =>
    console.log(`🚀 Logging Service running`)
);

export default app;
