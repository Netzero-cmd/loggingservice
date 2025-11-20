import dbWithTables from "../models/index.js";
import BaseLogService from "./baseLog.service.js";
import { QueryTypes } from "sequelize";

const { sequelize } = dbWithTables;

export default class ErrorService {
    static async insert(payload) {
        try {
            // Validate proper error code (400–599)
            if (!payload.status_code || payload.status_code < 400 || payload.status_code > 599) {
                throw new Error("Invalid status code for ERROR log");
            }
            // Deep sanitize ALL request data
            const cleanBody = BaseLogService.sanitizeBody(payload.request_body);
            const cleanParams = BaseLogService.sanitizeBody(payload.request_params);
            const cleanQuery = BaseLogService.sanitizeBody(payload.request_query);

            // FIX: removed trailing comma from SQL
            const result = await sequelize.query(
                `EXEC dbo.ErrorLog_Insert
                    @entity_code = :entity_code,
                    @company_code = :company_code,
                    @branch_code = :branch_code,
                    @user_id = :user_id,
                    @service_name = :service_name,
                    @action_name = :action_name,
                    @request_body = :request_body,
                    @request_params = :request_params,
                    @request_query = :request_query,
                    @status_code = :status_code,
                    @error_message = :error_message`,
                {
                    replacements: {
                        entity_code: payload.entity_code,
                        company_code: payload.company_code,
                        branch_code: payload.branch_code,
                        user_id: payload.user_id,
                        service_name: payload.service_name,
                        action_name: payload.action_name,
                        request_body: cleanBody,
                        request_params: cleanParams,
                        request_query: cleanQuery,
                        status_code: payload.status_code,
                        error_message: payload.error_message,
                    },
                    type: QueryTypes.SELECT,
                }
            );
            return result?.[0]?.inserted_id || null;
        } catch (err) {
            throw new Error("Error inserting log: " + err.message);
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
                `EXEC dbo.ErrorLog_Search
                    @entity_code = :entity_code,
                    @company_code = :company_code,
                    @branch_code = :branch_code,
                    @user_id = :user_id,
                    @service_name = :service_name,
                    @action_name = :action_name,
                    @status_code = :status_code,
                    @date_from = :date_from,
                    @date_to = :date_to,
                    @limit = :limit,
                    @offset = :offset`,
                {
                    replacements,
                    type: QueryTypes.SELECT,
                }
            );
            const totalCount = rows?.length > 0 ? rows[0].total_count : 0;
            return {
                count: totalCount,
                logs: rows
            };
        } catch (err) {
            throw new Error("Error searching logs: " + err.message);
        }
    }

}
