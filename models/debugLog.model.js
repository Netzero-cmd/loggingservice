import { DataTypes } from "sequelize";
import { getSequelize } from "../config/database.js";
import UserTenant from "./userTenant.model.js";

const sequelize = getSequelize();

const DebugLog = sequelize.define("DebugLog", {
    debug_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    service_name: DataTypes.STRING(150),
    action_name: DataTypes.STRING(150),
    message: DataTypes.TEXT,
    extra_context: DataTypes.TEXT,
    status_code: DataTypes.INTEGER,
    correlation_id: DataTypes.UUID,
    client_ip: DataTypes.STRING(50),
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

UserTenant.hasMany(DebugLog, { foreignKey: "tenant_id" });
DebugLog.belongsTo(UserTenant, { foreignKey: "tenant_id" });


(async () => {
    await DebugLog.sync({ alter: true })
})();
export default DebugLog;
