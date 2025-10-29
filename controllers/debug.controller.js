import DebugService from "../services/debug.service.js";

class DebugController {
    static async create(req, res) {
        try {
            const log = await DebugService.insert(req.body, req.clientIp);
            res.status(201).json({ message: "Debug log created", id: log.debug_id });
        } catch (error) {
            console.error("Debug log insert error:", error);
            res.status(500).json({ message: "Failed to insert debug log" });
        }
    }

    static async search(req, res) {
        try {
            const result = await DebugService.search(req.query);
            res.status(200).json(result);
        } catch (error) {
            console.error("Debug log search error:", error);
            res.status(500).json({ message: "Failed to fetch debug logs" });
        }
    }
}

export default DebugController;
