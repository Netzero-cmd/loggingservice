import { DataTypes } from "sequelize";
import { getSequelize } from "../config/database.js";
const sequelize = getSequelize();

const WarnLog = sequelize.define("WarnLog", {
    warn_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    service_name: DataTypes.STRING(150),
    action_name: DataTypes.STRING(150),
    request_body: DataTypes.TEXT,
    response_body: DataTypes.TEXT,
    message: DataTypes.TEXT,
    status_code: DataTypes.INTEGER,
    client_ip: DataTypes.STRING(50),
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});
export default WarnLog;
