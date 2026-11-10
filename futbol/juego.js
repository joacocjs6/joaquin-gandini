// =====================================================================
//  juego.js — Une todo: barra de estado, ficha del jugador y arranque
// =====================================================================
//  Orden en que se cargan los archivos (ver index.html):
//    datos.js -> estado.js -> relato.js -> historia.js -> mundo.js
//    -> misiones.js -> juego.js
//  Cada archivo puede usar lo que definieron los anteriores.
// =====================================================================


// ---------------------------------------------------------------------
// BARRA DE ARRIBA (HUD)
// ---------------------------------------------------------------------
function actualizarHUD() {
  $("hud-dia").textContent = E.dia;
  $("hud-energia").textContent = E.energia;
  $("hud-energia-barra").style.width = E.energia + "%";
  $("hud-plata").textContent = plata(E.plata);
  $("hud-fama").textContent = E.fama;
  $("hud-nivel").textContent = E.nivel;
  $("btn-ficha").classList.toggle("aviso", E.puntos > 0);
}


// ---------------------------------------------------------------------
// FICHA DEL JUGADOR
// ---------------------------------------------------------------------
// Textos para mostrar las decisiones que marcaron tu historia.
const RECUERDOS = {
  flaco: "Le pasás la pelota al Flaco",
  garra: "Te levantás cuando te pegan",
  peleador: "Te peleaste con el Colo",
  persiana: "Le pegaste a la persiana de Don Cacho",
  justo: "Reclamaste lo justo",
  concentrado: "Te concentraste frente a Ramón",
  lucido: "Te luciste frente a Ramón",
  ego: "Te gusta jugar solo",
  vidrio: "Rompiste un vidrio de la escuela",
  mili: "Jugás con Mili",
  equipo: "Pensás en el equipo",
  familia: "Le contaste a tu vieja",
  secreto: "Guardaste el secreto",
};

function abrirFicha() {
  dibujarFicha();
  $("ficha").hidden = false;
}

function dibujarFicha(confirmarBorrado = false) {
  const pos = E.posicion ? `${POSICIONES[E.posicion].emoji} ${POSICIONES[E.posicion].nombre}` : "Sin posición (todavía)";

  const filasStats = Object.keys(STATS).map((s) => {
    const extra = stat(s) - E.stats[s];
    return `<div class="stat">
      <span>${STATS[s].emoji} ${STATS[s].nombre}</span>
      <span class="barra"><i style="width:${(stat(s) / STAT_MAX) * 100}%"></i></span>
      <b>${stat(s)}${extra ? `<small> (+${extra})</small>` : ""}</b>
      ${E.puntos > 0 && E.stats[s] < STAT_MAX ? `<button data-subir="${s}" aria-label="Subir ${STATS[s].nombre}">+</button>` : "<span></span>"}
    </div>`;
  }).join("");

  const items = E.inventario.length
    ? E.inventario.map((id) => {
        const it = ITEMS[id];
        const puesto = E.equipo[it.lugar] === id;
        return `<button class="item ${puesto ? "puesto" : ""}" data-item="${id}">
          ${it.emoji} ${it.nombre}<small>${puesto ? "Puesto" : "Guardado"} · ${describirItem(it)}</small></button>`;
      }).join("")
    : "<p class='vacio'>Todavía no compraste nada. Pasá por La Percha 👕 o Deportes Gol 👟.</p>";

  const misiones = Object.keys(E.misiones).length
    ? Object.keys(E.misiones).map((id) =>
        `<li class="${E.misiones[id]}"><b>${E.misiones[id] === "hecha" ? "✅" : "⏳"} ${MISIONES[id].titulo}</b><br><small>${MISIONES[id].desc}</small></li>`).join("")
    : "<li class='vacio'>Hablá con la gente del barrio para conseguir misiones.</li>";

  const recuerdos = Object.keys(RECUERDOS).filter((f) => flag(f) > 0)
    .map((f) => `<li>${RECUERDOS[f]}</li>`).join("") || "<li class='vacio'>Tu historia recién empieza.</li>";

  $("ficha-contenido").innerHTML = `
    <header class="ficha-cabeza">
      <h2>${E.nombre}</h2>
      <p>${pos} · Nivel ${E.nivel} · Capítulo ${E.capitulo}</p>
      <div class="xp"><i style="width:${(E.xp / xpParaSubir()) * 100}%"></i></div>
      <small>${E.xp}/${xpParaSubir()} de experiencia</small>
    </header>
    <section>
      <h3>Estadísticas ${E.puntos > 0 ? `<em>${E.puntos} puntos para repartir</em>` : ""}</h3>
      ${filasStats}
      <p class="nota">✨ Estilo: <b>${estilo()}</b> · ⭐ Fama: <b>${E.fama}</b></p>
    </section>
    <section>
      <h3>Ropa y equipo</h3>
      <div class="items">${items}</div>
    </section>
    <section>
      <h3>Misiones</h3>
      <ul class="misiones">${misiones}</ul>
    </section>
    <section>
      <h3>Tu historia</h3>
      <ul class="recuerdos">${recuerdos}</ul>
    </section>
    <section>
      ${confirmarBorrado
        ? `<p>¿Seguro? Se borra toda la partida.</p>
           <button class="peligro" data-borrar="si">Sí, empezar de cero</button>
           <button data-borrar="no">No, seguir jugando</button>`
        : `<button class="peligro suave" data-borrar="preguntar">Nueva partida</button>`}
    </section>`;
}

