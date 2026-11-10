// =====================================================================
//  mundo.js — El mundo abierto: mapas, movimiento y lugares
// =====================================================================
//  Es el mismo sistema de la Lección 1 (mapa de letras + moverse con
//  flechas + colisiones), pero ahora con varios mapas y lugares a los
//  que podés entrar.
// =====================================================================

const TAM = 40;
const canvas = document.getElementById("mapa");
const pincel = canvas.getContext("2d");


// ---------------------------------------------------------------------
// LUGARES Y PERSONAS de cada mapa
// ---------------------------------------------------------------------
// Para cada mapa: letra -> { emoji, nombre, accion }
// "visible" (opcional): si devuelve false, el lugar no aparece.
const PUNTOS = {
  barrio: {
    H: { emoji: "🏠", nombre: "Tu casa", accion: () => casa() },
    R: { emoji: "👕", nombre: "La Percha", accion: () => tienda("ropa", "La Percha · Ropa", "—¡Hola, corazón! Pasá, mirá tranquilo. Lo que tiene pinta, tiene pinta.") },
    D: { emoji: "👟", nombre: "Deportes Gol", accion: () => tienda("deportes", "Deportes Gol", "—¿Qué andás buscando, pibe? Acá tenemos todo para la cancha.") },
    K: { emoji: "⚽", nombre: "El potrero", accion: () => entrenar("potrero") },
    E: { emoji: "🏫", nombre: "Escuela N° 14", accion: () => escuela() },
    P: { emoji: "🚏", nombre: "Parada del 37", accion: () => parada() },
    F: { emoji: "🧒", nombre: "El Flaco", accion: () => hablarFlaco() },
    V: { emoji: "👵", nombre: "Doña Rosa", accion: () => hablarRosa() },
  },
  puente: {
    B: { emoji: "😎", nombre: "Bruno", accion: () => hablarBruno() },
    O: { emoji: "🏐", nombre: "Pelota perdida", visible: () => E.misiones.pelota === "activa" && !flag("pelotaEncontrada"), accion: () => encontrarPelota() },
    P: { emoji: "🚏", nombre: "Parada del 37", accion: () => parada() },
  },
  centro: {
    U: { emoji: "🏟️", nombre: "Club Unión del Sur", accion: () => club() },
    A: { emoji: "🏪", nombre: "Almacén de Don Tito", accion: () => hablarTito() },
    X: { emoji: "📸", nombre: "Lucía, fotógrafa", accion: () => hablarLucia() },
    P: { emoji: "🚏", nombre: "Parada del 37", accion: () => parada() },
  },
};

// Devuelve el lugar de una baldosa (o null si no hay o está oculto).
function puntoEn(mapa, letra) {
  const p = PUNTOS[mapa][letra];
  if (!p) return null;
  if (p.visible && !p.visible()) return null;
  return p;
}


// ---------------------------------------------------------------------
// DIBUJAR EL MAPA
// ---------------------------------------------------------------------
function dibujarMundo() {
  const mapa = MAPAS[E.mapa];
  canvas.width = mapa.filas[0].length * TAM;
  canvas.height = mapa.filas.length * TAM;

  for (let y = 0; y < mapa.filas.length; y++) {
    for (let x = 0; x < mapa.filas[y].length; x++) {
      const letra = mapa.filas[y][x];
      const baldosa = BALDOSAS[letra];
      const punto = puntoEn(E.mapa, letra);

      // Color de fondo: el de la baldosa, o el piso del mapa.
      pincel.fillStyle = (baldosa && baldosa.color) || mapa.piso;
      pincel.fillRect(x * TAM, y * TAM, TAM, TAM);

      // Líneas de la calle, para que se vea como asfalto.
      if (letra === "=") {
        pincel.fillStyle = "rgba(255,255,255,.25)";
        pincel.fillRect(x * TAM + 14, y * TAM + TAM / 2 - 1, 12, 2);
      }

      const emoji = punto ? punto.emoji : baldosa && baldosa.emoji;
      if (emoji) dibujarEmoji(emoji, x, y);
    }
  }
  dibujarEmoji("🏃", E.x, E.y);

  document.getElementById("lugar").textContent = `📍 ${mapa.nombre}`;
  document.getElementById("objetivo").textContent = "🎯 " + objetivo();
  actualizarHUD();
}

