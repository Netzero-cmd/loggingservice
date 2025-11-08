import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";

const { sequelize } = dbWithTables;

export default class InfoService {
    // Insert new Info log
    static async insert(payload, clientIp) {
        try {
            const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
            const cleanRes = BaseLogService.sanitizeBody(payload.response_body);
            if (payload.status_code < 200 || payload.status_code > 299) {
                throw new Error("Invalid status code for INFO log");
            }
            const result = await sequelize.query(
                `EXEC dbo.InfoLog_Insert
                @tenant_id = :tenant_id,
                @user_id = :user_id,
                @service_name = :service_name,
                @action_name = :action_name,
                @path = :path,
                @request_body = :request_body,
                @response_body = :response_body,
                @status_code = :status_code,
                @client_ip = :client_ip`,
                {
                    replacements: {
                        tenant_id: payload.tenant_id,
                        user_id: payload.user_id,
                        service_name: payload.service_name,
                        action_name: payload.action_name,
                        path: payload.path,
                        request_body: cleanBody,
                        response_body: cleanRes,
                        status_code: payload.status_code,
                        client_ip: clientIp,
                    },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            // ✅ safely handle empty or undefined result
            return result?.[0]?.inserted_id || null;
        } catch (err) {
            throw new Error('Error : ' + err.message);
        }
    }

    // Search Info logs
    static async search(filters) {
        try {

            const {
                tenant_id = null,
                user_id = null,
                service_name = null,
                status_code = null,
                date_from = null,
                date_to = null,
                limit = 50,
                offset = 0,
            } = filters;
            const replacements = {
                tenant_id,
                user_id,
                service_name,
                status_code,
                date_from,
                date_to,
                limit: parseInt(limit, 10) || 50,
                offset: parseInt(offset, 10) || 0,
            };
            const rows = await sequelize.query(
                `EXEC dbo.InfoLog_Search
                    @tenant_id = :tenant_id,
                    @user_id = :user_id,
                    @service_name = :service_name,
                    @status_code = :status_code,
                    @date_from = :date_from,
                    @date_to = :date_to,
                    @limit = :limit,
                    @offset = :offset`,
                {
                    replacements,
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            // ✅ fix: declare count variable before use
            const count = rows?.length > 0 ? rows[0].total_count : 0;
            return { count, logs: rows };
        } catch (err) {
            throw new Error('Error : ' + err.message);
        }
    }
}
