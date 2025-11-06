import ErrorService from "../services/error.service.js";


class ErrorController {
    static async create(req, res) {
        try {
            const log = await ErrorService.insert(req.body, req.clientIp);
            res.status(201).json({ message: "Error log created", id: log });
        } catch (error) {
            console.error("Error log insert error:", error);
            res.status(500).json({ message: "Failed to insert error log" });
        }
    }
    static async search(req, res) {
        try {
            const result = await ErrorService.search(req.query);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error log search error:", error);
            res.status(500).json({ message: "Failed to fetch error logs" });
        }
    }
}

export default ErrorController;
