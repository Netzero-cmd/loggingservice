import ActivityService from "../services/ActivityService.js";
class ActivityController {
    static async getTraceByUserId(req, res) {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "Invalid or missing UserID provided." });
        }
        try {
            const result = await ActivityService.getLogsByUserId(userId);
            res.status(200).json({
                service_name: result.service_name,
                action_name: result.action_name,
                path: result.path,
                createdAt: result.createdAt,
                status_code: result.status_code,
                request_body: result.request_body,
                response_body: result.response_body,
                message: result.message,
                error_message: result.error_message,
            });
        } catch (error) {
            console.error("User ID trace error:", error);
            res.status(500).json({ message: "Failed to retrieve request trace due to internal error." });
        }
    }
    static async searchAllLogs(req, res) {
        try {
            const result = await ActivityService.searchAllLogs(req.query);
            if (result.logs.length > 0) {
                res.status(200).json({
                    message: "Centralized log search successful.",
                    count: result.count,
                    logs: result.logs
                });
            } else {
                res.status(200).json({
                    message: "No logs found matching the criteria.",
                    count: 0,
                    logs: []
                });
            }

        } catch (error) {
            console.error("Activity log search error:", error);
            res.status(500).json({ message: "Failed to search all logs due to an internal error." });
        }
    }
}

export default ActivityController;