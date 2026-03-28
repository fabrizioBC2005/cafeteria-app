const { Pool } = require("pg")
require("dotenv").config()

process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM recibido, cerrando pool...")
  pool.end(() => {
    console.log("Pool cerrado")
    process.exit(0)
  })
})

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
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
  // ← QUITA el process.exit(1) temporalmente para ver el error completo
})

module.exports = pool