// =====================================================================
//  relato.js — Escenas de historia y motor de partidos
// =====================================================================
//  Dos ideas principales:
//
//  1. ESCENAS: la historia está escrita como datos (en historia.js).
//     Cada escena tiene un texto y opciones. Cada opción dice a qué
//     escena ir y/o qué cambiar en el estado. irA("id") muestra una.
//
//  2. PARTIDOS: un partido es una lista de "momentos". En cada momento
//     elegís una jugada; la jugada usa una de tus stats y tiene una
//     dificultad. Se tira un "dado" y se decide si te sale o no.
// =====================================================================


// ---------------------------------------------------------------------
// PANTALLA: mostrar texto y botones
// ---------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

// Convierte texto simple a HTML: **negrita**, párrafos con línea vacía.
function formatear(texto) {
  const seguro = texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return seguro
    .split("\n\n")
    .map((parrafo) => "<p>" + parrafo
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replaceAll("\n", "<br>") + "</p>")
    .join("");
}

// Cambia entre la vista del mapa y la vista de relato.
function mostrarVista(cual) {
  $("vista-mundo").hidden = cual !== "mundo";
  $("vista-relato").hidden = cual !== "relato";
  actualizarHUD();
}

// Muestra una pantalla de relato nueva (borra la anterior).
function mostrarRelato(titulo, texto, opciones) {
  mostrarVista("relato");
  $("marcador").hidden = true;
  $("relato-titulo").textContent = titulo || "";
  $("relato-texto").innerHTML = "";
  narrar(texto);
  mostrarOpciones(opciones);
  window.scrollTo({ top: 0 });
}

