const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }  // ← necesario en Railway
      }
    : {
        host:     process.env.DB_HOST     || "localhost",
        port:     process.env.DB_PORT     || 5432,
        database: process.env.DB_NAME     || "locafe_db",
        user:     process.env.DB_USER     || "postgres",
        password: process.env.DB_PASSWORD || "",
      }
)

pool.on("connect", () => console.log("✅ PostgreSQL conectado"))
pool.on("error", (err) => {
  console.error("❌ Error en PostgreSQL:", err.message)
  process.exit(1)
})

module.exports = pool