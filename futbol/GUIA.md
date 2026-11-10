# Pibe de Potrero — Guía para aprender con tu juego

Un RPG de fútbol por capítulos. Un pibe de barrio juega en la calle, un ojeador
lo descubre y llega a probarse en un club. Las decisiones que tomás en los
partidos cambian la historia.

## Cómo jugar

Abrí `index.html` en el navegador (doble clic). La partida se guarda sola.

- **Mapa**: te movés con las flechas, con W A S D o con los botones. Para entrar a un lugar o hablar con alguien, caminá contra él.
- **Ficha** (botón de arriba): tus stats, la ropa, las misiones y las decisiones que marcaron tu historia.
- **Partidos**: en cada jugada elegís qué hacer. Cada opción muestra qué stat usa y qué chance tenés.

## Qué hay en el juego

| Capítulo | Qué pasa |
|---|---|
| 1 · El potrero | Partido en la calle contra los del Pasaje. Aparece el ojeador. |
| 2 · El recreo | Partido en el patio de la escuela. Ramón te da la tarjeta del club. |
| 3 · La prueba | Elegís posición, repartís puntos y te probás en Unión del Sur. |
| 4 · El debut | *Lo hacemos juntos* |

**Mundo abierto:** Villa Esperanza (tu casa, el potrero, la escuela, La Percha,
Deportes Gol), El Puente y El Centro. Para ir de un barrio a otro, te tomás el colectivo 🚏.

**Misiones secundarias:** la pelota de Benja, el rey del Puente, la changa del
almacén y la sesión de fotos.

## Cómo está armado (en el orden en que se cargan)

| Archivo | Qué tiene | Tocalo si querés... |
|---|---|---|
| `datos.js` | Stats, posiciones, ropa, mapas | agregar botines, ropa o un barrio |
| `estado.js` | Lo que el juego recuerda (y cómo se guarda) | agregar un dato nuevo al jugador |
| `relato.js` | El motor de escenas y partidos | cambiar la fórmula de las jugadas |
| `historia.js` | Los capítulos | **escribir historia** |
| `mundo.js` | Moverse, lugares, tiendas, entrenamiento | agregar un lugar |
| `misiones.js` | Misiones y personajes | agregar una misión |
| `juego.js` | La barra de arriba, la ficha y el arranque | — |

## Conceptos nuevos (además de los de la Lección 1)

- **Separar datos de lógica.** La historia está escrita como datos (texto y opciones) y un solo motor (`irA`) la muestra. Para agregar una escena no tenés que programar: tenés que escribir.
- **Estado.** Todo lo que el juego recuerda vive en un único objeto, `E`. Guardar la partida es guardar ese objeto en el navegador (`localStorage`).
- **Flags (banderitas).** Cada decisión importante queda anotada. Por ejemplo, si le pasás la pelota al Flaco se guarda `flaco: 1`. Más adelante, Ramón y el Flaco leen esas banderitas y te dicen cosas distintas.
- **Probabilidad.** En `relato.js`, `probabilidad()` arranca en 45%, suma 9% por cada punto que tu stat supera a la dificultad (y resta 9% por cada punto que le falta), y después tira un "dado" con `Math.random()`.
- **Funciones como datos.** Un texto puede ser una función (`texto: () => ...`), así cambia según tu partida.

## 🎯 Ejercicios

1. **Fácil.** Agregá unos botines nuevos en `ITEMS` (`datos.js`), con tu nombre y tu precio.
2. **Fácil.** Cambiá lo que dice el Flaco en `frases` (`misiones.js`).
3. **Medio.** Agregá una opción nueva a una jugada del Capítulo 1 en `historia.js`. Por ejemplo: "Pedirle la pelota al Gordo para que saque largo".
4. **Medio.** Hacé que la fórmula de `probabilidad()` también tenga en cuenta tu fama.
5. **Difícil.** Escribí una escena nueva donde el Colo vuelve a aparecer si tenés el flag `peleador`.

Si algo se rompe: F12, pestaña **Console**.
