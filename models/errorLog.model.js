import { DataTypes } from "sequelize";
import { getSequelize } from "../config/database.js";
import UserTenant from "./userTenant.model.js";

const sequelize = getSequelize();

const ErrorLog = sequelize.define("ErrorLog", {
    error_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    service_name: DataTypes.STRING(150),
    action_name: DataTypes.STRING(150),
    error_message: DataTypes.TEXT,
    stack_trace: DataTypes.TEXT,
    request_body: DataTypes.TEXT,
    status_code: DataTypes.INTEGER,
    correlation_id: DataTypes.UUID,
    client_ip: DataTypes.STRING(50),
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

UserTenant.hasMany(ErrorLog, { foreignKey: "tenant_id" });
ErrorLog.belongsTo(UserTenant, { foreignKey: "tenant_id" });

(async () => {
    await ErrorLog.sync({ alter: true })
})();

export default ErrorLog;
