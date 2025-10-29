import ErrorLog from "../models/errorLog.model.js";
import BaseLogService from "./baseLog.service.js";

export default class ErrorService {
    static async insert(payload, clientIp) {
        const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
        return ErrorLog.create({
            ...payload,
            request_body: cleanBody,
            client_ip: clientIp,
        });
    }

    static async search(filters) {
        const query = BaseLogService.buildFilters(filters);
        const logs = await ErrorLog.findAll(query);
        return { count: logs.length, logs };
    }
}
