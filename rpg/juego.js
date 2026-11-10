// =====================================================================
//  LECCIÓN 1 — Un mundo, un héroe y moverse por el mapa
// =====================================================================
//  Este archivo es el "cerebro" del juego. El HTML (index.html) solo
//  pone la pantalla; todo lo que pasa en el juego se decide acá.
//
//  Ideas que vas a aprender en este archivo:
//    1. El MAPA como una lista de textos (cada letra es una baldosa).
//    2. El JUGADOR como un "objeto" con datos (posición, vida, oro...).
//    3. DIBUJAR: recorrer el mapa y pintar cada baldosa en el canvas.
//    4. ENTRADA: escuchar las teclas y mover al jugador.
//    5. COLISIONES: no dejar que el jugador camine sobre paredes o agua.
//    6. INTERACCIÓN: cofres que dan oro y personajes que hablan.
// =====================================================================


// ---------------------------------------------------------------------
// 1. EL MAPA
// ---------------------------------------------------------------------
// Cada texto es una FILA del mapa. Cada letra es una baldosa ("tile").
// Cambiá letras y recargá la página: ¡el mundo cambia!
//
//   #  = pared de piedra      .  = pasto
//   ~  = agua                 T  = árbol
//   =  = camino               $  = cofre con oro
//   A  = aldeano (habla)      @  = donde empieza el héroe
const MAPA = [
  "################",
  "#..T....~~~....#",
  "#.@.....~~~..$.#",
  "#..====.~~~....#",
  "#.....=........#",
  "#.T...====A..T.#",
  "#.........=....#",
  "#..$..T...=..T.#",
  "#.........=....#",
  "################",
];

// Tamaño en píxeles de cada baldosa en la pantalla.
const TAM = 40;

// Qué color tiene cada tipo de baldosa.
const COLORES = {
  "#": "#5b5f6b", // pared
  ".": "#4f8a3c", // pasto
  "~": "#2f6fb0", // agua
  "T": "#4f8a3c", // árbol (fondo de pasto, el dibujo va arriba)
  "=": "#b49a6a", // camino
  "$": "#4f8a3c", // cofre (fondo de pasto)
  "A": "#b49a6a", // aldeano (parado en el camino)
};

// Algunas baldosas tienen un dibujito (emoji) encima del color.
const DIBUJOS = {
  "T": "🌲",
  "$": "📦",
  "A": "🧑‍🌾",
};

// Baldosas por las que NO se puede caminar.
const BLOQUEAN = ["#", "~", "T", "A"];


// ---------------------------------------------------------------------
// 2. EL JUGADOR
// ---------------------------------------------------------------------
// Un "objeto" agrupa varios datos bajo un mismo nombre.
// jugador.x es la columna, jugador.y es la fila.
const jugador = {
  nombre: "Héroe",
  x: 0,
  y: 0,
  vida: 20,
  vidaMax: 20,
  nivel: 1,
  oro: 0,
};

// El mapa de arriba es de texto y los textos no se pueden modificar
// letra por letra. Lo convertimos en una "grilla" (lista de listas)
// para poder cambiar baldosas, por ejemplo cuando abrimos un cofre.
const grilla = MAPA.map((fila) => fila.split(""));

// Buscamos la @ para saber dónde arranca el héroe, y la cambiamos
// por pasto (la @ solo marca la posición inicial).
for (let y = 0; y < grilla.length; y++) {
  for (let x = 0; x < grilla[y].length; x++) {
    if (grilla[y][x] === "@") {
      jugador.x = x;
      jugador.y = y;
      grilla[y][x] = ".";
    }
  }
}


// ---------------------------------------------------------------------
// 3. DIBUJAR
// ---------------------------------------------------------------------
// El <canvas> es un lienzo donde podemos pintar con código.
const canvas = document.getElementById("pantalla");
const pincel = canvas.getContext("2d");

// El canvas mide exactamente lo que mide el mapa.
canvas.width = grilla[0].length * TAM;
canvas.height = grilla.length * TAM;

