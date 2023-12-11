// Access the drivers
const sql = require("mssql");
require("dotenv").config();

//Config for your database
const config = {
    user: process.env.DB_USER, // better stored in an app setting such as process.env.DB_USER
    password: process.env.DB_PASS, // better stored in an app setting such as process.env.DB_PASSWORD
    server: process.env.DB_SERVER, // better stored in an app setting such as process.env.DB_SERVER
    port: Number(process.env.PORTSQL), // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: process.env.DB_DATABASE, // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: "default",
    },
    options: {
        encrypt: true,
        trustServerCertificate: true,
        cryptoCredentialsDetails: {
            minVersion: "TLSv1",
        },
    },
};

async function connectDB() {
    const pool = new sql.ConnectionPool(config);

    try {
        await pool.connect();
        console.log("Connected to DB");

        return pool;
    } catch (err) {
        console.log("Failed to connect to DB", err);

        return err;
    }
}

exports.Execute = async (query) => {
    const DB = await connectDB();
    try {
        // Thực hiện các thao tác với cơ sở dữ liệu ở đây
        const result = await DB.request().query(query);
        await DB.close();

        return result;
    } catch (error) {
        console.error("Lỗi khi kết nối đến cơ sở dữ liệu MSSQL:", error);
    } finally {
        await DB.close();
    }
};