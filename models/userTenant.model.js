import { DataTypes } from "sequelize";
import { getSequelize } from "../config/database.js";

const sequelize = getSequelize();

const UserTenant = sequelize.define("UserTenant", {
    tenant_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

(async () => {
    await UserTenant.sync({ alter: true })
})();

export default UserTenant;
