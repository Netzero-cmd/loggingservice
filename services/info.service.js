import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";
const { InfoLog } = dbWithTables;

export default class InfoService {
    static async insert(payload, clientIp) {
        const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
        const cleanRes = BaseLogService.sanitizeBody(payload.response_body)
        return InfoLog.create({
            ...payload,
            request_body: cleanBody,
            response_body: cleanRes,
            client_ip: clientIp,
        });
    }
    static async search(filters) {
        const query = BaseLogService.buildFilters(filters);
        const logs = await InfoLog.findAll(query);
        return { count: logs.length, logs };
    }
}
