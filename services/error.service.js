import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";
const { sequelize } = dbWithTables;


export default class ErrorService {
    static async insert(payload, clientIp) {
        try {
            const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
            const result = await sequelize.query(
                `EXEC dbo.ErrorLog_Insert
                @tenant_id = :tenant_id,
                @user_id = :user_id,
                @service_name = :service_name,
                @action_name = :action_name,
                @error_message = :error_message,
                @request_body = :request_body,
                @status_code = :status_code,
                @client_ip = :client_ip`,
                {
                    replacements: {
                        tenant_id: payload.tenant_id,
                        user_id: payload.user_id,
                        service_name: payload.service_name,
                        action_name: payload.action_name,
                        error_message: payload.error_message,
                        request_body: cleanBody,
                        status_code: payload.status_code,
                        client_ip: clientIp
                    },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            return result?.[0]?.inserted_id || null
        }
        catch (err) {
            throw new Error('Error : ' + err.message);
        }
    }
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
                `EXEC dbo.ErrorLog_Search
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
            const count = rows?.length > 0 ? rows[0].total_count : 0;
            return { count, logs: rows };
        }
        catch (err) {
            throw new Error('Error : ' + err.message);
        }
    }
}
