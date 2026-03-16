import "./Galeria.css"

const photos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    label: "El local",
    size: "large",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80",
    label: "Espresso",
    size: "small",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    label: "Arabica Suave",
    size: "small",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
    label: "Nuestro equipo",
    size: "medium",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1501492673258-2af7d42e4efd?w=600&q=80",
    label: "Granos de origen",
    size: "small",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
    label: "Proceso de tostado",
    size: "medium",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
    label: "Feria del Café 2025",
    size: "small",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?w=800&q=80",
    label: "V60 en preparación",
    size: "large",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    label: "Latte art",
    size: "small",
  },
]

function Galeria() {
  return (
    <div className="galeria-page">

      {/* ── HEADER ── */}
      <div className="galeria-header">
        <p className="galeria-eyebrow">LOCAFE / GALERÍA</p>
        <h1 className="galeria-title">
          CADA TAZA<br />CUENTA UNA <span>HISTORIA</span>
        </h1>
        <p className="galeria-sub">
          Una mirada a nuestro local, nuestros granos y las personas detrás de cada sorbo.
        </p>
      </div>

      {/* ── GRID MASONRY ── */}
      <div className="galeria-wrap">
        <div className="galeria-grid">
          {photos.map((photo) => (
            <div className={`galeria-item galeria-item--${photo.size}`} key={photo.id}>
              <img src={photo.src} alt={photo.label} />
              <div className="galeria-overlay">
                <span className="galeria-label">{photo.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="galeria-cta-wrap">
        <p className="galeria-cta-text">¿Quieres visitar el local?</p>
        <button className="btn-primary galeria-cta-btn">Hacer una reserva →</button>
      </div>

    </div>
  )
}

export default Galeria