function dibujarEmoji(emoji, x, y) {
  pincel.font = `${TAM * 0.72}px serif`;
  pincel.textAlign = "center";
  pincel.textBaseline = "middle";
  pincel.fillText(emoji, x * TAM + TAM / 2, y * TAM + TAM / 2 + 2);
}

function mensaje(texto) {
  document.getElementById("mensaje").textContent = texto;
}

function volverAlMundo(texto) {
  P = null;
  mostrarVista("mundo");
  dibujarMundo();
  if (texto) mensaje(texto);
  guardar();
}


// ---------------------------------------------------------------------
// MOVERSE
// ---------------------------------------------------------------------
function mover(dx, dy) {
  if (document.getElementById("vista-mundo").hidden) return;
  const mapa = MAPAS[E.mapa];
  const nx = E.x + dx;
  const ny = E.y + dy;
  const letra = mapa.filas[ny][nx];

  // ¿Hay un lugar o una persona? Entonces interactuamos.
  const punto = puntoEn(E.mapa, letra);
  if (punto) {
    punto.accion();
    return;
  }

  // ¿La baldosa bloquea? (pared, árbol, agua)
  const baldosa = BALDOSAS[letra];
  if (!baldosa || baldosa.bloquea) return;

  E.x = nx;
  E.y = ny;
  dibujarMundo();
}


// ---------------------------------------------------------------------
// ¿QUÉ TENGO QUE HACER AHORA?
// ---------------------------------------------------------------------
function objetivo() {
  if (E.capitulo === 2) {
    return E.dia > E.diaFinCapitulo
      ? "Andá a la escuela 🏫."
      : "Dormí en tu casa 🏠; mañana hay escuela.";
  }
  if (E.capitulo === 3) return "Probate en el Club Unión del Sur 🏟️ (Centro, en colectivo 🚏).";
  if (E.capitulo >= 4) return "Entrená en el club y completá misiones. Capítulo 4 en camino.";
  return "";
}


// ---------------------------------------------------------------------
// LUGARES
// ---------------------------------------------------------------------
const VOLVER = { texto: "Volver al mapa", accion: () => volverAlMundo() };

function casa() {
  let charla = "—¿Comiste? Hay milanesas en la heladera.";
  if (E.capitulo === 3 && flag("familia")) charla = "—¿Ya te compraste los botines? No me hagas quedar mal con ese señor Ramón, eh.";
  if (E.capitulo >= 4) charla = "—Mi hijo, jugador de Unión del Sur... —dice tu vieja, mostrándole la foto a la vecina por teléfono por quinta vez.";
  if (E.energia < 30) charla += "\n\nTenés cara de muerto. Andá a dormir.";

  mostrarRelato("Tu casa", `Tu vieja está en la cocina con la radio prendida.\n\n${charla}\n\nEnergía: ${E.energia}/100`, [
    {
      texto: "🛏️ Dormir hasta mañana", detalle: "Recuperás toda la energía",
      accion: () => {
        E.dia++;
        E.energia = 100;
        volverAlMundo(`Día ${E.dia}. Te levantás con todas las pilas.`);
      },
    },
    VOLVER,
  ]);
}

function escuela() {
  if (E.capitulo === 2 && E.dia > E.diaFinCapitulo) {
    irA("c2_intro");
  } else if (E.capitulo === 2) {
    mensaje("La escuela está cerrada. Es de noche: andá a dormir 🏠 y volvé mañana.");
  } else {
    const extra = flag("mili") ? " Mili te saluda desde la puerta: —¡Eh, crack!" : "";
    mensaje("La Escuela N° 14. El patio vacío parece más chico sin la pelota." + extra);
  }
}

function parada() {
  const destinos = Object.keys(MAPAS).filter((id) => id !== E.mapa);
  mostrarRelato("Parada del 37", "El 37 pasa cada veinte minutos (cuando pasa). Le pagás con la SUBE.\n\n¿A dónde vas?", [
    ...destinos.map((id) => ({
      texto: `🚌 ${MAPAS[id].nombre}`,
      accion: () => {
        E.mapa = id;
        E.x = MAPAS[id].llegada.x;
        E.y = MAPAS[id].llegada.y;
        volverAlMundo(`Llegaste a ${MAPAS[id].nombre}.`);
      },
    })),
    VOLVER,
  ]);
}

