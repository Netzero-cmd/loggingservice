import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";

const { sequelize, InfoLog, ErrorLog, WarnLog } = dbWithTables;

export default class ActivityService {
    static async getLogsByUserId(userId) {
        if (!userId) {
            throw new Error("User ID is required for tracing.");
        }
        const queryOptions = {
            where: { user_id: userId },
            order: [["createdAt", "DESC"]],
            limit: 1
        };

        try {
            const [lastInfoLog, lastWarningLog, lastErrorLog] = await Promise.all([
                InfoLog.findOne(queryOptions),
                WarnLog.findOne(queryOptions),
                ErrorLog.findOne(queryOptions)
            ]);
            const lastLogs = [];
            if (lastInfoLog) lastLogs.push({ type: "INFO", ...lastInfoLog.get() });
            if (lastWarningLog) lastLogs.push({ type: "WARNING", ...lastWarningLog.get() });
            if (lastErrorLog) lastLogs.push({ type: "ERROR", ...lastErrorLog.get() });
            if (lastLogs.length === 0) return null;
            lastLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return lastLogs[0];
        } catch (error) {
            console.error("Error finding last user activity across tables:", error);
            throw new Error("Failed to retrieve centralized user activity.");
        }
    }
    static async searchAllLogs(filters = {}) {
        try {
            const { where, limit = 50, offset = 0, order = [["createdAt", "DESC"]] } =
                BaseLogService.buildFilters(filters);
            const [infoLogs, warnLogs, errorLogs] = await Promise.all([
                InfoLog.findAll({ where, limit, offset, order }),
                WarnLog.findAll({ where, limit, offset, order }),
                ErrorLog.findAll({ where, limit, offset, order })
            ]);
            const combined = [
                ...infoLogs.map(l => ({ type: "INFO", ...l.get() })),
                ...warnLogs.map(l => ({ type: "WARNING", ...l.get() })),
                ...errorLogs.map(l => ({ type: "ERROR", ...l.get() }))
            ];
            combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const paginated = combined.slice(offset, offset + limit);
            return {
                count: combined.length,
                logs: paginated
            };
        } catch (error) {
            console.error("Centralized log search failed:", error);
            throw new Error("Failed to perform centralized log search.");
        }
    }

}
