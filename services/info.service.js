import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";
import { QueryTypes } from "sequelize";

const { sequelize } = dbWithTables;

export default class InfoService {
    static async insert(payload, clientIp) {
        try {
            // Validate correct status code for INFO logs
            if (payload.status_code < 200 || payload.status_code > 299) {
                throw new Error("Invalid status code for INFO log");
            }
            // Deep sanitization for request and response
            const cleanReqBody = BaseLogService.sanitizeBody(payload.request_body);
            const cleanResBody = BaseLogService.sanitizeBody(payload.response_body);
            const cleanParams = BaseLogService.sanitizeBody(payload.request_params);
            const cleanQuery = BaseLogService.sanitizeBody(payload.request_query);
            // ✔ FIX: clean SP command (no trailing comma)
            const result = await sequelize.query(
                `EXEC dbo.InfoLog_Insert
                    @entity_code      = :entity_code,
                    @company_code       = :company_code,
                    @branch_code        = :branch_code,
                    @user_id          = :user_id,
                    @service_name     = :service_name,
                    @action_name      = :action_name,
                    @request_body     = :request_body,
                    @request_params   = :request_params,
                    @request_query    = :request_query,
                    @response_body    = :response_body,
                    @status_code      = :status_code,
                    @success_message   = :success_message`,
                {
                    replacements: {
                        entity_code: payload.entity_code,
                        company_code: payload.company_code,
                        branch_code: payload.branch_code,
                        user_id: payload.user_id,
                        service_name: payload.service_name,
                        action_name: payload.action_name,
                        request_body: cleanReqBody,
                        request_params: cleanParams,
                        request_query: cleanQuery,
                        response_body: cleanResBody,
                        status_code: payload.status_code,
                        success_message: payload.success_message,
                    },
                    type: QueryTypes.SELECT,
                }
            );

            return result?.[0]?.inserted_id || null;

        } catch (err) {
            throw new Error("Error inserting info log: " + err.message);
        }
    }
    static async search(filters) {
        try {
            const {
                entity_code = null,
                company_code = null,
                branch_code = null,
                user_id = null,
                service_name = null,
                action_name = null,
                status_code = null,
                date_from = null,
                date_to = null,
                limit = 50,
                offset = 0,
            } = filters;
            const replacements = {
                entity_code,
                company_code,
                branch_code,
                user_id,
                service_name,
                action_name,
                status_code,
                date_from,
                date_to,
                limit: parseInt(limit) || 50,
                offset: parseInt(offset) || 0,
            };
            const rows = await sequelize.query(
                `EXEC dbo.InfoLog_Search
                    @entity_code   = :entity_code,
                    @company_code    = :company_code,
                    @branch_code     = :branch_code,
                    @user_id       = :user_id,
                    @service_name  = :service_name,
                    @action_name   = :action_name,
                    @status_code   = :status_code,
                    @date_from     = :date_from,
                    @date_to       = :date_to,
                    @limit         = :limit,
                    @offset        = :offset`,
                {
                    replacements,
                    type: QueryTypes.SELECT,
                }
            );
            const count = rows?.length > 0 ? rows[0].total_count : 0;
            return { count, logs: rows };

        } catch (err) {
            throw new Error("Error searching info logs: " + err.message);
        }
    }
}
