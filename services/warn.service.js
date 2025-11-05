import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";
const { WarnLog } = dbWithTables;

export default class WarnService {
    static async insert(payload, clientIp, uuid) {
        const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
        return WarnLog.create({
            ...payload,
            request_body: cleanBody,
            client_ip: clientIp,
        });
    }
    static async search(filters) {
        const query = BaseLogService.buildFilters(filters);
        const logs = await WarnLog.findAll(query);
        return { count: logs.length, logs };
    }
}
