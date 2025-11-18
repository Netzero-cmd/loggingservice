import WarnService from "../services/warn.service.js";
class WarnController {
    static async create(req, res) {
        try {
            const log = await WarnService.insert(req.body);
            res.status(201).json({ message: "Warn log created", id: log });
        } catch (error) {
            console.error("Debug log insert error:", error);
            res.status(500).json({ message: "Failed to insert debug log" });
        }
    }
    static async search(req, res) {
        try {
            const result = await WarnService.search(req.query);
            res.status(200).json(result);
        } catch (error) {
            console.error("Debug log search error:", error);
            res.status(500).json({ message: "Failed to fetch debug logs" });
        }
    }
}

export default WarnController;
