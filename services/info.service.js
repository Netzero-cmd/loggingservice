import InfoLog from "../models/infoLog.model.js";
import BaseLogService from "./baseLog.service.js";
import UserTenant from "../models/userTenant.model.js";

export default class InfoService {
    static async insert(payload, clientIp) {
        const { tenant_id, user_id } = payload;
        const tenantExists = await UserTenant.findByPk(tenant_id);
        if (!tenantExists) {
            await UserTenant.create({
                tenant_id,
                user_id,
                username: `auto_user_${user_id}`,
                role: "system",
            });
        }
        const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
        return InfoLog.create({
            ...payload,
            request_body: cleanBody,
            client_ip: clientIp,
        });
    }
    static async search(filters) {
        const query = BaseLogService.buildFilters(filters);
        const logs = await InfoLog.findAll(query);
        return { count: logs.length, logs };
    }
}