function dibujar() {
  // Recorremos fila por fila, columna por columna.
  for (let y = 0; y < grilla.length; y++) {
    for (let x = 0; x < grilla[y].length; x++) {
      const letra = grilla[y][x];

      // Pintamos el cuadrado de color de la baldosa.
      pincel.fillStyle = COLORES[letra];
      pincel.fillRect(x * TAM, y * TAM, TAM, TAM);

      // Si tiene dibujito, lo ponemos encima.
      if (DIBUJOS[letra]) {
        escribirEmoji(DIBUJOS[letra], x, y);
      }
    }
  }

  // El jugador se dibuja al final, para que quede arriba de todo.
  escribirEmoji("🧙", jugador.x, jugador.y);

  actualizarPanel();
}

function escribirEmoji(emoji, x, y) {
  pincel.font = `${TAM * 0.75}px serif`;
  pincel.textAlign = "center";
  pincel.textBaseline = "middle";
  pincel.fillText(emoji, x * TAM + TAM / 2, y * TAM + TAM / 2 + 2);
}

// Muestra los datos del jugador en el panel de al lado.
function actualizarPanel() {
  document.getElementById("vida").textContent = `${jugador.vida} / ${jugador.vidaMax}`;
  document.getElementById("nivel").textContent = jugador.nivel;
  document.getElementById("oro").textContent = jugador.oro;
}

// Escribe un mensaje en la caja de diálogo de abajo.
function mensaje(texto) {
  document.getElementById("mensaje").textContent = texto;
}


// ---------------------------------------------------------------------
// 4 y 5. MOVERSE (con colisiones)
// ---------------------------------------------------------------------
// dx y dy dicen hacia dónde: dx = -1 izquierda, +1 derecha;
//                            dy = -1 arriba,    +1 abajo.
function mover(dx, dy) {
  const nuevoX = jugador.x + dx;
  const nuevoY = jugador.y + dy;
  const destino = grilla[nuevoY][nuevoX];

  // ¿Hay algo con qué interactuar? (cofre o aldeano)
  if (interactuar(destino, nuevoX, nuevoY)) {
    dibujar();
    return;
  }

  // COLISIÓN: si la baldosa bloquea, no nos movemos.
  if (BLOQUEAN.includes(destino)) {
    return;
  }

  // Si llegamos acá, el camino está libre: nos movemos.
  jugador.x = nuevoX;
  jugador.y = nuevoY;
  dibujar();
}


// ---------------------------------------------------------------------
// 6. INTERACCIÓN
// ---------------------------------------------------------------------
// Devuelve true si pasó algo especial (y entonces no caminamos).
function interactuar(letra, x, y) {
  if (letra === "$") {
    const encontrado = 10 + Math.floor(Math.random() * 11); // entre 10 y 20
    jugador.oro += encontrado;
    grilla[y][x] = "."; // el cofre desaparece
    mensaje(`Abriste un cofre: ¡${encontrado} monedas de oro!`);
    return true;
  }

  if (letra === "A") {
    mensaje("Aldeano: «Dicen que al otro lado del río hay monstruos... ¡tené cuidado!»");
    return true;
  }

  return false;
}


// ---------------------------------------------------------------------
// ENTRADA: teclado y botones
// ---------------------------------------------------------------------
// "addEventListener" significa: "cuando pase X, ejecutá esta función".
document.addEventListener("keydown", (evento) => {
  const tecla = evento.key;
  if (tecla === "ArrowUp" || tecla === "w") mover(0, -1);
  if (tecla === "ArrowDown" || tecla === "s") mover(0, 1);
  if (tecla === "ArrowLeft" || tecla === "a") mover(-1, 0);
  if (tecla === "ArrowRight" || tecla === "d") mover(1, 0);

  // Evita que las flechas hagan scroll en la página.
  if (tecla.startsWith("Arrow")) evento.preventDefault();
});

// Botones en pantalla para jugar desde el celular.
document.querySelectorAll("[data-dir]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const [dx, dy] = boton.dataset.dir.split(",").map(Number);
    mover(dx, dy);
  });
});


// ---------------------------------------------------------------------
// ¡ARRANCA EL JUEGO!
// ---------------------------------------------------------------------
mensaje("Usá las flechas (o W A S D) para moverte. Caminá hacia un 📦 para abrirlo.");
dibujar();
