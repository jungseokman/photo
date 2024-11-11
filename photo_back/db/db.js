const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

let connection;

async function initializeDB() {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: "utf8mb4",
      });
      console.log("🍀 Mysql Database Connected");
    } catch (error) {
      console.error("Database Connection Failed:", error);
    }
  }
  return connection;
}

// 연결 객체를 모듈에서 직접 접근 가능하도록 export
function getConnection() {
  if (!connection) {
    throw new Error("Database not initialized. Call initializeDB first.");
  }
  return connection;
}

module.exports = { initializeDB, getConnection };
