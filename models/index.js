import { getSequelize } from "../config/database.js";
import InfoLog from "./infoLog.model.js";
import ErrorLog from "./errorLog.model.js";
import WarnLog from "./warnLog.model.js";
const sequelize = getSequelize();

async function syncDatabase() {
    try {
        await InfoLog.sync({ alter: true })
        console.log("✅ InfoLogs table synced.");
        await ErrorLog.sync({ alter: true });
        console.log("✅ ErrorLogs table synced.");
        await WarnLog.sync({ alter: true });
        console.log("✅ WarnLogs table synced.");
        console.log("Database schema synchronization complete.");
    } catch (error) {
        console.error("❌ Database sync failed:", error);
    }
}

syncDatabase();

// Export and sync
const dbWithTables = { sequelize, InfoLog, ErrorLog, WarnLog };
export default dbWithTables;
