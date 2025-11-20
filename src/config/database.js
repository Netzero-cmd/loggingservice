import { Sequelize } from "sequelize";
import { constants } from "../utils/utils.js";

let sequelize = new Sequelize(
    constants.DB_NAME,
    constants.DB_USERNAME,
    constants.DB_PASSWORD,
    {
        host: constants.DB_HOST,
        port: 1433,
        dialect: "mssql",
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
    }
);
export const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connection established successfully.");
    }
    catch (err) {
        console.error("❌ Unable to connect to the database:", err);
        throw err;
    }
};
export const getSequelize = () => {
    if (!sequelize)
        throw new Error("❌ Sequelize not initialized — call connectDb() first.");
    return sequelize;
};
export const disconnectDb = async () => {
    if (sequelize) {
        await sequelize.close();
        console.log("🤝 Database connection closed.");
        sequelize = null;
    }
};