// Un solo "escuchador" para todos los botones de la ficha.
$("ficha-contenido").addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");
  if (!boton) return;

  if (boton.dataset.subir) {
    E.stats[boton.dataset.subir]++;
    E.puntos--;
  }
  if (boton.dataset.item) {
    const id = boton.dataset.item;
    const lugar = ITEMS[id].lugar;
    if (E.equipo[lugar] === id) delete E.equipo[lugar];
    else E.equipo[lugar] = id;
  }
  if (boton.dataset.borrar === "preguntar") return dibujarFicha(true);
  if (boton.dataset.borrar === "si") {
    $("ficha").hidden = true;
    borrarPartida();
    nuevaPartida();
    return;
  }
  guardar();
  dibujarFicha();
  actualizarHUD();
});

$("btn-ficha").addEventListener("click", abrirFicha);
$("btn-cerrar-ficha").addEventListener("click", () => {
  $("ficha").hidden = true;
  if (!$("vista-mundo").hidden) dibujarMundo();
});


// ---------------------------------------------------------------------
// TECLADO Y BOTONES DE MOVIMIENTO
// ---------------------------------------------------------------------
document.addEventListener("keydown", (evento) => {
  if (!$("ficha").hidden) {
    if (evento.key === "Escape") $("btn-cerrar-ficha").click();
    return;
  }
  if (evento.target.tagName === "INPUT") return;
  const teclas = {
    ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1],
    ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0],
  };
  const dir = teclas[evento.key];
  if (dir && !$("vista-mundo").hidden) {
    evento.preventDefault();
    mover(dir[0], dir[1]);
  }
});

document.querySelectorAll("[data-dir]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const [dx, dy] = boton.dataset.dir.split(",").map(Number);
    mover(dx, dy);
  });
});


// ---------------------------------------------------------------------
// ARRANQUE
// ---------------------------------------------------------------------
function nuevaPartida() {
  E = estadoNuevo();
  pedirNombre(() => irA("c1_intro"));
}

function continuar() {
  if (E.capitulo === 1) irA("c1_intro");
  else volverAlMundo(`Día ${E.dia}. ${objetivo()}`);
}

function iniciar() {
  if (cargar() && E.nombre) {
    mostrarRelato("Pibe de Potrero", `Bienvenido de vuelta, **${E.nombre}**.\n\nDía ${E.dia} · Capítulo ${E.capitulo} · Nivel ${E.nivel}`, [
      { texto: "Continuar", accion: continuar },
      { texto: "Empezar de nuevo", accion: () => { borrarPartida(); nuevaPartida(); } },
    ]);
  } else {
    nuevaPartida();
  }
}

iniciar();
