import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";
const { sequelize } = dbWithTables;

export default class WarnService {
    static async insert(payload, clientIp) {
        try {
            const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
            const cleanRes = BaseLogService.sanitizeBody(payload.response_body);
            const result = await sequelize.query(
                `EXEC dbo.WarnLog_Insert
                  @tenant_id = :tenant_id,
                  @user_id = :user_id,
                  @service_name = :service_name,
                  @action_name = :action_name,
                  @request_body = :request_body,
                  @response_body = :response_body,
                  @message = :message,
                  @status_code = :status_code,
                  @client_ip = :client_ip`,
                {
                    replacements: {
                        tenant_id: payload.tenant_id,
                        user_id: payload.user_id,
                        service_name: payload.service_name,
                        action_name: payload.action_name,
                        request_body: cleanBody,
                        response_body: cleanRes,
                        message: payload.message,
                        status_code: payload.status_code,
                        client_ip: clientIp
                    },
                    type: sequelize.QueryTypes.SELECT
                });
            return result?.[0]?.inserted_id || null;
        } catch (err) {
            throw new Error('Error : ' + err.message);
        }
    }
    static async search(filters) {
        try {
            const result = await sequelize.query(
                `EXEC dbo.WarnLog_Search
         @tenant_id = :tenant_id,
         @user_id = :user_id,
         @service_name = :service_name,
         @status_code = :status_code,
         @date_from = :date_from,
         @date_to = :date_to,
         @limit = :limit,
         @offset = :offset`,
                {
                    replacements: {
                        tenant_id: filters.tenant_id || null,
                        user_id: filters.user_id || null,
                        service_name: filters.service_name || null,
                        status_code: filters.status_code || null,
                        date_from: filters.date_from || null,
                        date_to: filters.date_to || null,
                        limit: filters.limit || 50,
                        offset: filters.offset || 0
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            const count = result && result.length > 0 ? result[0].total_count : 0;
            return { count, logs: result };
        } catch (err) {
            throw new Error('Error : ' + err.message);
        }
    }
}
