/* HEY BLESS! — animaciones de la tienda (no necesitas editar este archivo)
   1) Ripple: onda de luz desde el punto donde tocas un botón
   2) Avisos (toast): mensajes cortos que aparecen y se van  -> window.hbToast("texto")
   3) Transiciones: las secciones entran con fundido + deslizamiento al aparecer,
      y al pasar de una página a otra la tienda se desvanece suavemente */
(() => {
  const calma = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ---------- 1) ripple ---------- */
  const SEL = "button, .btn, a.pill, nav.menu a, .cta, .add, .pb, .play, [data-ripple]";
  document.addEventListener("pointerdown", e => {
    if (calma || e.button > 0) return;
    const el = e.target.closest(SEL);
    if (!el || el.disabled || el.matches("input, select, textarea, .no-ripple")) return;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    const caja = document.createElement("span");
    caja.className = "hb-rpl";
    const d = Math.max(r.width, r.height) * 2.4;
    const o = document.createElement("i");
    o.style.width = o.style.height = d + "px";
    o.style.left = (e.clientX - r.left - d / 2) + "px";
    o.style.top = (e.clientY - r.top - d / 2) + "px";
    caja.appendChild(o);
    el.appendChild(caja);
    o.addEventListener("animationend", () => caja.remove(), { once: true });
    setTimeout(() => caja.remove(), 1200);
  }, { passive: true });

  /* ---------- 2) avisos ---------- */
  let pila;
  window.hbToast = (msg, tipo) => {
    if (!msg) return;
    if (!pila) { pila = document.createElement("div"); pila.className = "hb-toasts"; pila.setAttribute("aria-live", "polite"); document.body.appendChild(pila); }
    const t = document.createElement("div");
    t.className = "hb-toast" + (tipo ? " " + tipo : "");
    t.textContent = msg;
    pila.appendChild(t);
    while (pila.children.length > 3) pila.firstChild.remove();
    requestAnimationFrame(() => t.classList.add("in"));
    setTimeout(() => { t.classList.remove("in"); t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 2200);
  };

  /* ---------- 3) transiciones ---------- */
  if (calma) return;
  root.classList.add("hb-anim");
  // entrada de la página
  requestAnimationFrame(() => root.classList.add("hb-ready"));
  // salida suave al ir a otra página de la tienda
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
    if (!/\.html$|\/$/.test(url.pathname)) return;
    e.preventDefault();
    root.classList.add("hb-leave");
    setTimeout(() => { location.href = url.href; }, 260);
  });
  addEventListener("pageshow", ev => { if (ev.persisted) root.classList.remove("hb-leave"); });

  // las secciones aparecen al hacer scroll
  const REV = ".hero, section .title, section .orn, .frame, .board, .steps > *, .tc, footer .foot";
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add("hb-in"); io.unobserve(x.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  const marcar = () => document.querySelectorAll(REV).forEach(el => {
    if (el.dataset.hbRev) return;
    el.dataset.hbRev = 1; el.classList.add("hb-rev");
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.92) requestAnimationFrame(() => el.classList.add("hb-in"));
    else io.observe(el);
  });
  // contenido que se dibuja después (listas, licencias, pizarra)
  const start = () => { marcar(); new MutationObserver(() => marcar()).observe(document.body, { childList: true, subtree: true }); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
