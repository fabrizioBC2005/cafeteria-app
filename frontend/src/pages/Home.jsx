import "./Home.css"

function Home() {
  return (
    <>
      {/* SECCIÓN HERO */}
      <section className="home">
        <div className="home-content">
          <h1>CAFÉ DE ESPECIALIDAD</h1>
          <p>
            Descubre nuestros granos seleccionados, tostados con tecnología
            moderna para ofrecer la mejor experiencia en cada taza.
          </p>
          <div className="home-buttons">
            <button className="btn-primary">Comprar café</button>
            <button className="btn-secondary">Conocer más</button>
          </div>
        </div>
      </section>

      {/* SECCIÓN PRODUCTOS */}
      <section className="section-container">
        <h2 className="section-title">Nuestros Productos</h2>
        <div className="products-grid">
          <div className="product-card">
            <img src="url-cafe-1.jpg" alt="Café" />
            <h3>Espresso Intenso</h3>
            <p>$15.00</p>
            <button className="btn-primary">Añadir</button>
          </div>
          <div className="product-card">
            <img src="url-cafe-2.jpg" alt="Café" />
            <h3>Arabica Suave</h3>
            <p>$18.00</p>
            <button className="btn-primary">Añadir</button>
          </div>
          <div className="product-card">
            <img src="url-cafe-3.jpg" alt="Café" />
            <h3>Mezcla de la Casa</h3>
            <p>$20.00</p>
            <button className="btn-primary">Añadir</button>
          </div>
        </div>
      </section>

      {/* SECCIÓN QUIÉNES SOMOS */}
      <section className="section-container" style={{background: '#121212'}}>
        <div className="about-section">
          <div className="about-image">
            <img src="imagen-barista.jpg" alt="Nuestro Barista" />
          </div>
          <div className="about-text">
            <h2 style={{color: '#8BC34A'}}>Quiénes Somos</h2>
            <p>Somos apasionados del café que buscan conectar al productor directamente contigo, eliminando intermediarios y garantizando frescura.</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN NUESTRA HISTORIA E INFO EXTRA */}
      <section className="section-container">
        <h2 className="section-title">Nuestra Historia</h2>
        <p style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
          Fundada en 2020, nuestra tostaduría nació en un pequeño garaje con un sueño: 
          traer los mejores granos del mundo a tu mesa...
        </p>
        
        <div className="info-grid">
          <div className="product-card">
            <h3>Sostenibilidad</h3>
            <p>Apoyamos prácticas de cultivo orgánico y comercio justo.</p>
          </div>
          <div className="product-card">
            <h3>Tostado Local</h3>
            <p>Tostamos lotes pequeños cada semana para máxima calidad.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home