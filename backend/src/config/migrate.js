const pool = require("./db")

async function migrate() {
  const client = await pool.connect()
  try {
    console.log("🔄 Ejecutando migraciones...")

    await client.query(`
      -- ── USUARIOS ──
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        nombre      VARCHAR(100) NOT NULL,
        email       VARCHAR(150) UNIQUE NOT NULL,
        password    VARCHAR(255),
        telefono    VARCHAR(20),
        rol         VARCHAR(20) DEFAULT 'cliente' CHECK (rol IN ('cliente','admin','staff')),
        google_id   VARCHAR(100),
        avatar      TEXT,
        activo      BOOLEAN DEFAULT true,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );

      -- ── CATEGORÍAS ──
      CREATE TABLE IF NOT EXISTS categorias (
        id          SERIAL PRIMARY KEY,
        nombre      VARCHAR(80) NOT NULL,
        slug        VARCHAR(80) UNIQUE NOT NULL,
        descripcion TEXT,
        orden       INT DEFAULT 0,
        activo      BOOLEAN DEFAULT true,
        created_at  TIMESTAMP DEFAULT NOW()
      );

      -- ── PRODUCTOS ──
      CREATE TABLE IF NOT EXISTS productos (
        id            SERIAL PRIMARY KEY,
        nombre        VARCHAR(150) NOT NULL,
        slug          VARCHAR(150) UNIQUE NOT NULL,
        descripcion   TEXT,
        precio        DECIMAL(10,2) NOT NULL,
        precio_oferta DECIMAL(10,2),
        stock         INT DEFAULT 0,
        imagen        TEXT,
        categoria_id  INT REFERENCES categorias(id) ON DELETE SET NULL,
        origen        VARCHAR(100),
        peso          VARCHAR(50),
        destacado     BOOLEAN DEFAULT false,
        activo        BOOLEAN DEFAULT true,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      );

      -- ── PEDIDOS ──
      CREATE TABLE IF NOT EXISTS pedidos (
        id            SERIAL PRIMARY KEY,
        user_id       INT REFERENCES users(id) ON DELETE SET NULL,
        numero        VARCHAR(20) UNIQUE NOT NULL,
        estado        VARCHAR(30) DEFAULT 'pendiente'
                      CHECK (estado IN ('pendiente','confirmado','preparando','listo','entregado','cancelado')),
        metodo_pago   VARCHAR(30) CHECK (metodo_pago IN ('tarjeta','yape','efectivo')),
        subtotal      DECIMAL(10,2) NOT NULL,
        delivery      DECIMAL(10,2) DEFAULT 0,
        total         DECIMAL(10,2) NOT NULL,
        nombre_cliente VARCHAR(100),
        telefono_cliente VARCHAR(20),
        direccion     TEXT,
        referencia    TEXT,
        notas         TEXT,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      );

      -- ── DETALLE PEDIDOS ──
      CREATE TABLE IF NOT EXISTS pedido_items (
        id          SERIAL PRIMARY KEY,
        pedido_id   INT REFERENCES pedidos(id) ON DELETE CASCADE,
        producto_id INT REFERENCES productos(id) ON DELETE SET NULL,
        nombre      VARCHAR(150) NOT NULL,
        precio      DECIMAL(10,2) NOT NULL,
        cantidad    INT NOT NULL,
        subtotal    DECIMAL(10,2) NOT NULL
      );

      -- ── RESERVAS ──
      CREATE TABLE IF NOT EXISTS reservas (
        id          SERIAL PRIMARY KEY,
        user_id     INT REFERENCES users(id) ON DELETE SET NULL,
        nombre      VARCHAR(100) NOT NULL,
        email       VARCHAR(150) NOT NULL,
        telefono    VARCHAR(20) NOT NULL,
        fecha       DATE NOT NULL,
        hora        TIME NOT NULL,
        personas    INT NOT NULL DEFAULT 2,
        mesa_id     INT NOT NULL,
        zona        VARCHAR(50),
        ocasion     VARCHAR(50),
        notas       TEXT,
        estado      VARCHAR(20) DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente','confirmada','cancelada','completada')),
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );

      -- ── MEMBRESÍAS ──
      CREATE TABLE IF NOT EXISTS membresias (
        id            SERIAL PRIMARY KEY,
        user_id       INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        plan          VARCHAR(20) DEFAULT 'classic'
                      CHECK (plan IN ('classic','gold','black')),
        codigo        VARCHAR(30) UNIQUE NOT NULL,
        qr_url        TEXT,
        puntos        INT DEFAULT 0,
        compras_count INT DEFAULT 0,
        activo        BOOLEAN DEFAULT true,
        fecha_inicio  DATE DEFAULT CURRENT_DATE,
        fecha_fin     DATE,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      );

      -- ── ÍNDICES ──
      CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
      CREATE INDEX IF NOT EXISTS idx_pedidos_user ON pedidos(user_id);
      CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
      CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
      CREATE INDEX IF NOT EXISTS idx_reservas_mesa ON reservas(mesa_id, fecha);
      CREATE INDEX IF NOT EXISTS idx_membresias_user ON membresias(user_id);
    `)

    console.log("✅ Migraciones completadas")
  } catch (err) {
    console.error("❌ Error en migración:", err.message)
    throw err
  } finally {
    client.release()
    process.exit(0)
  }
}

migrate()