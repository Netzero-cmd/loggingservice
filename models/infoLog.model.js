import { DataTypes } from "sequelize";
import { getSequelize } from "../config/database.js";
const sequelize = getSequelize();

const InfoLog = sequelize.define("InfoLog", {
    info_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    service_name: DataTypes.STRING(150),
    action_name: DataTypes.STRING(150),
    path: DataTypes.STRING(255),
    request_body: DataTypes.TEXT,
    response_body: DataTypes.TEXT,
    status_code: DataTypes.INTEGER,
    client_ip: DataTypes.STRING(50),
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

export default InfoLog;
