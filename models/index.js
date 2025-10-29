import { getSequelize } from "../config/database.js";
import UserTenant from "./userTenant.model.js";
import InfoLog from "./infoLog.model.js";
import ErrorLog from "./errorLog.model.js";
import DebugLog from "./debugLog.model.js";

const sequelize = getSequelize();

// Define relationships
UserTenant.hasMany(InfoLog, { foreignKey: "tenant_id" });
UserTenant.hasMany(ErrorLog, { foreignKey: "tenant_id" });
UserTenant.hasMany(DebugLog, { foreignKey: "tenant_id" });

InfoLog.belongsTo(UserTenant, { foreignKey: "tenant_id" });
ErrorLog.belongsTo(UserTenant, { foreignKey: "tenant_id" });
DebugLog.belongsTo(UserTenant, { foreignKey: "tenant_id" });

// Export and sync
const db = { sequelize, UserTenant, InfoLog, ErrorLog, DebugLog };
export default db;
