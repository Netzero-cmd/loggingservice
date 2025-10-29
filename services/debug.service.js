import DebugLog from "../models/debugLog.model.js";
import BaseLogService from "./baseLog.service.js";

export default class DebugService {
    static async insert(payload, clientIp) {
        const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
        return DebugLog.create({
            ...payload,
            request_body: cleanBody,
            client_ip: clientIp,
        });
    }

    static async search(filters) {
        const query = BaseLogService.buildFilters(filters);
        const logs = await DebugLog.findAll(query);
        return { count: logs.length, logs };
    }
}
