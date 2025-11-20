import { Op } from "sequelize";

export default class BaseLogService {
    static buildFilters(filters = {}) {
        const allowedKeys = [
            "entity_code", "company_code", "branch_code", "user_code",
            "service_name", "status_code",
            "date_from", "date_to", "limit", "offset"
        ];
        Object.keys(filters).forEach(key => {
            if (!allowedKeys.includes(key)) delete filters[key];
        });
        let {
            entity_code,
            company_code,
            branch_code,
            user_id,
            service_name,
            status_code,
            date_from,
            date_to,
            limit = 50,
            offset = 0
        } = filters;
        const where = {};
        if (entity_code) where.entity_code = entity_code;
        if (company_code) where.company_code = company_code;
        if (branch_code) where.branch_code = branch_code;
        if (user_id) where.user_id = user_id;

        if (service_name) {
            where.service_name = { [Op.like]: `%${service_name}%` };
        }

        if (status_code) where.status_code = status_code;

        // Date filter with validation
        if (date_from || date_to) {
            where.createdAt = {};
            if (date_from && !isNaN(new Date(date_from))) {
                where.createdAt[Op.gte] = new Date(date_from);
            }
            if (date_to && !isNaN(new Date(date_to))) {
                where.createdAt[Op.lte] = new Date(date_to);
            }
        }
        return {
            where,
            limit: Math.abs(parseInt(limit)) || 50,
            offset: Math.abs(parseInt(offset)) || 0,
            order: [["createdAt", "DESC"]]
        };
    }
    static sanitizeBody(body) {
        if (!body) return null;
        let parsed;
        try {
            parsed = typeof body === "string" ? JSON.parse(body) : body;
        } catch (err) {
            return typeof body === "string" ? body : null;
        }
        if (typeof parsed !== "object" || parsed === null) {
            return JSON.stringify(parsed);
        }
        const sanitized = this.deepSanitize(parsed);
        return JSON.stringify(sanitized);
    }
    static deepSanitize(data) {
        if (Array.isArray(data)) {
            return data.map(item => this.deepSanitize(item));
        }
        if (typeof data === "object" && data !== null) {
            const sensitiveKeywords = [
                "password", "token", "secret", "client_secret", "refresh_token",
                "otp", "pin", "policy_number", "aadhar", "aadhaar", "pan",
                "mobile", "phone", "dob", "date_of_birth",
                "vehicle_number", "chassis_number", "engine_number",
                "account", "card", "cvv",
            ];
            const sanitizedObj = {};
            for (const key of Object.keys(data)) {
                const value = data[key];
                const isSensitive = sensitiveKeywords.some(word =>
                    key.toLowerCase().includes(word)
                );

                if (isSensitive) {
                    sanitizedObj[key] = "***MASKED***";
                } else if (typeof value === "object") {
                    sanitizedObj[key] = this.deepSanitize(value);
                } else {
                    sanitizedObj[key] = value;
                }
            }

            return sanitizedObj;
        }
        return data;
    }

}
