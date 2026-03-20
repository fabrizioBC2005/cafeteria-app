const pool = require("./db")
const bcrypt = require("bcryptjs")

async function seed() {
  const client = await pool.connect()
  try {
    console.log("🌱 Ejecutando seed...")

    // Admin
    const hash = await bcrypt.hash("admin123", 10)
    await client.query(`
      INSERT INTO users (nombre, email, password, rol)
      VALUES ('Administrador', 'admin@locafe.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [hash])

    // Categorías
    await client.query(`
      INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES
        ('Todos',         'all',          'Todos los productos',         0),
        ('Espresso',      'espresso',     'Cafés de espresso',           1),
        ('Filtrado',      'filtrado',     'Métodos de filtrado',         2),
        ('Cold Brew',     'cold-brew',    'Café frío',                   3),
        ('Granos',        'granos',       'Granos para llevar',          4),
        ('Accesorios',    'accesorios',   'Equipos y accesorios',        5)
      ON CONFLICT (slug) DO NOTHING
    `)

    // Productos
    await client.query(`
      INSERT INTO productos (nombre, slug, descripcion, precio, stock, imagen, categoria_id, origen, peso, destacado) VALUES
        ('Espresso Intenso',    'espresso-intenso',   'Intenso y cremoso, con notas de chocolate oscuro.',         15.00, 50, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80', 2, 'Colombia',  '250g', true),
        ('Arabica Suave',       'arabica-suave',      'Suave y equilibrado, ideal para empezar el día.',           18.00, 40, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80', 4, 'Etiopía',   '250g', true),
        ('Mezcla de la Casa',   'mezcla-casa',        'Nuestra mezcla signature con tres orígenes.',               20.00, 35, 'https://images.unsplash.com/photo-1501492673258-2af7d42e4efd?w=500&q=80', 4, 'Blend',     '250g', true),
        ('Cold Brew Clásico',   'cold-brew-clasico',  '24 horas de extracción en frío. Suave y refrescante.',      16.00, 25, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80', 3, 'Colombia',  '500ml', false),
        ('V60 Etiopía',         'v60-etiopia',        'Preparación V60 con grano de Yirgacheffe. Floral y frutal.',22.00, 20, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&q=80', 2, 'Etiopía',   '200ml', false),
        ('Chemex Peruano',      'chemex-peruano',     'Café peruano preparado en Chemex. Limpio y delicado.',      20.00, 20, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80', 2, 'Perú',      '300ml', false)
      ON CONFLICT (slug) DO NOTHING
    `)

    console.log("✅ Seed completado")
  } catch (err) {
    console.error("❌ Error en seed:", err.message)
    throw err
  } finally {
    client.release()
    process.exit(0)
  }
}

seed()