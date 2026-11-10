/* ============================================================
   HEY BLESS! — TUS BEATS
   Para agregar un beat: copia un bloque { ... }, pégalo arriba
   (el primero es el DESTACADO de la portada) y cambia los datos.

   id:        nombre corto sin espacios ni tildes. DEBE ser igual al nombre
              de la carpeta del beat en Google Drive (HEY BLESS ENTREGAS/<id>)
   audio:     preview MP3 con tag, dentro de la carpeta audio/
   portada:   imagen cuadrada en img/ (opcional, si no hay se genera una)
   vendido:   true cuando alguien compre la EXCLUSIVA (se bloquea la venta)
   ============================================================ */
window.BEATS = [
  {
    id: "gatas-sandungueras",
    nombre: "Gatas Sandungueras",
    bpm: 95,
    tono: "",
    genero: "Reggaetón",
    tags: ["sandungueo", "perreo"],
    audio: "audio/beats/gatas-sandungueras.mp3",
    portada: "",
    fecha: "2026-11-10",
    vendido: false
  },
  {
    id: "como-antes",
    nombre: "Como Antes",
    bpm: 86,
    tono: "A menor",
    genero: "Reggaetón",
    tags: [],
    audio: "audio/beats/como-antes.mp3",
    portada: "",
    fecha: "2026-11-09",
    vendido: false
  },
  {
    id: "santa-pero-diabla",
    nombre: "Santa Pero Diabla",
    bpm: 80,
    tono: "",
    genero: "Reggaetón",
    tags: [],
    audio: "audio/beats/santa-pero-diabla.mp3",
    portada: "",
    fecha: "2026-11-08",
    vendido: false
  },
  {
    id: "romantikstyle",
    nombre: "Romantikstyle",
    bpm: 75,
    tono: "",
    genero: "Reggaetón",
    tags: ["romántico"],
    audio: "audio/beats/romantikstyle.mp3",
    portada: "",
    fecha: "2026-11-07",
    vendido: false
  }
];
