// =====================================================================
//  datos.js — Las "piezas" del juego: stats, posiciones, ropa, mapas
// =====================================================================
//  Acá no hay lógica: solo DATOS. Separar los datos de la lógica es una
//  de las ideas más importantes al programar juegos: si querés agregar
//  unos botines nuevos o un barrio nuevo, tocás este archivo y listo.
// =====================================================================


// ---------------------------------------------------------------------
// ESTADÍSTICAS DEL JUGADOR
// ---------------------------------------------------------------------
// Cada stat va de 1 a 15. En los partidos, cuanto más alta, más chances
// tenés de que te salga la jugada que elegiste.
const STATS = {
  velocidad: { nombre: "Velocidad", emoji: "⚡" },
  regate:    { nombre: "Gambeta",   emoji: "🌀" },
  tiro:      { nombre: "Definición", emoji: "🎯" },
  pase:      { nombre: "Pase",      emoji: "🤝" },
  defensa:   { nombre: "Marca",     emoji: "🛡️" },
  fisico:    { nombre: "Físico",    emoji: "💪" },
};
const STAT_MAX = 15;


// ---------------------------------------------------------------------
// POSICIONES (se elige en el Capítulo 3)
// ---------------------------------------------------------------------
// "bonus" se suma a tus stats cuando elegís la posición.
const POSICIONES = {
  arquero: {
    nombre: "Arquero", emoji: "🧤",
    bonus: { defensa: 2, fisico: 1 },
    desc: "El último en caer. Reflejos, coraje y voz de mando.",
  },
  defensor: {
    nombre: "Defensor", emoji: "🧱",
    bonus: { defensa: 2, fisico: 1 },
    desc: "Por acá no pasa nadie. Anticipo, marca y salida limpia.",
  },
  medio: {
    nombre: "Mediocampista", emoji: "🧠",
    bonus: { pase: 2, regate: 1 },
    desc: "El cerebro. Ve la jugada antes que los demás.",
  },
  delantero: {
    nombre: "Delantero", emoji: "🔥",
    bonus: { tiro: 2, velocidad: 1 },
    desc: "Vive para el gol. Picante, rápido y sin miedo.",
  },
};


// ---------------------------------------------------------------------
// ROPA Y ACCESORIOS
// ---------------------------------------------------------------------
// tienda: en qué local se vende ("ropa" = La Percha, "deportes" = Deportes Gol)
// lugar:  dónde se pone (solo podés llevar una cosa por lugar)
// bonus:  qué stats mejora
// estilo: la ropa te da "estilo", que abre puertas en algunas misiones
const ITEMS = {
  gorra:      { nombre: "Gorra plana",            emoji: "🧢", tienda: "ropa", lugar: "cabeza",  precio: 600,  estilo: 1 },
  remera:     { nombre: "Camiseta retro",         emoji: "👕", tienda: "ropa", lugar: "torso",   precio: 900,  estilo: 1 },
  campera:    { nombre: "Campera de la Selección", emoji: "🧥", tienda: "ropa", lugar: "torso",  precio: 2500, estilo: 2 },
  cadenita:   { nombre: "Cadenita",               emoji: "📿", tienda: "ropa", lugar: "cuello",  precio: 1200, estilo: 1 },

  vincha:     { nombre: "Vincha",                 emoji: "🎽", tienda: "deportes", lugar: "cabeza", precio: 500,  bonus: { fisico: 1 } },
  canilleras: { nombre: "Canilleras",             emoji: "🦵", tienda: "deportes", lugar: "piernas", precio: 1000, bonus: { defensa: 1 } },
  guantes:    { nombre: "Guantes de arquero",     emoji: "🧤", tienda: "deportes", lugar: "manos",  precio: 1500, bonus: { defensa: 2 } },
  botines1:   { nombre: "Botines de cuero",       emoji: "👟", tienda: "deportes", lugar: "pies",   precio: 3000, bonus: { velocidad: 1, tiro: 1 } },
  botines2:   { nombre: "Botines Pro con tapones", emoji: "⚽", tienda: "deportes", lugar: "pies",   precio: 6000, bonus: { velocidad: 2, regate: 1, tiro: 1 } },
};


// ---------------------------------------------------------------------
// MAPAS
// ---------------------------------------------------------------------
// Igual que en la Lección 1: cada letra es una baldosa.
//   #  pared    .  vereda/pasto    =  calle    ~  arroyo    T  árbol
// Las LETRAS MAYÚSCULAS son lugares o personas. Qué hace cada una se
// define en "puntos" dentro de mundo.js (ahí está la lógica).
const MAPAS = {
  barrio: {
    nombre: "Villa Esperanza",
    piso: "#3d4a3a",
    filas: [
      "################",
      "#H...=....R..D.#",
      "#....=.........#",
      "#..T.=======...#",
      "#....=..K..=.T.#",
      "#.F..=.....=...#",
      "#....====..=.E.#",
      "#.T.....=..=...#",
      "#.....V.=..=.P.#",
      "################",
    ],
    llegada: { x: 12, y: 8 }, // dónde aparecés al bajar del colectivo
  },

  puente: {
    nombre: "El Puente",
    piso: "#45503b",
    filas: [
      "################",
      "#...T.....~~...#",
      "#..B......~~.O.#",
      "#.........==...#",
      "#..T......~~...#",
      "#.........~~.T.#",
      "#.P.......~~...#",
      "#.........~~...#",
      "#..T......==...#",
      "################",
    ],
    llegada: { x: 3, y: 6 },
  },

  centro: {
    nombre: "El Centro",
    piso: "#4a4a50",
    filas: [
      "################",
      "#..U.....A.....#",
      "#..............#",
      "#==============#",
      "#..............#",
      "#........X..T..#",
      "#..............#",
      "#.T.....P......#",
      "#..............#",
      "################",
    ],
    llegada: { x: 9, y: 7 },
  },
};

// Colores y dibujos de las baldosas comunes.
const BALDOSAS = {
  "#": { color: "#22252d", bloquea: true },
  ".": { color: null },                 // null = usa el "piso" del mapa
  "=": { color: "#5c5a55" },
  "~": { color: "#2c5f8a", bloquea: true },
  "T": { color: null, emoji: "🌳", bloquea: true },
};
