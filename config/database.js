import { Sequelize } from 'sequelize';
let sequelize;

export const initDb = async () => {
    if (sequelize) return sequelize;
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 1433),
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: false
            }
        },
        pool: {
            max: Number(process.env.DB_POOL_MAX || 10),
            min: Number(process.env.DB_POOL_MIN || 0),
            acquire: Number(process.env.DB_POOL_ACQUIRE || 30000),
            idle: Number(process.env.DB_POOL_IDLE || 10000)
        },
        logging: false,
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });
    await sequelize.authenticate();
    console.log('✅ Connected to MSSQL via Sequelize');
    return sequelize;
};

export const getSequelize = () => {
    if (!sequelize) throw new Error('Sequelize not initialized — call initDb() first.');
    return sequelize;
};
