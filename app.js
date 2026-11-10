/* HEY BLESS! — lógica de la tienda (no necesitas editar este archivo)
   Los datos se leen de data/tienda.json, data/beats.json y data/kits.json (se editan en Pages CMS) */
(async () => {
const loadJSON = p => fetch(p + "?v=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);
const [TIENDA, BEATS_JSON, KITS_JSON] = await Promise.all([loadJSON("data/tienda.json"), loadJSON("data/beats.json"), loadJSON("data/kits.json")]);
const T = TIENDA || {};
const slug = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const asset = p => { if (!p) return ""; p = String(p).replace(/^\/+/, ""); if (/^https?:/i.test(p)) return p; try { return encodeURI(decodeURI(p)); } catch { return encodeURI(p); } };
const P = T.pagos || {};
const C = Object.assign({ comisionPorcentaje: 0.054, comisionFija: 0.30, tipoCambioRespaldo: 3.8 }, window.CONFIG_TECNICO || {}, T.redes || {}, P, {
  licencias: (T.licencias || []).map(l => ({ ...l, precio: +l.precio, archivos: [].concat(l.archivos || ["mp3"]).map(a => String(a).toLowerCase()), incluye: l.incluye || [] })),
  promo: T.promo, personalizado: T.personalizado || { desde: 0, incluye: [] },
  trabajos: (T.trabajos || []).map(w => ({ ...w, audio: asset(w.audio), portada: asset(w.portada) })),
  mixmaster: Object.assign({ incluye: [], trabajos: [] }, T.mixmaster || {}),
  resenas: T.resenas || [], pasos: T.pasos || [], faq: T.faq || [], faqKits: T.faqKits || []
});
C.comisionPorcentaje = +C.comisionPorcentaje; C.comisionFija = +C.comisionFija; C.tipoCambioRespaldo = +C.tipoCambioRespaldo;
C.mixmaster.trabajos = (C.mixmaster.trabajos || []).map(w => ({ ...w, audio: asset(w.audio), portada: asset(w.portada) }));
window.CONFIG = C;
window.BEATS = (BEATS_JSON || []).filter(b => b && b.nombre).map(b => ({ ...b, id: b.id || slug(b.nombre), bpm: b.bpm ? +b.bpm : "", tags: (b.tags || []).filter(Boolean), audio: asset(b.audio), portada: asset(b.portada) }));
window.KITS = (KITS_JSON || []).filter(k => k && k.nombre).map(k => ({ ...k, id: k.id || slug(k.nombre), precio: +k.precio, portada: asset(k.portada),
  artes: (k.artes || []).map(asset).filter(Boolean), demos: (k.demos || []).map(d => ({ ...d, audio: asset(d.audio) })),
  specs: (k.specs || []).map(x => Array.isArray(x) ? x : [x.etiqueta, x.valor]) }));
const PAGE = document.body.dataset.page;
const ALL_BEATS = (window.BEATS || []).map((b, i) => ({ ...b, key: "b" + i, id: b.id || "beat-" + i }));
const BEATS = ALL_BEATS.filter(b => !b.vendido);   // la exclusiva vendida desaparece del catálogo
const PROMO = C.promo && C.promo.activa ? C.promo : null;
const KITS = (window.KITS || []).map((k, i) => ({ ...k, ki: i, id: k.id || "kit-" + i }));
const WORKS = (C.trabajos || []).map((w, i) => ({ ...w, key: "t" + i, nombre: w.titulo }));
const MIXW = ((C.mixmaster && C.mixmaster.trabajos) || []).map((w, i) => ({ ...w, key: "m" + i, nombre: w.titulo }));
const TRACKS = {};
ALL_BEATS.forEach(b => TRACKS[b.key] = b);
WORKS.forEach(w => TRACKS[w.key] = { ...w, sub: w.artista + " · Prod. HEY BLESS!" });
MIXW.forEach(w => TRACKS[w.key] = { ...w, sub: w.artista + " · Mix & Master" });
KITS.forEach(k => (k.demos || []).forEach((d, j) => {
  d.key = "k" + k.ki + "-" + j;
  TRACKS[d.key] = { ...d, nombre: d.titulo, sub: k.nombre + " · " + (d.detalle || d.grupo || ""), kit: k, portada: k.portada, coverName: k.nombre };
}));

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const IG = "https://ig.me/m/" + C.instagram;
const AUTO = !!(C.backend && C.paypalClientId);   // verificación por API de PayPal
const SEMI = !!C.backend && !AUTO;                  // pedido + aprobación por correo
let rate = C.tipoCambioRespaldo, rateLive = false;

/* money */
const ppTotal = p => Math.ceil(((p + C.comisionFija) / (1 - C.comisionPorcentaje)) * 100) / 100;
const usd = n => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
const minPrice = () => Math.min(...C.licencias.map(l => l.precio));

/* icons */
const ICON = {
  play: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15"/><rect x="14" y="4.5" width="4" height="15"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  sp: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11"/><path d="M6.5 9.2c3.8-1.2 8-.9 11.2.9M7.2 12.4c3-.9 6.4-.6 9 .8M7.9 15.4c2.4-.6 4.9-.4 6.9.6" stroke="#f7f3eb" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="1.5" y="4.5" width="21" height="15" rx="4"/><path d="M10 8.8v6.4l5.5-3.2z" fill="#f7f3eb"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
  ver: '<svg class="ver" viewBox="0 0 24 24" aria-label="Verificado"><path fill="#1d9bf0" d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3L2.6 15.8l1-3-1-3 2.6-1.9 1-3 3.2.1z"/><path d="M7.5 12.3l3 3 6-6.3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/></svg>'
};
const BURST = '<svg viewBox="0 0 100 100"><polygon points="50,2 58,30 84,10 70,38 98,40 72,54 94,76 64,68 66,98 50,74 34,98 36,68 6,76 28,54 2,40 30,38 16,10 42,30" fill="#f7f3eb" stroke="#151311" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const ring = () => '<svg class="ring" viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="18"/><circle class="fg" cx="20" cy="20" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"/></svg>';
const WA = C.whatsapp ? "https://wa.me/" + C.whatsapp : "";
const waPretty = () => C.whatsapp ? "+" + C.whatsapp.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4") : "";
const socials = () => `<a href="https://instagram.com/${esc(C.instagram)}" target="_blank" rel="noopener">${ICON.ig}@${esc(C.instagram)}</a>
  ${WA ? `<a href="${WA}" target="_blank" rel="noopener">${ICON.wa}${esc(waPretty())}</a>` : ""}
  <a href="${esc(C.spotify)}" target="_blank" rel="noopener">${ICON.sp}HEY BLESS!</a>
  <a href="${esc(C.youtube)}" target="_blank" rel="noopener">${ICON.yt}HEY BLESS!</a>`;
const cover = (t, name) => t && t.portada ? `<div class="cover"><img src="${esc(t.portada)}" alt=""></div>` : `<div class="cover"><div class="gen">${esc(name || t.coverName || t.nombre)}</div></div>`;
function seeded(str, n) {
  let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const out = []; for (let i = 0; i < n; i++) { h = Math.imul(h ^ (h >>> 15), 2246822507); h ^= h >>> 13; out.push(((h >>> 0) % 1000) / 1000); }
  return out.map((v, i) => 0.25 + 0.75 * Math.abs(Math.sin(i / 3.2)) * (0.4 + 0.6 * v));
}
const waveHTML = (t, n = 70) => seeded((t.nombre || "") + (t.key || ""), n).map(v => `<i style="height:${Math.round(v*100)}%"></i>`).join("");
const playBtn = (key, sm) => `<button class="play${sm ? " sm" : ""}" data-play="${key}" aria-label="Reproducir">${ring()}${ICON.play}</button>`;
const metaB = b => [b.bpm ? b.bpm + " BPM" : "", b.tono, b.genero].filter(Boolean).map(esc).join(" · ");
const fmt = t => `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,"0")}`;
const igPill = text => `<a class="pill" href="${IG}" target="_blank" rel="noopener">${ICON.ig}${text}</a>`;
const linkTo = hash => location.origin + location.pathname + "#" + hash;

/* nav */
function renderNav() {
  const home = PAGE === "beats" ? "" : "index.html";
  const items = [["Catálogo de beats", home + "#beats"], ["Licencias", home + "#licencias"], ["Beats personalizados", home + "#personalizados"], ["Mix &amp; Master", home + "#mixmaster"], ["Drum Kits", "drumkits.html"]];
  $("#menu").innerHTML = items.map(([t, h]) => `<a href="${h}"${PAGE === "kits" && h === "drumkits.html" ? ' class="on"' : ""}>${t}</a>`).join("");
}

/* ---------- audio ---------- */
const audio = $("#audio");
let current = null;
function play(key, keepTime) {
  const t = TRACKS[key]; if (!t) return;
  if (current === key && keepTime === undefined) { audio.paused ? audio.play().catch(()=>{}) : audio.pause(); return; }
  current = key; audio.src = t.audio;
  if (keepTime) audio.addEventListener("loadedmetadata", () => { audio.currentTime = Math.min(keepTime, audio.duration || keepTime); }, { once: true });
  audio.play().catch(() => toast("No se pudo reproducir"));
  const isBeat = key[0] === "b";
  $("#p-title").innerHTML = `${esc(t.nombre)}<small>${isBeat ? `${metaB(t)}` : esc(t.sub || "")}</small>`;
  $("#p-cover").outerHTML = cover(t).replace('class="cover"', 'class="cover" id="p-cover"');
  $("#p-wave").innerHTML = waveHTML(t, 90);
  $("#p-play").dataset.play = key; $("#p-wave").dataset.wave = key;
  $("#p-buy").style.display = (isBeat && !t.vendido) || t.kit ? "" : "none";
  $("#player").classList.add("show");
  sync();
}
function sync() {
  const pct = audio.duration ? audio.currentTime / audio.duration : 0;
  $$("[data-play]").forEach(btn => {
    const mine = btn.dataset.play === current, on = mine && !audio.paused;
    btn.classList.toggle("on", on);
    const ico = btn.querySelector(".ico"); if (ico) ico.outerHTML = on ? ICON.pause : ICON.play;
    const fg = btn.querySelector(".fg"); if (fg) fg.style.strokeDashoffset = 113.1 * (1 - (mine ? pct : 0));
  });
  $$("[data-wave]").forEach(w => {
    const k = w.dataset.wave === current ? Math.floor(pct * w.children.length) : 0;
    for (let i = 0; i < w.children.length; i++) w.children[i].classList.toggle("p", i < k);
  });
  $$("[data-time]").forEach(el => { if (el.dataset.time === current) el.textContent = fmt(audio.currentTime || 0); });
  $("#p-time").textContent = fmt(audio.currentTime || 0);
}
["timeupdate","play","pause","ended","loadedmetadata"].forEach(e => audio.addEventListener(e, sync));
function seek(e, el) {
  const key = el.dataset.wave, r = el.getBoundingClientRect(), p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  if (current !== key) play(key);
  const go = () => { if (audio.duration) audio.currentTime = p * audio.duration; };
  audio.duration ? go() : audio.addEventListener("loadedmetadata", go, { once: true });
}

/* ---------- BEATS PAGE ---------- */
function renderFeatured() {
  const b = BEATS.find(x => x.destacado) || BEATS[0];
  if (!b) { $("#featured").innerHTML = '<div class="empty">Pronto nuevos beats.</div>'; return; }
  $("#featured").innerHTML = `<span class="caps tag-top blk">Destacado</span>
    <div class="feat-top">${cover(b)}<div style="min-width:0"><h2>${esc(b.nombre)}</h2>
    <div class="meta">${metaB(b)}</div>
    <div class="meta"><span class="tags">${(b.tags||[]).map(t => `<span>#${esc(t)}</span>`).join(" ")}</span></div></div></div>
    <div class="wave" data-wave="${b.key}">${waveHTML(b)}</div>
    <div class="feat-actions">${playBtn(b.key)}<button class="btn" data-buy="${b.key}">Comprar</button>
    <span class="from">desde <b>${usd(minPrice())}</b></span>
    <button class="share" data-copy="${esc(linkTo("beat-" + b.id))}" data-msg="Link del beat copiado" style="margin-left:auto">${ICON.link}Copiar link</button></div>`;
}
let filterGen = "Todos";
function renderList() {
  const q = $("#q").value.trim().toLowerCase(), sort = $("#sort").value;
  let list = BEATS.filter(b => (filterGen === "Todos" || b.genero === filterGen) &&
    [b.nombre, b.genero, b.tono, ...(b.tags||[]), String(b.bpm)].join(" ").toLowerCase().includes(q));
  list.sort((a, b) => sort === "bpm-asc" ? a.bpm - b.bpm : sort === "bpm-desc" ? b.bpm - a.bpm :
    sort === "az" ? a.nombre.localeCompare(b.nombre) : String(b.fecha).localeCompare(String(a.fecha)));
  list.sort((a, b) => (a.vendido ? 1 : 0) - (b.vendido ? 1 : 0));
  $("#list").innerHTML = list.length ? list.map(b => `
    <div class="row${b.vendido ? " sold" : ""}">
      ${playBtn(b.key, true)}
      ${cover(b)}
      <div class="dish">
        <div class="dish-line"><h3 data-buy="${b.key}">${esc(b.nombre)}</h3><span class="dots"></span>
          <span class="pr">${b.vendido ? "" : `desde ${usd(minPrice())}`}</span></div>
        <div class="meta">${metaB(b)} &nbsp;<span class="tags">${(b.tags||[]).map(t => `<span>#${esc(t)}</span>`).join(" ")}</span></div>
      </div>
      <div class="act">${b.vendido ? '<span class="stamp">Vendido</span>' : `<button class="btn ghost sm" data-buy="${b.key}">Comprar</button>`}</div>
    </div>`).join("") : '<div class="empty">No hay beats con ese filtro.</div>';
  sync();
}
function renderChips() {
  const gens = ["Todos", ...new Set(BEATS.map(b => b.genero))];
  $("#chips").innerHTML = gens.map(g => `<button class="chip${g === filterGen ? " on" : ""}" data-gen="${esc(g)}">${esc(g)}</button>`).join("");
}
const licCard = l => `<div class="lic"><div class="name">${esc(l.nombre)}</div>
  <ul>${l.incluye.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
  <div class="ideal">Ideal para<b>${esc(l.ideal)}</b></div>
  <div class="amt">${usd(l.precio)}</div></div>`;
function renderPromo() {
  const el = $("#promo"); if (!el) return;
  el.innerHTML = PROMO ? `<div class="promo"><span class="caps blk">Promo de la casa</span>
    <div class="promo-t">${esc(PROMO.titulo)}</div><p>${esc(PROMO.lema)}</p><small>${esc(PROMO.detalle)}</small></div>` : "";
}
function renderLicenses() {
  $("#lic-ne").innerHTML = C.licencias.filter(l => !l.exclusiva).map(licCard).join("");
  $("#lic-ex").innerHTML = C.licencias.filter(l => l.exclusiva).map(licCard).join("");
  if (!$("#lic-ex-wrap .burst")) $("#lic-ex-wrap").insertAdjacentHTML("beforeend", `<div class="burst">${BURST}<span>${PROMO ? "2x1" : "Única<br>venta"}</span></div>`);
}
const workRow = w => `<div class="work has-cover">${playBtn(w.key, true)}${w.portada ? cover(w) : '<div class="cover"><div class="gen">✦</div></div>'}<div class="w-t">${esc(w.titulo)}<small>${esc(w.artista)}</small></div>
  <div class="wave" data-wave="${w.key}">${waveHTML(w, 46)}</div><div class="time" data-time="${w.key}">0:00</div></div>`;
function renderCustom() {
  const P = C.personalizado;
  $("#custom").innerHTML = `
    <div class="burst">${BURST}<span><sup>$</sup>${P.desde}</span></div>
    <div>
      <div class="script">Beats<br>Personalizados</div>
      <div class="pill" style="cursor:default">Crea un ritmo a tu medida</div>
      <p>Dejar tu esencia en cada canción es muy importante.</p>
      <p>Por eso mi servicio de beats personalizados te ayudará a llegar al sonido que tanto quieres lograr para tu proyecto musical.</p>
      <p class="desde">Desde <b>${usd(P.desde)}</b> USD — el máximo lo propones tú.</p>
      <div style="margin-top:16px">${igPill("Cotizar por Instagram")}</div>
    </div>
    <div class="inc">
      <h3>INCLUYE</h3><ul>${P.incluye.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      ${WORKS.length ? `<div class="works"><h3>TRABAJOS MÍOS</h3>${WORKS.map(workRow).join("")}</div>` : ""}
    </div>`;
}
function renderMix() {
  const M = C.mixmaster;
  $("#mix").innerHTML = `
    <div>
      <div class="script">Mezcla<br>&amp; Master</div>
      <div class="pill" style="cursor:default">Tu canción lista para sonar</div>
      <p>${esc(M.descripcion)}</p>
      <p class="desde">${+M.desde ? `Desde <b>${usd(+M.desde)}</b> USD` : "Cotiza tu proyecto según el número de pistas."}</p>
      <div style="margin-top:16px">${igPill("Cotizar por Instagram")}</div>
    </div>
    <div class="inc" style="padding-top:8px"><h3>INCLUYE</h3><ul>${M.incluye.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      ${MIXW.length ? `<div class="works"><h3>TRABAJOS MÍOS</h3>${MIXW.map(workRow).join("")}</div>` : ""}</div>`;
}

function renderPasos() {
  const el = $("#pasos"); if (!el) return;
  el.innerHTML = (C.pasos || []).map((p, i) => `<div class="frame step peek"><div class="n">${i + 1}</div>${p.etiqueta ? `<span class="opt-tag">${esc(p.etiqueta)}</span>` : ""}<h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></div>`).join("");
}
function renderFaq(list) {
  const el = $("#faq-list"); if (!el) return;
  el.innerHTML = (list || []).map(f => `<details><summary>${esc(f.pregunta)}</summary><p>${esc(f.respuesta)}</p></details>`).join("");
  $("#faq").style.display = (list || []).length ? "" : "none";
}
function renderReviews() {
  const el = $("#resenas-grid"); if (!el) return;
  const R2 = C.resenas || [];
  $("#resenas").style.display = R2.length ? "" : "none";
  const ini = n => n.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  el.innerHTML = R2.map(r => `<article class="frame review peek">
    <div class="stars" aria-label="5 de 5">★★★★★</div>
    <div class="caps">Crítica de la casa · 5/5</div>
    <blockquote>“${esc(r.texto)}”</blockquote>
    <div class="critic">${r.foto ? `<img src="${esc(r.foto)}" alt="">` : ""}
      <div><b>${esc(r.nombre)}${r.verificado ? ICON.ver : ""}</b>
      <a href="https://instagram.com/${esc(r.usuario)}" target="_blank" rel="noopener">@${esc(r.usuario)}</a></div></div>
  </article>`).join("");
}
/* ---------- KITS PAGE ---------- */
const kitCount = k => (k.contenido || []).reduce((s, c) => s + (+c.cantidad || 0), 0);
function renderKits() {
  $("#kits").innerHTML = KITS.map(k => `<div class="frame kit-card peek" data-kit="${esc(k.id)}">
    ${cover(k)}<h3>${esc(k.nombre)}</h3><div class="meta">${kitCount(k)} sonidos · WAV</div><div class="amt">${usd(k.precio)}</div></div>`).join("")
    || '<div class="empty">Pronto nuevos drum kits.</div>';
}
let kitArt = 0;
function showKit(id, scroll) {
  const k = KITS.find(x => x.id === id); if (!k) return;
  const arts = [k.portada, ...(k.artes || [])].filter(Boolean);
  const groups = {}; (k.demos || []).forEach(d => (groups[d.grupo || "Demos"] = groups[d.grupo || "Demos"] || []).push(d));
  $("#kit-detail").innerHTML = `<div class="frame kit peek" id="kit-${esc(k.id)}">
    <div class="kit-top">
      <div class="kit-art">${arts.length ? `<div class="cover" id="kit-main"><img src="${esc(arts[kitArt] || arts[0])}" alt=""></div>
        ${arts.length > 1 ? `<div class="thumbs">${arts.map((a, i) => `<button class="${i === kitArt ? "on" : ""}" data-art="${i}" data-kitid="${esc(k.id)}"><img src="${esc(a)}" alt=""></button>`).join("")}</div>` : ""}`
        : cover(k)}</div>
      <div class="kit-info">
        <div class="caps">Drum kit · HEY BLESS!</div>
        <div class="script" style="margin-top:6px">${esc(k.nombre)}</div>
        <div class="price">${usd(k.precio)}</div>
        <p>${esc(k.descripcion)}</p>
        <div class="kit-actions"><button class="btn" data-buykit="${esc(k.id)}">Comprar kit</button>
          <button class="share" data-copy="${esc(linkTo("kit-" + k.id))}" data-msg="Link del kit copiado">${ICON.link}Copiar link</button></div>
        <div class="badges2"><span>${kitCount(k)} sonidos</span><span>Descarga inmediata</span><span>Libre de regalías</span></div>
      </div>
    </div>
    <div class="kit-cols">
      <div>
        <div class="box"><h4>Escúchalo</h4>
          ${Object.entries(groups).map(([g, ds]) => `<div class="demo-group"><span class="caps">${esc(g)}</span>
            ${ds.map(d => `<div class="work">${playBtn(d.key, true)}<div class="w-t">${esc(d.titulo)}<small>${esc(d.detalle || "")}</small></div>
              <div class="wave" data-wave="${d.key}">${waveHTML(TRACKS[d.key], 46)}</div><div class="time" data-time="${d.key}">0:00</div></div>`).join("")}</div>`).join("")}
        </div>
        ${(k.referentes || []).length ? `<div class="box"><h4>Inspirado en</h4><div class="refs">${k.referentes.map(r => `<span>${esc(r)}</span>`).join("")}</div></div>` : ""}
      </div>
      <div>
        <div class="box"><h4>Contenido</h4>
          ${(k.contenido || []).map(c => `<div class="menu-ln"><span>${esc(c.tipo)}</span><span class="dots"></span><b>${esc(c.cantidad)}</b></div>`).join("")}
          <div class="menu-ln" style="border-top:1px solid var(--ink);margin-top:6px;padding-top:12px"><b>Total</b><span class="dots"></span><b>${kitCount(k)}</b></div>
        </div>
        <div class="box"><h4>Especificaciones</h4>
          ${(k.specs || []).map(([a, b]) => `<div class="menu-ln"><span>${esc(a)}</span><span class="dots"></span><b>${esc(b)}</b></div>`).join("")}
        </div>
        ${k.preparacion ? `<div class="box"><h4>Preparación</h4><p style="font-size:13.5px;line-height:1.6">${esc(k.preparacion)}</p></div>` : ""}
        <div class="box"><h4>Licencia de uso</h4><p style="font-size:13.5px;line-height:1.6">${esc(k.licencia || "")}</p></div>
      </div>
    </div></div>`;
  sync();
  if (scroll) $("#kit-detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- PURCHASE ---------- */
let M = { beat: null, lic: null, item: null, nombre: "", artista: "", correo: "", code: "", regalo: "" };
const X = '<button class="x" data-close aria-label="Cerrar">×</button>';
function openModal() { $("#modal").classList.add("open"); document.body.style.overflow = "hidden"; }
function closeBuy() {
  $("#modal").classList.remove("open"); document.body.style.overflow = "";
  if (/^#beat-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
}
function openBeat(key) {
  const b = TRACKS[key]; if (!b || key[0] !== "b") return;
  M.beat = b; if (!M.lic) M.lic = C.licencias[1] || C.licencias[0];
  history.replaceState(null, "", "#beat-" + b.id);
  stepPick(); openModal();
}
function openKit(id) {
  const k = KITS.find(x => x.id === id); if (!k) return;
  M.item = { tipo: "kit", id: k.id, nombre: k.nombre, titulo: k.nombre, precio: k.precio, precioSoles: k.precioSoles, licId: "" };
  stepPay(); openModal();
}
function stepPick() {
  const b = M.beat, l = M.lic;
  $("#sheet").innerHTML = `${X}
    <div class="m-head">${cover(b)}<div style="min-width:0"><div class="caps">Tu pedido</div><h2 style="margin-top:6px">${esc(b.nombre)}</h2>
      <div class="meta">${metaB(b)}</div>
      <button class="share" style="margin-top:8px" data-copy="${esc(linkTo("beat-" + b.id))}" data-msg="Link del beat copiado">${ICON.link}Copiar link de este beat</button></div></div>
    <div style="display:flex;gap:14px;align-items:center;margin-top:18px">${playBtn(b.key, true)}<div class="wave" data-wave="${b.key}" style="flex:1">${waveHTML(b, 80)}</div></div>
    ${b.vendido ? `<p style="margin:22px 0;font-size:15px"><span class="stamp">Vendido</span> &nbsp;Este beat ya se vendió en exclusiva.</p>` : `
    <div class="pick">${C.licencias.map(x => `<button class="opt${x.id === l.id ? " sel" : ""}" data-lic="${x.id}"><span class="led"></span>
      <div class="o-n">${esc(x.nombre.replace("Licencia ", ""))}</div><b>${usd(x.precio)}</b><small>${esc(x.ideal)}</small></button>`).join("")}</div>
    <div class="detail">
      <div><div class="caps blk" style="margin-bottom:8px">Incluye</div><ul>${l.incluye.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>
      <div class="sum">
        <div class="ln"><span>${esc(l.nombre)}</span><b>${usd(l.precio)}</b></div>
        <div class="ln sub"><span>Entrega</span><span>${l.archivos.map(a => a.toUpperCase()).join(" + ")} al instante${l.stems ? " · stems por IG" : ""}</span></div>
        <div class="ln sub"><span>Licencia</span><span>PDF a tu nombre</span></div>
        ${PROMO && l.exclusiva ? `<div class="gift"><div class="caps blk">🎁 ${esc(PROMO.titulo)}</div>
          <p>${esc(PROMO.lema)} Elige tu beat de regalo:</p>
          <select id="f-regalo"><option value="">— Elige un beat —</option>${BEATS.filter(x => x.id !== b.id).map(x => `<option value="${esc(x.id)}"${x.id === M.regalo ? " selected" : ""}>${esc(x.nombre)}</option>`).join("")}</select></div>` : ""}
        <button class="btn" style="width:100%;margin-top:16px" data-go="pay">Continuar</button>
      </div>
    </div>`}`;
  const g = $("#f-regalo"); if (g) g.onchange = () => { M.regalo = g.value; g.classList.remove("bad"); };
  sync();
}
function stepPay() {
  if (M.beat && (!M.item || M.item.tipo === "beat")) {
    const b = M.beat, l = M.lic;
    const reg = PROMO && l.exclusiva ? BEATS.find(x => x.id === M.regalo) : null;
    M.item = { tipo: "beat", id: b.id, nombre: b.nombre, titulo: `${b.nombre}${reg ? " + " + reg.nombre : ""} — ${l.nombre}`, precio: l.precio, licId: l.id, stems: !!l.stems, licNombre: l.nombre,
      regaloId: reg ? reg.id : "", regaloNombre: reg ? reg.nombre : "" };
  }
  const it = M.item, t = ppTotal(it.precio), fee = +(t - it.precio).toFixed(2);
  M.code = newCode();
  $("#sheet").innerHTML = `${X}
    <div class="caps">Tu pedido</div>
    <h2 style="font-weight:900;font-size:22px;text-transform:uppercase;margin:6px 0 18px">${esc(it.titulo)}</h2>
    <div class="detail">
      <div>
        <label class="field"><span>Tu nombre completo</span><input id="f-nombre" autocomplete="name" value="${esc(M.nombre)}" placeholder="Ej. Juan Pérez"></label>
        <label class="field"><span>Nombre artístico (opcional)</span><input id="f-artista" value="${esc(M.artista)}" placeholder="Ej. J. Flow"></label>
        <label class="field"><span>Correo para recibir tus archivos</span><input id="f-correo" type="email" autocomplete="email" value="${esc(M.correo)}" placeholder="tucorreo@gmail.com"></label>
        <p class="note">${it.tipo === "beat" ? "Tu licencia en PDF sale con este nombre. " : ""}A este correo te llegan tus archivos. Revisa también la carpeta de spam.</p>
      </div>
      <div>
        <div class="sum">
          <div class="ln"><span>${esc(it.tipo === "beat" ? it.licNombre : it.nombre)}</span><span>${usd(it.precio)}</span></div>
          ${it.regaloId ? `<div class="ln"><span>🎁 ${esc(it.regaloNombre)} (regalo 2x1)</span><span>$0</span></div>` : ""}
          <div class="ln"><span>Comisión PayPal</span><span>${usd(fee)}</span></div>
          <div class="ln tot"><span>Total</span><span>${usd(t)} USD</span></div>
          <p class="pen-note">${it.precioSoles ? `¿Prefieres pagar en soles? Son <b>S/ ${it.precioSoles}</b>:` : `≈ S/ ${Math.ceil(t * rate)} · Tipo de cambio ${rateLive ? "de hoy" : "referencial"}: S/ ${rate.toFixed(2)} por dólar.<br>¿Prefieres pagar en soles?`} Escríbeme por <a href="${IG}" target="_blank" rel="noopener">Instagram</a>${WA ? ` o <a href="${WA}" target="_blank" rel="noopener">WhatsApp</a>` : ""}.</p>
        </div>
        ${AUTO ? '<div id="pp-buttons"><div class="spin"></div></div>' : SEMI ? `
          <div class="os" style="grid-template-columns:30px 1fr;border:0;padding:14px 0 0"><div class="n" style="font-family:var(--script);font-size:34px;color:var(--red);line-height:.8">1</div><div>
            <p style="font-size:13px;margin-bottom:8px">Paga en PayPal (el monto ya viene puesto) y en la nota escribe tu código <b>${M.code}</b>.</p>
            <a class="btn" style="width:100%" href="${esc(C.paypal)}/${t.toFixed(2)}USD" target="_blank" rel="noopener" data-paid-open>Pagar ${usd(t)} en PayPal</a></div></div>
          <div class="os" style="grid-template-columns:30px 1fr;border:0;padding:14px 0 0"><div class="n" style="font-family:var(--script);font-size:34px;color:var(--red);line-height:.8">2</div><div>
            <p style="font-size:13px;margin-bottom:8px">Cuando hayas pagado, confirma tu pedido:</p>
            <button class="btn ghost" style="width:100%" data-confirm>Ya pagué · enviar pedido</button></div></div>` :
          `<button class="btn" style="width:100%;margin-top:14px" data-manual>Pagar ${usd(t)} con PayPal</button>`}
      </div>
    </div>
    ${it.tipo === "beat" ? '<button class="btn ghost sm" data-go="pick" style="margin-top:22px">← Cambiar licencia</button>' : ""}`;
  [["f-nombre","nombre"],["f-artista","artista"],["f-correo","correo"]].forEach(([id, k]) => $("#" + id).addEventListener("input", e => { M[k] = e.target.value.trim(); e.target.classList.remove("bad"); }));
  if (AUTO) mountPayPal();
}
function validBuyer() {
  M.nombre = $("#f-nombre").value.trim(); M.artista = $("#f-artista").value.trim(); M.correo = $("#f-correo").value.trim();
  let ok = true;
  if (M.nombre.length < 2) { $("#f-nombre").classList.add("bad"); ok = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(M.correo)) { $("#f-correo").classList.add("bad"); ok = false; }
  if (!ok) toast("Completa tu nombre y correo");
  return ok;
}
const newCode = () => "HB-" + Math.random().toString(36).slice(2, 7).toUpperCase();
async function api(data) { const r = await fetch(C.backend, { method: "POST", body: JSON.stringify(data) }); return r.json(); }

let ppLoading = null;
function loadPayPal() {
  if (window.paypal) return Promise.resolve();
  if (!ppLoading) ppLoading = new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(C.paypalClientId)}&currency=USD&intent=capture`;
    s.onload = res; s.onerror = () => { ppLoading = null; rej(); }; document.head.appendChild(s);
  });
  return ppLoading;
}
async function mountPayPal() {
  try { await loadPayPal(); } catch { const b = $("#pp-buttons"); if (b) b.innerHTML = '<p class="note">No se pudo cargar PayPal. Recarga la página o escríbeme por Instagram.</p>'; return; }
  const box = $("#pp-buttons"); if (!box) return; box.innerHTML = "";
  const it = M.item, t = ppTotal(it.precio), code = M.code;
  paypal.Buttons({
    style: { layout: "vertical", color: "black", shape: "rect", label: "pay", height: 46 },
    onClick: (d, actions) => validBuyer() ? actions.resolve() : actions.reject(),
    createOrder: (d, actions) => actions.order.create({
      purchase_units: [{ amount: { currency_code: "USD", value: t.toFixed(2) },
        description: `${it.titulo} (HEY BLESS!)`.slice(0, 127),
        custom_id: `${it.tipo}|${it.id}|${it.licId || ""}|${code}`.slice(0, 127) }],
      application_context: { shipping_preference: "NO_SHIPPING" }
    }),
    onApprove: async (d, actions) => {
      stepWait("Verificando tu pago…");
      try {
        await actions.order.capture();
        const res = await api({ action: "paypal", orderId: d.orderID, nombre: M.nombre, artista: M.artista, correo: M.correo });
        res.ok ? stepDone(res, code) : stepError(res.error);
      } catch (e) { stepError(); }
    },
    onError: () => stepError("PayPal no pudo procesar el pago. No se hizo ningún cobro.")
  }).render(box);
}
function stepWait(msg) { $("#sheet").innerHTML = `<div class="done"><div class="title">Un momento</div><div class="spin"></div><p>${esc(msg)}</p></div>`; }
function stemsBlock(code) {
  if (!M.item.stems) return "";
  const msg = `Hola HEY BLESS! Compré ${M.item.titulo}. Pedido ${code}. Nombre: ${M.nombre}. Correo: ${M.correo}. ¿Me envías los stems?`;
  return `<div class="sum" style="margin-top:18px;text-align:left"><div class="caps blk">Tus stems</div>
    <p style="font-size:13.5px;margin:8px 0">Tu licencia incluye stems. Mándame este mensaje por Instagram y te los envío en minutos:</p>
    <div class="code">${esc(msg)}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" data-copy="${esc(msg)}">Copiar mensaje</button>${igPill("Avisar por IG")}</div></div>`;
}
function stepDone(res, code) {
  const links = res.links || [];
  $("#sheet").innerHTML = `${X}<div class="done">
    <div class="title">¡Listo!</div>
    <p style="font-size:15px;margin-top:6px">Gracias, <b>${esc(M.nombre)}</b>. Tu pedido <b>${esc(res.code || code)}</b> está confirmado.</p>
    <div class="dl">${links.map(k => `<a class="btn" href="${esc(k.url)}" target="_blank" rel="noopener">Descargar ${esc(k.label)}</a>`).join("")}</div>
    <p class="note">También te lo enviamos a <b>${esc(M.correo)}</b>${M.item.tipo === "beat" ? ", con tu licencia en PDF" : ""}.</p>
    ${stemsBlock(res.code || code)}</div>`;
}
function stepSent() {
  $("#sheet").innerHTML = `${X}<div class="done">
    <div class="title">¡Pedido recibido!</div>
    <p style="font-size:15px;margin-top:6px">Gracias, <b>${esc(M.nombre)}</b>. Tu pedido <b>${esc(M.code)}</b> está en la cocina.</p>
    <p class="note">Apenas confirme tu pago en PayPal, tus archivos${M.item.tipo === "beat" ? " y tu licencia en PDF" : ""} te llegan automáticamente a <b>${esc(M.correo)}</b>. Revisa también la carpeta de spam.</p>
    ${stemsBlock(M.code)}</div>`;
}
function stepError(msg) {
  $("#sheet").innerHTML = `${X}<div class="done"><div class="title">Ups…</div>
    <p style="margin:10px 0 16px">${esc(msg || "Hubo un problema al confirmar tu pedido.")} Si se hizo el cobro, escríbeme por Instagram y lo resolvemos al toque.</p>
    ${igPill("Escribir por IG")}</div>`;
}
function stepManual() {
  const it = M.item, code = M.code, t = ppTotal(it.precio);
  const msg = `Hola HEY BLESS! Pedido ${code}\n${it.tipo === "beat" ? "Beat" : "Drum kit"}: ${it.nombre}${it.regaloNombre ? "\nBeat de regalo (2x1): " + it.regaloNombre : ""}${it.licNombre ? "\nLicencia: " + it.licNombre : ""}\nComprador: ${M.nombre}${M.artista ? " (" + M.artista + ")" : ""}\nCorreo: ${M.correo}\nPago: ${usd(t)} USD por PayPal`;
  $("#sheet").innerHTML = `${X}<div class="caps">Pedido ${code}</div>
    <h2 style="font-weight:900;font-size:22px;text-transform:uppercase;margin:6px 0 14px">Último paso</h2>
    <p style="font-size:14px">1. Paga en PayPal (el monto ya viene puesto):</p>
    <a class="btn" style="margin:10px 0 18px" href="${esc(C.paypal)}/${t.toFixed(2)}USD" target="_blank" rel="noopener">Pagar ${usd(t)} en PayPal</a>
    <p style="font-size:14px">2. Mándame este mensaje por Instagram con la captura del pago:</p>
    <div class="code">${esc(msg)}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" data-copy="${esc(msg)}">Copiar mensaje</button>${igPill("Abrir DM")}</div>`;
}

/* ---------- events ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-play],[data-buy],[data-buykit],[data-kit],[data-art],[data-gen],[data-lic],[data-go],[data-close],[data-copy],[data-wave],[data-manual],[data-confirm],[data-paid-open]");
  if (!t) { if (e.target === $("#modal")) closeBuy(); return; }
  const d = t.dataset;
  if (d.play !== undefined) play(d.play);
  else if (d.buy !== undefined) openBeat(d.buy);
  else if (d.buykit !== undefined) openKit(d.buykit);
  else if (d.kit !== undefined) { kitArt = 0; history.replaceState(null, "", "#kit-" + d.kit); showKit(d.kit, true); }
  else if (d.art !== undefined) { kitArt = +d.art; showKit(d.kitid); }
  else if (d.gen !== undefined) { filterGen = d.gen; renderChips(); renderList(); }
  else if (d.lic !== undefined) { M.lic = C.licencias.find(l => l.id === d.lic); stepPick(); }
  else if (d.go === "pay") {
    const g = $("#f-regalo");
    if (g) { M.regalo = g.value; if (!M.regalo) { g.classList.add("bad"); toast("Elige tu beat de regalo"); return; } }
    M.item = null; stepPay();
  }
  else if (d.go === "pick") stepPick();
  else if (d.manual !== undefined) { if (validBuyer()) stepManual(); }
  else if (d.paidOpen !== undefined) { if (!validBuyer()) e.preventDefault(); }
  else if (d.confirm !== undefined) {
    if (!validBuyer()) return;
    stepWait("Enviando tu pedido…");
    api({ action: "pedido", tipo: M.item.tipo, id: M.item.id, licId: M.item.licId || "", regaloId: M.item.regaloId || "", nombre: M.nombre, artista: M.artista, correo: M.correo, code: M.code })
      .then(r => r.ok ? stepSent() : stepError(r.error)).catch(() => stepError());
  }
  else if (d.close !== undefined) closeBuy();
  else if (d.copy !== undefined) copy(d.copy, d.msg);
  else if (d.wave !== undefined) seek(e, t);
});
$("#p-buy").addEventListener("click", () => {
  const t = TRACKS[current]; if (!t) return;
  if (t.kit) openKit(t.kit.id); else openBeat(current);
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeBuy(); });
function copy(text, msg) {
  try { navigator.clipboard.writeText(text).then(() => toast(msg || "¡Copiado!"), () => toast("No se pudo copiar")); }
  catch { toast("No se pudo copiar"); }
}
let tt; function toast(m) { const el = $("#toast"); el.textContent = m; el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 1800); }

/* exchange rate (only shown at payment) */
(async () => { try { const j = await (await fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" })).json();
  if (j && j.rates && j.rates.PEN) { rate = +j.rates.PEN; rateLive = true; } } catch {} })();

/* links: #beat-<id> / #kit-<id> */
function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (PAGE === "beats" && h.startsWith("beat-")) { const b = ALL_BEATS.find(x => x.id === h.slice(5)); if (b) openBeat(b.key); }
  if (PAGE === "kits" && h.startsWith("kit-")) showKit(h.slice(4), true);
}
window.addEventListener("hashchange", route);

/* chef peeking from behind the frames */
const chef = $("#chef");
function peek() {
  const frames = $$(".peek").filter(f => { const r = f.getBoundingClientRect(); return r.top > 40 && r.top < innerHeight - 140 && r.height > 130; });
  if (!frames.length || document.hidden || $("#modal").classList.contains("open")) return later();
  const f = frames[Math.floor(Math.random() * frames.length)], r = f.getBoundingClientRect();
  const W = Math.min(92, Math.max(64, innerWidth * 0.12)), H = W * 600 / 517;
  chef.style.width = W + "px";
  const side = Math.random() < 0.5 ? "left" : "right";
  const y = r.top + scrollY + 20 + Math.random() * Math.max(0, Math.min(r.height, innerHeight - r.top - 60) - H - 40);
  chef.style.left = (side === "right" ? r.right + scrollX - W - 4 : r.left + scrollX + 4) + "px"; chef.style.top = y + "px";
  const out = (side === "right" ? 1 : -1) * W * 0.72, rot = side === "right" ? 16 : -16, fl = side === "left" ? -1 : 1;
  const k = (x, r2, o) => ({ transform: `translateX(${x}px) rotate(${r2}deg) scaleX(${fl})`, opacity: 1, ...(o !== undefined ? { offset: o } : {}) });
  chef.animate([k(0,0), k(out*1.12,rot,.16), k(out*.92,rot*.6,.24), k(out,rot*.8,.30), k(out,rot*.5,.52), k(out*1.05,rot,.60), k(out,rot*.7,.80), k(0,0)],
    { duration: 3400, easing: "ease-in-out" }).onfinish = later;
}
function later() { setTimeout(peek, 7000 + Math.random() * 9000); }

/* init */
renderNav();
$("#socials").innerHTML = socials(); $("#socials2").innerHTML = socials();
$$(".ig-handle").forEach(e => e.textContent = "@" + C.instagram);
$$(".wa-num").forEach(e => e.textContent = waPretty());
$("#yr").textContent = new Date().getFullYear();
$("#p-play").innerHTML = ring() + ICON.play; $("#p-play").dataset.play = ""; $("#p-wave").dataset.wave = "";
if (PAGE === "beats") {
  renderChips(); renderFeatured(); renderList(); renderPromo(); renderLicenses(); renderCustom(); renderMix(); renderReviews(); renderPasos(); renderFaq(C.faq);
  $("#q").addEventListener("input", renderList); $("#sort").addEventListener("change", renderList);
} else if (PAGE === "kits") {
  renderKits(); renderFaq(C.faqKits);
  if (KITS.length === 1) { $("#kits").style.display = "none"; if (!location.hash) showKit(KITS[0].id); }
}
sync(); route();
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setTimeout(peek, 3500);
})();
