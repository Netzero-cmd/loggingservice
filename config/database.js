import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

let sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 1433),
        dialect: "mssql",
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        },
        pool: {
            max: Number(process.env.DB_POOL_MAX || 10),
            min: Number(process.env.DB_POOL_MIN || 0),
            acquire: Number(process.env.DB_POOL_ACQUIRE || 30000),
            idle: Number(process.env.DB_POOL_IDLE || 10000),
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
        console.log("🔌 Database connection closed.");
        sequelize = null;
    }
};
