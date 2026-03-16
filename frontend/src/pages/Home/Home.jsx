import "./Home.css"

function Home({ setPage }) {
  return (
    <>
      {/* ── HERO ── */}
      <section className="home">
        <div className="home-content">
          <h1>CAFÉ DE<br /><span>ESPECIALIDAD</span></h1>
          <p>
            Descubre nuestros granos seleccionados, tostados con amor
            para ofrecer la mejor experiencia en cada taza.
          </p>
          <div className="home-buttons">
            <button className="btn-primary" onClick={() => setPage("menu")}>
              Ver Catálogo
            </button>
            <button className="btn-secondary" onClick={() => setPage("blog")}>
              Conocer más
            </button>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ── */}
      <section className="section-container">
        <h2 className="section-title">Nuestros Productos</h2>
        <div className="products-grid">
          {[
            {
              img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80",
              name: "Espresso Intenso",
              price: "$15.00",
            },
            {
              img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80",
              name: "Arabica Suave",
              price: "$18.00",
            },
            {
              img: "https://images.unsplash.com/photo-1501492673258-2af7d42e4efd?w=500&q=80",
              name: "Mezcla de la Casa",
              price: "$20.00",
            },
          ].map((p) => (
            <div className="product-card" key={p.name}>
              <img src={p.img} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.price}</p>
              <button className="btn-primary" onClick={() => setPage("menu")}>
                Ver más
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ── */}
      <section className="section-container dark">
        <div className="about-section">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80"
              alt="Nuestro Barista"
            />
          </div>
          <div className="about-text">
            <h2>Quiénes Somos</h2>
            <p>
              Somos apasionados del café que buscan conectar al productor
              directamente contigo, eliminando intermediarios y garantizando
              frescura en cada bolsa que llega a tus manos.
            </p>
          </div>
        </div>
      </section>

      {/* ── HISTORIA ── */}
      <section className="section-container">
        <h2 className="section-title">Nuestra Historia</h2>
        <p className="history-text">
          Fundada en 2020, nuestra tostaduría nació en un pequeño garaje con
          un sueño: traer los mejores granos del mundo a tu mesa. Hoy tostamos
          lotes de toda América Latina con la misma pasión del primer día.
        </p>
        <div className="info-grid">
          <div className="info-card">
            <h3>🌱 Sostenibilidad</h3>
            <p>Apoyamos prácticas de cultivo orgánico y comercio justo en cada origen.</p>
          </div>
          <div className="info-card">
            <h3>🔥 Tostado Local</h3>
            <p>Tostamos lotes pequeños cada semana para garantizar máxima frescura.</p>
          </div>
          <div className="info-card">
            <h3>✈️ Origen Directo</h3>
            <p>Trabajamos directamente con productores en Colombia, Perú y Etiopía.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home