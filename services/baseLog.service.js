import { Op } from "sequelize";

export default class BaseLogService {
    static buildFilters(filters = {}) {
        const {
            tenant_id,
            service_name,
            status_code,
            keyword,
            date_from,
            date_to,
            limit = 50,
            offset = 0,
        } = filters;

        const where = {};
        if (tenant_id) where.tenant_id = tenant_id;
        if (service_name) where.service_name = { [Op.like]: `%${service_name}%` };
        if (status_code) where.status_code = status_code;

        if (date_from || date_to) {
            where.createdAt = {};
            if (date_from) where.createdAt[Op.gte] = new Date(date_from);
            if (date_to) where.createdAt[Op.lte] = new Date(date_to);
        }

        if (keyword) {
            where[Op.or] = [
                { action_name: { [Op.like]: `%${keyword}%` } },
                { message: { [Op.like]: `%${keyword}%` } },
                { error_message: { [Op.like]: `%${keyword}%` } },
                { request_body: { [Op.like]: `%${keyword}%` } },
                { response_body: { [Op.like]: `%${keyword}%` } },
            ];
        }

        return {
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        };
    }

    static sanitizeBody(body) {
        if (!body) return null;
        try {
            const obj = typeof body === "string" ? JSON.parse(body) : body;
            delete obj.password;
            delete obj.token;
            delete obj.secret;
            return JSON.stringify(obj);
        } catch {
            return body;
        }
    }
}
