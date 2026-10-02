 const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Manish@123",
    database: "food_delivery",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((error, connection) => {
    if (error) {
        console.error("❌ MySQL Connection Failed:");
        console.error(error.message);
        return;
    }

    console.log("✅ MySQL Connected Successfully");
    connection.release();
});

module.exports = db;