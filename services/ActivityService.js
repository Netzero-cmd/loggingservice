import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";

const { InfoLog, ErrorLog, WarnLog } = dbWithTables;

export default class ActivityService {

    static async getLogsByUserId(userId) {
        if (!userId) throw new Error("User ID is required for tracing.");
        const queryOptions = {
            where: { user_id: userId },
            order: [["createdAt", "DESC"]],
            limit: 1
        };
        try {
            // Fetch latest row from each table
            const [info, warn, error] = await Promise.all([
                InfoLog.findOne(queryOptions),
                WarnLog.findOne(queryOptions),
                ErrorLog.findOne(queryOptions),
            ]);
            const logs = [];

            if (info) logs.push({ type: "INFO", timestamp: info.createdAt, ...info.get() });
            if (warn) logs.push({ type: "WARNING", timestamp: warn.createdAt, ...warn.get() });
            if (error) logs.push({ type: "ERROR", timestamp: error.createdAt, ...error.get() });

            if (logs.length === 0) return null;

            logs.sort((a, b) => b.timestamp - a.timestamp);

            return logs[0];

        } catch (err) {
            console.error("❌ getLogsByUserId failed:", err);
            throw new Error("Failed to retrieve centralized user activity.");
        }
    }
    static async searchAllLogs(filters = {}) {
        try {
            let { where, limit = 50, offset = 0, order = [["createdAt", "DESC"]] } =
                BaseLogService.buildFilters(filters);
            const MAX_LIMIT = 200;
            limit = Math.min(limit, MAX_LIMIT);

            // Fetch rows separately — enough rows without slice mistakes
            const [infoRows, warnRows, errorRows] = await Promise.all([
                InfoLog.findAll({ where, order }),
                WarnLog.findAll({ where, order }),
                ErrorLog.findAll({ where, order }),
            ]);

            // Merge + Tag
            const combined = [
                ...infoRows.map(row => ({ type: "INFO", ...row.get() })),
                ...warnRows.map(row => ({ type: "WARNING", ...row.get() })),
                ...errorRows.map(row => ({ type: "ERROR", ...row.get() })),
            ];
            combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const paginated = combined.slice(offset, offset + limit);
            return {
                count: combined.length,
                logs: paginated
            };

        } catch (err) {
            console.error("❌ Centralized search failed:", err);
            throw new Error("Failed to perform centralized log search.");
        }
    }
}
