// =====================================================================
//  estado.js — Todo lo que el juego "recuerda" sobre tu partida
// =====================================================================
//  El ESTADO es un único objeto (E) con toda la información de la
//  partida: tu nombre, tus stats, tu plata, en qué capítulo vas, qué
//  decisiones tomaste... Guardar la partida = guardar este objeto.
// =====================================================================

const CLAVE_GUARDADO = "pibe-de-potrero-v1";

function estadoNuevo() {
  return {
    nombre: "",
    capitulo: 1,
    dia: 1,
    diaFinCapitulo: 0,   // en qué día terminaste el último capítulo
    energia: 100,
    plata: 1500,
    fama: 0,
    nivel: 1,
    xp: 0,
    puntos: 0,           // puntos para repartir entre tus stats
    posicion: null,      // se elige en el Capítulo 3

    stats: { velocidad: 4, regate: 4, tiro: 4, pase: 4, defensa: 3, fisico: 4 },
    progreso: {},        // cuánto entrenaste cada stat

    inventario: [],      // ids de ITEMS que compraste
    equipo: {},          // lugar -> id del item puesto

    // Las DECISIONES que tomás quedan anotadas acá como "flags"
    // (banderitas). Más adelante la historia las mira para cambiar.
    flags: {},

    misiones: {},        // id -> "activa" o "hecha"

    mapa: "barrio",
    x: 2,
    y: 1,
  };
}

// "let" porque al cargar o empezar de nuevo reemplazamos el objeto entero.
let E = estadoNuevo();


// ---------------------------------------------------------------------
// GUARDAR Y CARGAR
// ---------------------------------------------------------------------
// localStorage es una memoria chiquita del navegador que sobrevive
// aunque cierres la página. Solo guarda texto, así que convertimos el
// objeto a texto con JSON.stringify (y al revés con JSON.parse).
function guardar() {
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(E));
  } catch (error) {
    // Si el navegador no deja guardar, el juego sigue igual.
  }
}

function cargar() {
  try {
    const texto = localStorage.getItem(CLAVE_GUARDADO);
    if (texto) {
      E = Object.assign(estadoNuevo(), JSON.parse(texto));
      return true;
    }
  } catch (error) {}
  return false;
}

function borrarPartida() {
  try { localStorage.removeItem(CLAVE_GUARDADO); } catch (error) {}
  E = estadoNuevo();
}


// ---------------------------------------------------------------------
// AYUDANTES
// ---------------------------------------------------------------------

// Tu stat REAL = la base + lo que suman los botines, vincha, etc.
function stat(nombre) {
  let total = E.stats[nombre];
  for (const lugar in E.equipo) {
    const item = ITEMS[E.equipo[lugar]];
    if (item.bonus && item.bonus[nombre]) total += item.bonus[nombre];
  }
  return total;
}

// El estilo sale de la ropa que tenés puesta.
function estilo() {
  let total = 0;
  for (const lugar in E.equipo) total += ITEMS[E.equipo[lugar]].estilo || 0;
  return total;
}

// Leer y sumar flags (decisiones).
function flag(nombre) {
  return E.flags[nombre] || 0;
}
function sumarFlag(nombre, cuanto = 1) {
  E.flags[nombre] = flag(nombre) + cuanto;
}

// Experiencia: cada nivel pide 50 puntos más que el anterior.
function xpParaSubir() {
  return E.nivel * 50;
}
// Devuelve un texto si subiste de nivel (o "" si no).
function ganarXP(cantidad) {
  E.xp += cantidad;
  let aviso = "";
  while (E.xp >= xpParaSubir()) {
    E.xp -= xpParaSubir();
    E.nivel++;
    E.puntos += 2;
    aviso += `\n\n⬆️ ¡Subiste a nivel ${E.nivel}! Tenés 2 puntos para repartir en tu Ficha.`;
  }
  return aviso;
}

// Reemplaza {N} por el nombre del jugador en cualquier texto.
function conNombre(texto) {
  return texto.replaceAll("{N}", E.nombre);
}

// Número al azar entre min y max (incluidos).
function azar(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function plata(n) {
  return "$" + n.toLocaleString("es-AR");
}
