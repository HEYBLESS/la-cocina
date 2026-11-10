/* ============================================================
   HEY BLESS! — TUS DRUM KITS
   Para agregar un kit copia un bloque { ... } y cambia los datos.

   id:          nombre corto sin espacios ni tildes. DEBE ser igual al nombre
                de la carpeta del kit en Google Drive (HEY BLESS ENTREGAS/kits/<id>)
                donde pones el .zip o .rar del kit.
   precioSoles: opcional, se muestra al pagar ("¿en soles? S/ 20 por Instagram")
   demos:       previews para escuchar; "grupo" los ordena
   ============================================================ */
window.KITS = [
  {
    id: "la-sazon-drumkit",
    nombre: "La Sazón Drumkit",
    precio: 5,
    precioSoles: 20,
    portada: "img/kits/la-sazon-portada.jpg",
    artes: ["img/kits/la-sazon-contraportada.jpg"],
    fecha: "2026-11-10",
    descripcion: "200+ sonidos sazonados por mí, pensados para Reggaetón Old School y New School, Suavetón, Afrobeat y Dancehall.",
    preparacion: "Solo arrastra a tu DAW de confianza ¡y listo! Todos los sonidos se ajustan al BPM de tu proyecto. Bon appetit 🤌",
    referentes: ["Ñengo Flow", "Farruko", "Tainy", "Bad Bunny", "Feid", "Wisin y Yandel", "Reggaetón Under actual"],
    contenido: [
      { tipo: "Drumloops", cantidad: 44 },
      { tipo: "Percloops", cantidad: 23 },
      { tipo: "Toploops", cantidad: 12 },
      { tipo: "Fills", cantidad: 22 },
      { tipo: "FXs", cantidad: 17 },
      { tipo: "Hi-hats", cantidad: 9 },
      { tipo: "Kicks", cantidad: 23 },
      { tipo: "Percs", cantidad: 19 },
      { tipo: "Snares", cantidad: 24 },
      { tipo: "Vox", cantidad: 6 },
      { tipo: "Kick vox", cantidad: 5 }
    ],
    specs: [
      ["Formato", "WAV"],
      ["Peso", "197 MB"],
      ["Géneros", "Reggaetón, Suavetón, Afrobeat, Dancehall"],
      ["Compatible", "FL Studio, Ableton, Logic y cualquier DAW"],
      ["Uso", "100% libre de regalías"]
    ],
    demos: [
      { grupo: "Drumloops", titulo: "Con Clap Es Todo 2", detalle: "Drumloop", audio: "audio/kit/drumloop-con-clap-es-todo-2.mp3" },
      { grupo: "Drumloops", titulo: "Tiger", detalle: "Drumloop", audio: "audio/kit/drumloop-tiger.mp3" },
      { grupo: "Drumloops", titulo: "Suavetón", detalle: "Drumloop", audio: "audio/kit/drumloop-suaveton.mp3" },
      { grupo: "Percloops · Toploops · Kick vox", titulo: "Bachatón", detalle: "Percloop", audio: "audio/kit/percloop-bachaton.mp3" },
      { grupo: "Percloops · Toploops · Kick vox", titulo: "Tops", detalle: "Toploop", audio: "audio/kit/toploop-tops.mp3" },
      { grupo: "Percloops · Toploops · Kick vox", titulo: "Contact", detalle: "Kick vox", audio: "audio/kit/kickvox-contact.mp3" },
      { grupo: "Fills", titulo: "WY", detalle: "Fill", audio: "audio/kit/fill-wy.mp3" },
      { grupo: "Fills", titulo: "Data", detalle: "Fill", audio: "audio/kit/fill-data.mp3" },
      { grupo: "Fills", titulo: "Flash", detalle: "Fill", audio: "audio/kit/fill-flash.mp3" },
      { grupo: "FXs", titulo: "Aire", detalle: "FX", audio: "audio/kit/fx-aire.mp3" },
      { grupo: "FXs", titulo: "Ray", detalle: "FX", audio: "audio/kit/fx-ray.mp3" },
      { grupo: "FXs", titulo: "Choke", detalle: "FX", audio: "audio/kit/fx-choke.mp3" }
    ],
    licencia: "Puedes usar los sonidos en tus canciones y beats (comerciales o no) sin pagar regalías. No está permitido revender, compartir ni redistribuir los sonidos sueltos o en otro kit."
  }
];
