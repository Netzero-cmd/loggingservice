import { DataTypes } from "sequelize";
import { getSequelize } from "../config/database.js";
import UserTenant from "./userTenant.model.js";

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
    correlation_id: DataTypes.UUID,
    client_ip: DataTypes.STRING(50),
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

UserTenant.hasMany(InfoLog, { foreignKey: "tenant_id" });
InfoLog.belongsTo(UserTenant, { foreignKey: "tenant_id" });

(async () => {
    await InfoLog.sync({ alter: true })
})();

export default InfoLog;
