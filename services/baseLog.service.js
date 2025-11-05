import { Op } from "sequelize";

export default class BaseLogService {
    static buildFilters(filters = {}) {
        const { tenant_id, user_id, service_name, status_code, date_from, date_to, limit = 50, offset = 0 } = filters;
        const where = {};
        if (tenant_id) where.tenant_id = tenant_id;
        if (user_id) where.user_id = user_id;
        if (service_name) where.service_name = { [Op.like]: `%${service_name}%` };
        if (status_code) where.status_code = status_code;
        if (date_from || date_to) {
            where.createdAt = {};
            if (date_from) where.createdAt[Op.gte] = new Date(date_from);
            if (date_to) where.createdAt[Op.lte] = new Date(date_to);
        }
        return { where, limit: parseInt(limit), offset: parseInt(offset), order: [["createdAt", "DESC"]], };
    }
    static sanitizeBody(body) {
        if (body === null || typeof body === 'undefined') {
            return null;
        }
        let parsedBody;
        try {
            parsedBody = (typeof body === 'string' && body.trim().length > 0) ? JSON.parse(body) : body;
        } catch (error) {
            return typeof body === 'string' ? body : null;
        }
        if (typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
            return parsedBody !== null ? JSON.stringify(parsedBody) : null;
        }
        const sensitiveFields = ['password', 'token', 'secret', 'client_secret', 'refresh_token'];
        for (const field of sensitiveFields) {
            if (parsedBody.hasOwnProperty(field)) {
                parsedBody[field] = '***MASKED***';
            }
        }
        return JSON.stringify(parsedBody);
    }
}