// Agrega un párrafo al relato (sin borrar lo anterior).
function narrar(texto, clase = "") {
  const bloque = document.createElement("div");
  bloque.className = "linea " + clase;
  bloque.innerHTML = formatear(conNombre(texto));
  $("relato-texto").appendChild(bloque);
  bloque.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

// Dibuja los botones. Cada opción: { texto, detalle, accion }
function mostrarOpciones(opciones) {
  const caja = $("opciones");
  caja.innerHTML = "";
  for (const op of opciones) {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.innerHTML = `<span>${conNombre(op.texto)}</span>` +
      (op.detalle ? `<small>${op.detalle}</small>` : "");
    boton.disabled = !!op.deshabilitada;
    boton.addEventListener("click", () => {
      caja.innerHTML = ""; // evita doble clic
      op.accion();
      actualizarHUD();
    });
    caja.appendChild(boton);
  }
}

// Pide el nombre del jugador con una cajita de texto.
function pedirNombre(alTerminar) {
  mostrarRelato("Pibe de Potrero",
    "Toda historia empieza con un nombre. El tuyo lo van a gritar en las tribunas algún día.\n\n¿Cómo te llamás?", []);
  const caja = $("opciones");
  caja.innerHTML = `
    <form id="form-nombre" class="form-nombre">
      <input id="input-nombre" maxlength="14" placeholder="Ej: Lauti" autocomplete="off">
      <button class="opcion" type="submit"><span>Empezar la historia</span></button>
    </form>`;
  $("input-nombre").focus();
  $("form-nombre").addEventListener("submit", (evento) => {
    evento.preventDefault();
    E.nombre = $("input-nombre").value.trim() || "Lauti";
    alTerminar();
  });
}


// ---------------------------------------------------------------------
// ESCENAS
// ---------------------------------------------------------------------
// Una escena (en historia.js) se ve así:
//   {
//     titulo: "Capítulo 1",
//     alEntrar: () => { ... },          // opcional: efectos al llegar
//     texto: "..." o () => "...",       // función = texto que cambia
//     opciones: [
//       { texto: "Ir al kiosco", ir: "otra_escena" },
//       { texto: "Pelear", si: () => flag("garra") > 0, accion: () => {...} },
//     ]
//   }
function irA(id) {
  const escena = ESCENAS[id];
  if (!escena) {
    console.error("No existe la escena:", id);
    return;
  }
  if (escena.alEntrar) escena.alEntrar();

  const texto = typeof escena.texto === "function" ? escena.texto() : escena.texto;
  const opciones = (typeof escena.opciones === "function" ? escena.opciones() : escena.opciones)
    .filter((op) => !op.si || op.si())  // "si" = solo aparece si se cumple
    .map((op) => ({
      texto: op.texto,
      detalle: op.detalle,
      accion: () => {
        if (op.accion) op.accion();
        if (op.ir) irA(op.ir);
      },
    }));

  mostrarRelato(escena.titulo, texto, opciones);
  guardar();
}


// ---------------------------------------------------------------------
// PARTIDOS
// ---------------------------------------------------------------------
// P guarda el partido que se está jugando ahora (null si no hay).
let P = null;

function empezarPartido(def) {
  P = {
    def,
    a: 0,            // goles nuestros
    b: 0,            // goles de ellos
    i: 0,            // número de momento actual
    minuto: 0,
    nota: 6,         // tu calificación (como en los diarios)
    bonus: def.bonus ? def.bonus() : 0, // suma o resta % a todas las jugadas
    momentos: typeof def.momentos === "function" ? def.momentos() : def.momentos,
  };

  mostrarRelato(def.titulo, def.intro, []);
  $("marcador").hidden = false;
  actualizarMarcador();
  mostrarOpciones([{ texto: "¡Que ruede la pelota!", accion: siguienteMomento }]);
}

function actualizarMarcador() {
  $("marcador").innerHTML = `
    <span class="equipo">${P.def.nuestro}</span>
    <span class="goles">${P.a} – ${P.b}</span>
    <span class="equipo">${P.def.rival}</span>
    <span class="meta">${P.minuto}' · Nota ${P.nota.toFixed(1)}</span>`;
}

function siguienteMomento() {
  if (P.i >= P.momentos.length) {
    terminarPartido();
    return;
  }
  const m = P.momentos[P.i];
  P.minuto = m.minuto;
  actualizarMarcador();

  const texto = typeof m.texto === "function" ? m.texto() : m.texto;
  narrar(`**${m.minuto}'** — ${texto}`, "momento");

  mostrarOpciones(
    m.opciones
      .filter((op) => !op.si || op.si())
      .map((op) => ({
        texto: op.texto,
        detalle: detalleJugada(op),
        accion: () => resolverJugada(op),
      }))
  );
}

// LA FÓRMULA: ¿qué chance tenés de que te salga?
//   - Arrancás en 45%.
//   - Cada punto de tu stat por ENCIMA de la dificultad suma 9%.
//     (y cada punto por DEBAJO resta 9%)
//   - Si estás cansado (energía < 30) restás 10%.
//   - Nunca menos de 8% ni más de 95%: en el fútbol todo puede pasar.
function probabilidad(op) {
  if (op.prob) return op.prob;         // jugada de pura suerte
  if (!op.stat) return 100;            // decisión sin dado
  let p = 45 + (stat(op.stat) - op.dif) * 9 + P.bonus;
  if (E.energia < 30) p -= 10;
  return Math.max(8, Math.min(95, p));
}

function detalleJugada(op) {
  if (op.prob) return `Suerte · ${op.prob}%`;
  if (!op.stat) return "Decisión";
  const s = STATS[op.stat];
  return `${s.emoji} ${s.nombre} ${stat(op.stat)} · ${probabilidad(op)}%`;
}

function resolverJugada(op) {
  const conDado = op.stat || op.prob;
  const salio = !conDado || Math.random() * 100 < probabilidad(op);
  const r = salio ? op.exito : (op.fallo || op.exito);

  narrar("▸ " + op.texto, "eleccion");
  if (conDado) narrar(salio ? "✔ ¡TE SALE!" : "✘ NO TE SALE", salio ? "dado-bien" : "dado-mal");
  narrar(r.texto, "resultado");

  if (r.gol === "a") {
    P.a++;
    narrar("¡¡¡GOOOOOOOOL!!!", "gol");
  }
  if (r.gol === "b") {
    P.b++;
    narrar(`Gol de ${P.def.rival}.`, "gol-contra");
  }

  // Lo que cambia según cómo te fue:
  const cambioNota = r.nota !== undefined ? r.nota : (salio ? 0.5 : -0.5);
  P.nota = Math.max(1, Math.min(10, P.nota + cambioNota));
  if (r.fama) E.fama += r.fama;
  if (r.bonus) P.bonus += r.bonus;
  if (r.flag) for (const nombre in r.flag) sumarFlag(nombre, r.flag[nombre]);

  P.i++;
  actualizarMarcador();
  mostrarOpciones([{ texto: "Seguir ▸", accion: siguienteMomento }]);
}

function terminarPartido() {
  const resultado = P.a > P.b ? "gana" : P.a < P.b ? "pierde" : "empata";
  E.energia = Math.max(0, E.energia - 25);
  const xp = 15 + Math.round(P.nota * 3) + (resultado === "gana" ? 10 : 0);
  const aviso = ganarXP(xp);

  // Anotamos cómo salió, para que la historia lo pueda leer después.
  E.ultimoPartido = { a: P.a, b: P.b, nota: P.nota, resultado };

  const frase = { gana: "¡GANARON!", pierde: "Perdieron.", empata: "Empate." }[resultado];
  narrar(`**FINAL.** ${P.def.nuestro} ${P.a} – ${P.b} ${P.def.rival}. ${frase}\n\nTu nota: **${P.nota.toFixed(1)}** · +${xp} de experiencia · −25 de energía.${aviso}`, "final");
  guardar();

  const def = P.def;
  const partido = P;
  mostrarOpciones([{ texto: "Continuar", accion: () => def.alTerminar(partido, resultado) }]);
}
