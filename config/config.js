import { Sequelize } from "sequelize";
import tedious from "tedious";

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    port: 1433,
    dialect: 'mssql',
    dialectModule: tedious,
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate()
            .then(() => console.log('Connection successful!'))
            .catch(err => console.error('Connection failed connection in db:', err));
    }
    catch (error) {
        console.log(`Error in db function:${error}`);
        process.exit(1);
    }
};
const disConnectDB = async () => {
    try {
        await sequelize.close();
        console.log('Database disconnected...');
    }
    catch (error) {
        console.log(`Error:${error}`);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    await disConnectDB();
    process.exit(0);
});


export default sequelize;
export { connectDB };