function club() {
  if (E.capitulo < 3) {
    mensaje("El Club Unión del Sur. Por el alambrado ves entrenar a los pibes de las inferiores. Algún día...");
  } else if (E.capitulo === 3) {
    if (E.posicion && E.dia <= E.diaFinCapitulo) {
      mensaje("Medina te dijo que vuelvas otro día. Dormí 🏠 y volvé.");
    } else {
      irA(E.posicion ? "c3_revancha" : "c3_intro");
    }
  } else {
    entrenar("club");
  }
}


// ---------------------------------------------------------------------
// TIENDAS
// ---------------------------------------------------------------------
function describirItem(item) {
  const partes = [];
  if (item.bonus) for (const s in item.bonus) partes.push(`+${item.bonus[s]} ${STATS[s].nombre}`);
  if (item.estilo) partes.push(`+${item.estilo} Estilo`);
  return partes.join(", ");
}

function tienda(tipo, titulo, saludo) {
  const ids = Object.keys(ITEMS).filter((id) => ITEMS[id].tienda === tipo);
  mostrarRelato(titulo, `${saludo}\n\nTenés **${plata(E.plata)}**.`, [
    ...ids.map((id) => {
      const item = ITEMS[id];
      const tiene = E.inventario.includes(id);
      return {
        texto: `${item.emoji} ${item.nombre}`,
        detalle: tiene ? "Ya lo tenés" : `${plata(item.precio)} · ${describirItem(item)}`,
        deshabilitada: tiene || E.plata < item.precio,
        accion: () => {
          E.plata -= item.precio;
          E.inventario.push(id);
          E.equipo[item.lugar] = id; // te lo ponés directamente
          guardar();
          tienda(tipo, titulo, `¡Te queda bárbaro! Ya tenés puesto: ${item.nombre}. (Podés cambiarte en tu Ficha.)`);
        },
      };
    }),
    VOLVER,
  ]);
}


// ---------------------------------------------------------------------
// ENTRENAMIENTO
// ---------------------------------------------------------------------
// Cada sesión cuesta 25 de energía y suma progreso a una stat.
// Al llegar a 3 de progreso, la stat sube 1. El club rinde el doble.
const EJERCICIOS = {
  velocidad: "Piques de esquina a esquina",
  regate: "Gambeta entre botellas de plástico",
  tiro: "Patear contra el paredón del galpón",
  pase: "Paredes contra el cordón",
  defensa: "Uno contra uno con el Gordo",
  fisico: "Subir y bajar las escaleras del monoblock",
};

function entrenar(lugar, resultado = "") {
  const rinde = lugar === "club" ? 2 : 1;
  const titulo = lugar === "club" ? "Entrenamiento · Unión del Sur" : "El potrero";
  const intro = lugar === "club"
    ? "Conos, pecheras y el silbato de Medina. Acá se entrena en serio (progreso x2)."
    : "Un terreno baldío con dos arcos de caño oxidado. Acá aprendieron todos los del barrio.";

  mostrarRelato(titulo, `${resultado || intro}\n\nEnergía: **${E.energia}/100** · Cada sesión cuesta 25.`, [
    ...Object.keys(STATS).map((s) => ({
      texto: `${STATS[s].emoji} ${lugar === "club" ? "Entrenar " + STATS[s].nombre : EJERCICIOS[s]}`,
      detalle: `${STATS[s].nombre} ${E.stats[s]} · progreso ${E.progreso[s] || 0}/3`,
      deshabilitada: E.energia < 25 || E.stats[s] >= STAT_MAX,
      accion: () => {
        E.energia -= 25;
        E.progreso[s] = (E.progreso[s] || 0) + rinde;
        let texto = `Entrenaste ${STATS[s].nombre}. Terminás transpirado y feliz.`;
        if (E.progreso[s] >= 3) {
          E.progreso[s] -= 3;
          E.stats[s]++;
          texto = `💥 ¡Tu ${STATS[s].nombre} sube a ${E.stats[s]}!`;
        }
        texto += ganarXP(10);
        guardar();
        entrenar(lugar, texto);
      },
    })),
    VOLVER,
  ]);
}
