import sequelize from "../config/config.js";
import { DataTypes } from "sequelize";

const Log = sequelize.define('Logs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    identitycode: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.JSON,
        allowNull: true
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    actionname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ipaddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: true
});

(async () => {
    await Log.sync();
})();
if (Log == sequelize.models.Log) {
    console.log(`Logs table created successfully!`);
}
else {
    console.log(`Logs table not created!`);
}

export default Log;