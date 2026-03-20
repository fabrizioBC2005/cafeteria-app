const nodemailer = require("nodemailer")
require("dotenv").config()

/* ── TRANSPORTER ── */
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST   || "smtp.gmail.com",
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

// ── TEST DE CONEXIÓN ──
transporter.verify((error) => {
  if (error) {
    console.log("❌ Email config error:", error.message)
  } else {
    console.log("✅ Email listo para enviar")
  }
})

/* ── TEMPLATE BASE ── */
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#f5f5f5; font-family:'Helvetica Neue',Arial,sans-serif; color:#333; }
    .wrapper { max-width:600px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
    .header { background:#4e6b38; padding:32px 40px; text-align:center; }
    .header h1 { font-size:28px; letter-spacing:6px; color:#fff; font-weight:800; }
    .header span { color:#8BC34A; }
    .body { padding:36px 40px; }
    .greeting { font-size:20px; font-weight:700; color:#111; margin-bottom:12px; }
    .text { font-size:15px; color:#555; line-height:1.7; margin-bottom:20px; }
    .card { background:#f9f9f9; border:1px solid #e8e8e8; border-radius:6px; padding:24px; margin:24px 0; }
    .card-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee; font-size:14px; }
    .card-row:last-child { border-bottom:none; }
    .card-row span { color:#888; }
    .card-row strong { color:#111; }
    .highlight { color:#4e6b38; font-weight:700; }
    .btn { display:inline-block; background:#4e6b38; color:#fff !important; padding:14px 32px; border-radius:4px; text-decoration:none; font-size:14px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin:20px 0; }
    .footer { background:#f0f5ea; padding:24px 40px; text-align:center; font-size:12px; color:#888; border-top:1px solid #e0eccd; }
    .footer strong { color:#4e6b38; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>LOCA<span>CAFE</span></h1>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} <strong>Locafe</strong> · Lima, Perú</p>
      <p style="margin-top:6px">Este correo fue enviado automáticamente, por favor no respondas.</p>
    </div>
  </div>
</body>
</html>
`

/* ══════════════════════════════════════
   EMAILS
══════════════════════════════════════ */

// ── BIENVENIDA / REGISTRO ──
const sendWelcome = async ({ nombre, email }) => {
  await transporter.sendMail({
    from:    `"Locafe ☕" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: "¡Bienvenido a Locafe! ☕",
    html: baseTemplate(`
      <p class="greeting">¡Hola, ${nombre}! 👋</p>
      <p class="text">
        Tu cuenta en <strong>Locafe</strong> ha sido creada exitosamente.
        Ya puedes explorar nuestro menú, hacer reservas y unirte a Coffee Members.
      </p>
      <div class="card">
        <div class="card-row"><span>Nombre</span><strong>${nombre}</strong></div>
        <div class="card-row"><span>Email</span><strong>${email}</strong></div>
        <div class="card-row"><span>Estado</span><strong class="highlight">✓ Activo</strong></div>
      </div>
      <p class="text">
        Con tu cuenta puedes acumular puntos en cada compra, hacer reservas fácilmente
        y acceder a productos exclusivos.
      </p>
      <center><a href="${process.env.CLIENT_URL}" class="btn">Ir a Locafe</a></center>
    `)
  })
}

// ── CONFIRMACIÓN DE PEDIDO ──
const sendOrderConfirmation = async ({ nombre, email, pedido, items }) => {
  const itemsHtml = items.map(i => `
    <div class="card-row">
      <span>${i.nombre} × ${i.cantidad}</span>
      <strong>S/ ${parseFloat(i.subtotal).toFixed(2)}</strong>
    </div>
  `).join("")

  const metodoPago = {
    tarjeta:  "💳 Tarjeta de crédito/débito",
    yape:     "📱 Yape / Plin",
    efectivo: "💵 Efectivo en tienda",
  }[pedido.metodo_pago] || pedido.metodo_pago

  await transporter.sendMail({
    from:    `"Locafe ☕" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `Pedido confirmado ${pedido.numero} ✓`,
    html: baseTemplate(`
      <p class="greeting">¡Gracias por tu pedido, ${nombre}!</p>
      <p class="text">
        Hemos recibido tu pedido y ya lo estamos preparando con mucho cariño. ☕
      </p>
      <div class="card">
        <div class="card-row"><span>Número de orden</span><strong class="highlight">${pedido.numero}</strong></div>
        <div class="card-row"><span>Método de pago</span><strong>${metodoPago}</strong></div>
        ${pedido.direccion ? `<div class="card-row"><span>Dirección</span><strong>${pedido.direccion}</strong></div>` : ""}
        ${itemsHtml}
        <div class="card-row"><span>Delivery</span><strong>S/ ${parseFloat(pedido.delivery).toFixed(2)}</strong></div>
        <div class="card-row"><span>Total</span><strong class="highlight">S/ ${parseFloat(pedido.total).toFixed(2)}</strong></div>
      </div>
      <p class="text">
        Te notificaremos cuando tu pedido esté listo.
        ${pedido.metodo_pago === "efectivo" ? "Recuerda traer el monto exacto: <strong>S/ " + parseFloat(pedido.total).toFixed(2) + "</strong>" : ""}
      </p>
    `)
  })
}

// ── CONFIRMACIÓN DE RESERVA ──
const sendReservaConfirmation = async ({ nombre, email, reserva }) => {
  const ocasionEmoji = {
    casual:    "☕",
    romantico: "🌹",
    cumple:    "🎂",
    reunion:   "💼",
    amigos:    "🥂",
    familia:   "👨‍👩‍👧",
  }[reserva.ocasion] || "📅"

  await transporter.sendMail({
    from:    `"Locafe ☕" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `Reserva confirmada para el ${reserva.fecha} ✓`,
    html: baseTemplate(`
      <p class="greeting">${ocasionEmoji} ¡Reserva recibida, ${nombre}!</p>
      <p class="text">
        Hemos registrado tu reserva en Locafe. Te esperamos con los brazos abiertos.
      </p>
      <div class="card">
        <div class="card-row"><span>Fecha</span><strong class="highlight">${reserva.fecha}</strong></div>
        <div class="card-row"><span>Hora</span><strong class="highlight">${reserva.hora}</strong></div>
        <div class="card-row"><span>Mesa</span><strong>Mesa ${reserva.mesa_id} · Zona ${reserva.zona}</strong></div>
        <div class="card-row"><span>Personas</span><strong>${reserva.personas} personas</strong></div>
        <div class="card-row"><span>Ocasión</span><strong>${reserva.ocasion}</strong></div>
        ${reserva.notas ? `<div class="card-row"><span>Notas</span><strong>${reserva.notas}</strong></div>` : ""}
      </div>
      <p class="text">
        Recuerda que tu mesa se mantiene reservada por <strong>15 minutos</strong> desde la hora acordada.
        Si necesitas cancelar, hazlo con al menos 2 horas de anticipación.
      </p>
    `)
  })
}

// ── ACTIVACIÓN DE MEMBRESÍA ──
const sendMembresiaActivada = async ({ nombre, email, membresia }) => {
  const planEmoji = { classic:"🥉", gold:"🥇", black:"⚫" }[membresia.plan] || "☕"
  const descuento = { classic:"10%", gold:"15%", black:"20%" }[membresia.plan] || "10%"
  const cafes     = { classic:10,    gold:8,     black:5    }[membresia.plan] || 10

  await transporter.sendMail({
    from:    `"Locafe ☕" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `${planEmoji} ¡Membresía ${membresia.plan.toUpperCase()} activada!`,
    html: baseTemplate(`
      <p class="greeting">${planEmoji} ¡Bienvenido al club, ${nombre}!</p>
      <p class="text">
        Tu membresía <strong class="highlight">${membresia.plan.toUpperCase()}</strong> ha sido activada exitosamente.
        Ya puedes disfrutar de todos tus beneficios exclusivos.
      </p>
      <div class="card">
        <div class="card-row"><span>Plan</span><strong class="highlight">${membresia.plan.toUpperCase()}</strong></div>
        <div class="card-row"><span>Código de miembro</span><strong>${membresia.codigo}</strong></div>
        <div class="card-row"><span>Descuento</span><strong class="highlight">${descuento} en todos tus consumos</strong></div>
        <div class="card-row"><span>Café gratis</span><strong>Cada ${cafes} compras</strong></div>
        <div class="card-row"><span>Válido hasta</span><strong>${membresia.fecha_fin}</strong></div>
      </div>
      <p class="text">
        Presenta tu código <strong>${membresia.codigo}</strong> o tu QR en caja para aplicar tus beneficios.
      </p>
      <center><a href="${process.env.CLIENT_URL}/members" class="btn">Ver mi tarjeta digital</a></center>
    `)
  })
}

module.exports = {
  sendWelcome,
  sendOrderConfirmation,
  sendReservaConfirmation,
  sendMembresiaActivada,
}