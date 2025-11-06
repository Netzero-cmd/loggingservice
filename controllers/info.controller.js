import InfoService from "../services/info.service.js";
class InfoController {
    static async create(req, res) {
        try {
            const Info_Id = await InfoService.insert(req.body, req.clientIp);
            res.status(201).json({ message: "Info log created", Info_Id: Info_Id });
        } catch (error) {
            console.error("Info log insert error:", error);
            res.status(500).json({ message: "Failed to insert info log" });
        }
    }
    static async search(req, res) {
        try {
            const result = await InfoService.search(req.query);
            res.status(200).json(result);
        } catch (error) {
            console.error("Info log search error:", error);
            res.status(500).json({ message: "Failed to fetch info logs" });
        }
    }

}

export default InfoController;
