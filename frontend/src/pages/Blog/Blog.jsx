import "./Blog.css"

const posts = [
  {
    id: 1,
    category: "Tips de Preparación",
    tag: "GUÍA",
    date: "10 MAR 2025",
    title: "Cómo hacer el espresso perfecto en casa",
    excerpt:
      "No necesitas una máquina de miles de dólares. Con la técnica correcta y un buen grano, tu cocina puede convertirse en tu cafetería favorita.",
    img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=700&q=80",
    readTime: "4 min",
  },
  {
    id: 2,
    category: "Noticias & Eventos",
    tag: "EVENTO",
    date: "25 FEB 2025",
    title: "Locafe en la Feria Nacional del Café 2025",
    excerpt:
      "Este año estuvimos presentes con nuestros mejores lotes de Colombia y Perú. Conoce lo que pasó y qué premios nos llevamos.",
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&q=80",
    readTime: "3 min",
  },
  {
    id: 3,
    category: "Tips de Preparación",
    tag: "TÉCNICA",
    date: "18 FEB 2025",
    title: "V60 vs Chemex: ¿Cuál método es para ti?",
    excerpt:
      "Ambos son métodos de filtrado por goteo, pero producen tazas completamente distintas. Te explicamos las diferencias clave para que elijas el tuyo.",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80",
    readTime: "5 min",
  },
  {
    id: 4,
    category: "Noticias & Eventos",
    tag: "NOTICIA",
    date: "5 FEB 2025",
    title: "Nuevo lote: Etiopía Yirgacheffe llegó a Locafe",
    excerpt:
      "Frutal, floral y con notas de jazmín. Nuestro lote más esperado del año ya está disponible en cantidades limitadas. No te quedes sin el tuyo.",
    img: "https://images.unsplash.com/photo-1501492673258-2af7d42e4efd?w=700&q=80",
    readTime: "2 min",
  },
  {
    id: 5,
    category: "Tips de Preparación",
    tag: "GUÍA",
    date: "20 ENE 2025",
    title: "La molienda importa más de lo que crees",
    excerpt:
      "El grosor del molido puede hacer o deshacer tu taza. Aprende a calibrar tu molino según el método que uses y eleva tu café al siguiente nivel.",
    img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700&q=80",
    readTime: "6 min",
  },
  {
    id: 6,
    category: "Noticias & Eventos",
    tag: "EVENTO",
    date: "8 ENE 2025",
    title: "Taller de Cata: próxima fecha disponible",
    excerpt:
      "Aprende a identificar sabores, acidez y cuerpo como un profesional. Nuestros talleres tienen cupos limitados. Reserva el tuyo antes de que se agoten.",
    img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=700&q=80",
    readTime: "2 min",
  },
]

const featured = posts[0]
const rest = posts.slice(1)

function Blog() {
  return (
    <div className="blog-page">

      {/* ── HEADER ── */}
      <div className="blog-header">
        <p className="blog-header-eyebrow">LOCAFE / BLOG</p>
        <h1 className="blog-header-title">
          CAFÉ, <span>CULTURA</span><br />& COMUNIDAD
        </h1>
        <p className="blog-header-sub">
          Tips de preparación, eventos y todo lo que necesitas saber sobre el mundo del café de especialidad.
        </p>
      </div>

      {/* ── FEATURED POST ── */}
      <div className="blog-featured-wrap">
        <div className="blog-featured">
          <div className="blog-featured-img">
            <img src={featured.img} alt={featured.title} />
            <span className="post-tag">{featured.tag}</span>
          </div>
          <div className="blog-featured-body">
            <p className="post-category">{featured.category}</p>
            <h2 className="post-title-large">{featured.title}</h2>
            <p className="post-excerpt">{featured.excerpt}</p>
            <div className="post-meta">
              <span>{featured.date}</span>
              <span className="dot">·</span>
              <span>{featured.readTime} lectura</span>
            </div>
            <button className="btn-primary blog-btn">Leer artículo →</button>
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="blog-grid-wrap">
        <div className="blog-grid">
          {rest.map((post) => (
            <article className="blog-card" key={post.id}>
              <div className="blog-card-img">
                <img src={post.img} alt={post.title} />
                <span className="post-tag">{post.tag}</span>
              </div>
              <div className="blog-card-body">
                <p className="post-category">{post.category}</p>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span>{post.date}</span>
                  <span className="dot">·</span>
                  <span>{post.readTime} lectura</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Blog
