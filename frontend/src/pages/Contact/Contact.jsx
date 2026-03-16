import { useState } from "react"
import "./Contact.css"

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="contact-page">
      {/* HEADER */}
      <div className="contact-header">
        <p className="contact-eyebrow">— Escríbenos —</p>
        <h1 className="contact-title">Contacto</h1>
        <p className="contact-subtitle">
          ¿Tienes preguntas sobre nuestros productos o quieres hacer un
          pedido especial? Estamos aquí para ayudarte.
        </p>
      </div>

      <div className="contact-wrapper">
        {/* INFO */}
        <div className="contact-info">
          {[
            { icon: "📍", title: "Ubicación",  lines: ["Calle del Café 42, Ciudad"] },
            { icon: "🕐", title: "Horario",    lines: ["Lun – Sáb: 8:00 – 20:00", "Dom: 9:00 – 15:00"] },
            { icon: "✉️", title: "Email",      lines: ["hola@cafeorigen.com"] },
            { icon: "📞", title: "Teléfono",   lines: ["+51 999 123 456"] },
          ].map(({ icon, title, lines }) => (
            <div className="info-block" key={title}>
              <span className="info-icon">{icon}</span>
              <div>
                <h4>{title}</h4>
                {lines.map((l) => <p key={l}>{l}</p>)}
              </div>
            </div>
          ))}
        </div>

        {/* FORMULARIO */}
        <div className="contact-form-wrapper">
          {sent ? (
            <div className="form-success">
              <span className="success-icon">✓</span>
              <h3>¡Mensaje enviado!</h3>
              <p>Te responderemos en menos de 24 horas.</p>
              <button className="btn-outline" onClick={() => setSent(false)}>
                Enviar otro
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name" name="name" type="text"
                  placeholder="Tu nombre completo"
                  value={form.name} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo</label>
                <input
                  id="email" name="email" type="email"
                  placeholder="tu@email.com"
                  value={form.email} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message" name="message" rows={5}
                  placeholder="¿En qué podemos ayudarte?"
                  value={form.message} onChange={handleChange} required
                />
              </div>
              <button type="submit" className="btn-submit">
                Enviar mensaje →
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

export default Contact