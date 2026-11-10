/* ============================================================
   HEY BLESS! — CONFIGURACIÓN GENERAL
   Aquí cambias precios, pagos, redes y textos de servicios.
   No necesitas tocar index.html.
   ============================================================ */
window.CONFIG = {

  /* ---------- PAGOS ---------- */

  // Entrega automática (ver GUIA-ENTREGA-AUTOMATICA.txt).
  // Vacío = modo manual (el cliente te avisa por Instagram).
  // Con la URL = el pedido te llega por correo con un botón "APROBAR Y ENVIAR".
  backend: "https://script.google.com/macros/s/AKfycbx1FtCSJnPk4bjAwgb4NdcUsAhXYqoTyePgLf5YIXghhJSfFz5Cg3ZBhDx_0oDfWQc/exec",          // URL de tu Apps Script (termina en /exec)
  paypalClientId: "",   // déjalo vacío (no se usa)

  // PayPal.me (respaldo / modo manual)
  paypal: "https://paypal.me/HEYBLESS",

  // Comisión de PayPal que paga el CLIENTE (solo se muestra al momento de pagar)
  // Total = (precio + fija) / (1 - porcentaje)
  comisionPorcentaje: 0.054, // 5.4%
  comisionFija: 0.30,        // $0.30

  // Tipo de cambio (solo se muestra al pagar, como referencia en soles).
  // Se busca en tiempo real. Si falla, se usa este.
  tipoCambioRespaldo: 3.80,

  /* ---------- REDES Y CONTACTO ---------- */
  instagram: "prod.bless",
  whatsapp: "51980683847",   // con código de país, sin + ni espacios
  spotify: "https://open.spotify.com/intl-es/artist/26WHBQSJBRXWd3pRFQtYVy",
  youtube: "https://www.youtube.com/@HEYBLESS",

  /* ---------- LICENCIAS (tu tarifario) ----------
     archivos: lo que se entrega automático ("mp3", "wav")
     stems: true  -> el cliente te avisa por IG para recibir los stems   */
  licencias: [
    {
      id: "basica", nombre: "Licencia Básica", precio: 25, archivos: ["mp3"],
      incluye: ["Solo MP3", "Grabar y subir a YouTube o SoundCloud", "Hasta 2.000 streams", "Dar crédito a \"HEY BLESS!\"", "Licencia de uso (renovable)", "No monetizable"],
      ideal: "Demo o testear"
    },
    {
      id: "premium", nombre: "Licencia Premium", precio: 40, archivos: ["mp3", "wav"],
      incluye: ["MP3 + WAV", "Subir a Spotify, Apple, etc.", "Hasta 10.000 streams", "Dar crédito a \"HEY BLESS!\"", "Licencia de uso (renovable)", "Monetizable"],
      ideal: "Single formal"
    },
    {
      id: "premiumplus", nombre: "Licencia Premium+", precio: 70, archivos: ["mp3", "wav"], stems: true,
      incluye: ["MP3 + WAV", "Stems (multitrack)", "Subir a Spotify, Apple, etc.", "Hasta 10.000 streams", "Dar crédito a \"HEY BLESS!\"", "Licencia de uso (renovable)", "Monetizable"],
      ideal: "Mix / Master"
    },
    {
      id: "exclusiva", nombre: "Exclusiva", precio: 130, archivos: ["mp3", "wav"], stems: true, exclusiva: true,
      incluye: ["MP3 + WAV", "Stems (multitrack)", "Streams ilimitados en todas las plataformas", "Única venta", "Monetizable", "Content ID", "Licencia de por vida", "Licencia de uso exclusivo"],
      ideal: "Proyectos sólidos, labels / managers"
    }
  ],

  /* ---------- PROMO (se muestra en Licencias y al comprar la Exclusiva) ---------- */
  promo: {
    activa: true,                      // false para apagarla
    titulo: "2x1 en Exclusivas",
    lema: "Pide una exclusiva y el segundo plato va por cuenta de la casa.",
    detalle: "Compra la Licencia Exclusiva de un beat y elige otro beat del catálogo, también en exclusiva, gratis."
  },

  /* ---------- RESEÑAS ----------
     foto: imagen cuadrada en img/resenas/ (si está vacía se muestran sus iniciales)
     verificado: true si tiene el check azul en Instagram                     */
  resenas: [
    { nombre: "Bastti", usuario: "basttimusic", foto: "", verificado: true,
      texto: "Trabajo con HEY BLESS! desde 2023 y su ética de trabajo es impecable. Tiene un sonido único, pero también una versatilidad increíble para adaptarse a distintos géneros y a la visión de cada artista. Hemos trabajado juntos en pop, reguetón, house y R&B, incluyendo un álbum completo en el que captó perfectamente la esencia que buscaba. Nuestra colaboración ha dado como resultado un catálogo que supera los 2 millones de reproducciones. Sin duda, un productor con muchísimo talento, creatividad y compromiso con la calidad." },
    { nombre: "Renzo Rettis", usuario: "rettisz", foto: "", verificado: false,
      texto: "Bastante profesional y preciso con los tiempos. Trabajar con HEY BLESS! me da una confianza que, aunque no lo debería, es rara de hallar dentro del panorama musical." },
    { nombre: "Vincez", usuario: "vincez", foto: "", verificado: true,
      texto: "Siempre un gusto trabajar contigo, rey. Profesional 100% y entregas el tema a tiempo. ¡El beat siempre exótico!" },
    { nombre: "Teibe", usuario: "elteibe", foto: "", verificado: false,
      texto: "Eres el mejor, hermanito. Agradecido con Dios por haberme mostrado tu perfil de IG y haberte conocido como persona 🫂🥷" }
  ],

  /* ---------- BEATS PERSONALIZADOS ---------- */
  personalizado: {
    desde: 150,
    incluye: ["MP3 / WAV / Stems", "Streams ilimitados", "Monetizable", "Content ID", "Licencia de por vida", "Licencia de uso exclusivo", "2 a 3 revisiones"]
  },

  // Trabajos tuyos (se muestran debajo de "Incluye" en Beats Personalizados)
  // portada: opcional, imagen cuadrada en img/trabajos/ (ej. "img/trabajos/no-molestar.jpg")
  trabajos: [
    { titulo: "No Molestar", artista: "Darcell ft. HEY BLESS!", portada: "img/trabajos/no-molestar.jpg", audio: "audio/trabajos/no-molestar.mp3" },
    { titulo: "Ac-Sina", artista: "Teibe ft. HEY BLESS!", portada: "img/trabajos/ac-sina.jpg", audio: "audio/trabajos/ac-sina.mp3" },
    { titulo: "Cuando y Dónde", artista: "Hans Bent ft. HEY BLESS!", portada: "img/trabajos/cuando-y-donde.jpg", audio: "audio/trabajos/cuando-y-donde.mp3" },
    { titulo: "Ojos de Miel", artista: "Bastti", portada: "img/trabajos/ojos-de-miel.jpg", audio: "audio/trabajos/ojos-de-miel.mp3" }
  ],

  /* ---------- MIX & MASTER ---------- */
  mixmaster: {
    desde: 50, // pon un número para mostrar "Desde $50"; null = "Cotiza tu proyecto"
    descripcion: "Tu canción con el balance, la claridad y el volumen de un lanzamiento profesional. El precio puede variar según la cantidad de artistas o voces adicionales.",
    incluye: ["Mezcla & master de 1 canción", "Hasta 3 revisiones", "Entrega en 2 a 3 días", "Master en WAV + FLAC", "Envío por WeTransfer o correo", "Crédito: Beat & Mix HEY BLESS!"],
    // Ejemplos de tus mezclas (se muestran debajo de "Incluye")
    trabajos: [
      { titulo: "Awa de Calzón", artista: "Tnz & HEY BLESS!", portada: "img/trabajos/awa-de-calzon.jpg", audio: "audio/trabajos/awa-de-calzon.mp3" },
      { titulo: "SLID3", artista: "OMNIR3D", portada: "img/trabajos/slid3.jpg", audio: "audio/trabajos/slid3.mp3" },
      { titulo: "Solo una vez", artista: "Greidy Pierre From Callao", portada: "img/trabajos/solo-una-vez.jpg", audio: "audio/trabajos/solo-una-vez.mp3" },
      { titulo: "No Molestar", artista: "Darcell ft. HEY BLESS!", portada: "img/trabajos/no-molestar.jpg", audio: "audio/trabajos/no-molestar.mp3" }
    ]
  }
};
