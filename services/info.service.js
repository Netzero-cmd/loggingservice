import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";
const { InfoLog } = dbWithTables;

export default class InfoService {
    static async insert(payload, clientIp) {
        const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
        const cleanRes = BaseLogService.sanitizeBody(payload.response_body);
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
                    client_ip: clientIp
                },
                type: sequelize.QueryTypes.SELECT
            }
        );
        return result && result[0] && result[0].inserted_id;
    }

    static async search(filters) {
        const query = BaseLogService.buildFilters(filters);
        const logs = await InfoLog.findAll(query);
        return { count: logs.length, logs };
    }
}
