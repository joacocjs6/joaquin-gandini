# Mi Primer RPG — Guía de lecciones

Vamos a hacer un RPG paso a paso. Cada lección agrega una pieza nueva y explica
qué hace. No necesitás instalar nada: solo un navegador (Chrome, Firefox, etc.).

## Cómo jugar / probar

1. Descargá la carpeta `rpg/`.
2. Abrí `index.html` con doble clic (se abre en el navegador).
3. Para ver tus cambios: guardá el archivo y recargá la página (F5).

Para editar el código te recomiendo [Visual Studio Code](https://code.visualstudio.com/) (gratis).

## Los 3 lenguajes de la web

| Archivo | Lenguaje | Para qué sirve |
|---|---|---|
| `index.html` | HTML | La **estructura**: qué cosas hay en la pantalla |
| `index.html` (parte `<style>`) | CSS | El **aspecto**: colores, tamaños, tipografía |
| `juego.js` | JavaScript | El **comportamiento**: las reglas del juego |

---

## Lección 1 — El mundo y el héroe ✅

Abrí `juego.js` y leelo de arriba a abajo: cada parte tiene comentarios.

**Conceptos nuevos:**

- **Variable**: una caja con nombre que guarda un dato. `const TAM = 40;`
- **Lista (array)**: varios datos en orden. El mapa es una lista de filas.
- **Objeto**: varios datos agrupados con nombre. `jugador.oro`, `jugador.vida`.
- **Función**: un bloque de instrucciones con nombre que podés usar muchas veces.
  `mover(1, 0)` mueve al héroe un paso a la derecha.
- **if (si...)**: tomar decisiones. *"Si* la baldosa es pared, no te muevas".
- **for (repetir)**: recorrer el mapa casilla por casilla para dibujarlo.
- **Eventos**: *"cuando* se apriete una tecla, ejecutá esto".

**Cómo funciona un juego por turnos como este:**

```
esperar tecla → actualizar datos (mover, abrir cofre...) → dibujar todo de nuevo → esperar tecla
```

### 🎯 Ejercicios (probalos vos)

1. **Cambiá el mapa**: en `MAPA`, agregá más árboles `T`, agua `~` o cofres `$`.
2. **Cambiá al héroe**: en `escribirEmoji("🧙", ...)` probá con 🧝, 🦸 o 🐱.
3. **Nueva baldosa**: agregá lava `L` que bloquee el paso.
   Pista: necesitás tocar `COLORES` y `BLOQUEAN`.
4. **Nuevo diálogo**: cambiá lo que dice el aldeano en la función `interactuar`.

Si algo se rompe, no pasa nada: apretá **F12** en el navegador y mirá la pestaña
**Console**; ahí aparecen los errores con el número de línea.

---

## Próximas lecciones

- **Lección 2 — Combate por turnos**: monstruos, atacar, curarse, ganar experiencia.
- **Lección 3 — Subir de nivel**: experiencia, estadísticas, más fuerza y vida.
- **Lección 4 — Inventario y tienda**: gastar el oro en pociones y armas.
- **Lección 5 — Varios mapas**: entrar a un pueblo, una cueva, un castillo.
- **Lección 6 — Guardar la partida**.
