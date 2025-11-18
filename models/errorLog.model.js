import { DataTypes } from "sequelize";
import { getSequelize } from "../config/database.js";
const sequelize = getSequelize();

const ErrorLog = sequelize.define("ErrorLog", {
    error_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    entity_code: { type: DataTypes.INTEGER, allowNull: false },
    company_code: { type: DataTypes.INTEGER, allowNull: false },
    branch_code: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    service_name: DataTypes.STRING(150),
    action_name: DataTypes.STRING(150),
    request_body: DataTypes.TEXT,
    request_params: DataTypes.TEXT,
    request_query: DataTypes.TEXT,
    status_code: DataTypes.INTEGER,
    error_message: DataTypes.TEXT,
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

export default ErrorLog;
