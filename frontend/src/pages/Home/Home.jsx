import "./Home.css"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <section className="home">
        <div className="home-content">
          <h1>CAFE DE<br /><span>ESPECIALIDAD</span></h1>
          <p>
            Descubre nuestros granos seleccionados, tostados con amor
            para ofrecer la mejor experiencia en cada taza.
          </p>
          <div className="home-buttons">
            <button className="btn-primary" onClick={() => navigate("/menu")}>
              Ver Catalogo
            </button>
            <button className="btn-secondary" onClick={() => navigate("/blog")}>
              Conocer mas
            </button>
          </div>
        </div>
      </section>

      <section className="section-container">
        <h2 className="section-title">Nuestros Productos</h2>
        <div className="products-grid">
          {[
            { img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80", name: "Espresso Intenso",   price: "$15.00" },
            { img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80", name: "Arabica Suave",      price: "$18.00" },
            { img: "https://images.unsplash.com/photo-1501492673258-2af7d42e4efd?w=500&q=80", name: "Mezcla de la Casa",  price: "$20.00" },
          ].map((p) => (
            <div className="product-card" key={p.name}>
              <img src={p.img} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.price}</p>
              <button className="btn-primary" onClick={() => navigate("/menu")}>
                Ver mas
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container dark">
        <div className="about-section">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80" alt="Nuestro Barista" />
          </div>
          <div className="about-text">
            <h2>Quienes Somos</h2>
            <p>
              Somos apasionados del cafe que buscan conectar al productor
              directamente contigo, eliminando intermediarios y garantizando
              frescura en cada bolsa que llega a tus manos.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container">
        <h2 className="section-title">Nuestra Historia</h2>
        <p className="history-text">
          Fundada en 2020, nuestra tostaduria nacio en un pequeno garaje con
          un sueno: traer los mejores granos del mundo a tu mesa. Hoy tostamos
          lotes de toda America Latina con la misma pasion del primer dia.
        </p>
        <div className="info-grid">
          <div className="info-card">
            <h3>Sostenibilidad</h3>
            <p>Apoyamos practicas de cultivo organico y comercio justo en cada origen.</p>
          </div>
          <div className="info-card">
            <h3>Tostado Local</h3>
            <p>Tostamos lotes pequenos cada semana para garantizar maxima frescura.</p>
          </div>
          <div className="info-card">
            <h3>Origen Directo</h3>
            <p>Trabajamos directamente con productores en Colombia, Peru y Etiopia.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home