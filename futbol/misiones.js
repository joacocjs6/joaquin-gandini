// =====================================================================
//  misiones.js — Misiones secundarias y personajes del mundo
// =====================================================================
//  Una misión tiene 3 estados:
//    (no existe)  -> todavía no te la ofrecieron
//    "activa"     -> la aceptaste y está pendiente
//    "hecha"      -> la completaste
//  Cada personaje mira esos estados (y tus flags) para saber qué decir.
// =====================================================================

const MISIONES = {
  pelota: { titulo: "La pelota de Benja", desc: "Benja, el nieto de Doña Rosa, perdió su pelota en El Puente. Encontrala y devolvésela." },
  changa: { titulo: "Changa en el almacén", desc: "Llevale el pedido de Don Tito (Centro) a Doña Rosa (Villa Esperanza)." },
  bruno:  { titulo: "El rey del Puente", desc: "Ganale un picado a Bruno en El Puente." },
  foto:   { titulo: "Sesión de fotos", desc: "Lucía (Centro) busca un pibe con pinta. Necesitás 2 de Estilo (ropa de La Percha)." },
};

function aceptar(id) {
  E.misiones[id] = "activa";
  guardar();
}

function completar(id, premioPlata, premioFama) {
  E.misiones[id] = "hecha";
  E.plata += premioPlata;
  E.fama += premioFama;
  const aviso = ganarXP(30);
  guardar();
  return `\n\n✅ **Misión cumplida: ${MISIONES[id].titulo}**\n+${plata(premioPlata)} · +${premioFama} de fama · +30 de experiencia${aviso}`;
}


// ---------------------------------------------------------------------
// EL FLACO — tu mejor amigo. Recuerda cómo lo trataste en el partido.
// ---------------------------------------------------------------------
function hablarFlaco() {
  if (flag("flaco") === 0) {
    mostrarRelato("El Flaco", "El Flaco está sentado en el cordón, pateando una tapita.\n\n—Vos no me la pasás nunca, eh. Ayer estaba solo y ni me miraste.\n\n(En el Capítulo 1 no le pasaste la pelota. Las decisiones tienen consecuencias.)", [
      {
        texto: "Invitarle una Coca para arreglar", detalle: plata(300),
        deshabilitada: E.plata < 300,
        accion: () => {
          E.plata -= 300;
          sumarFlag("flaco");
          mostrarRelato("El Flaco", "Se toman la Coca en silencio. Al final, el Flaco se ríe.\n\n—Está bien, está bien. Pero la próxima, me la pasás.", [VOLVER]);
        },
      },
      VOLVER,
    ]);
    return;
  }

  if (!flag("flacoAyuda")) {
    sumarFlag("flacoAyuda");
    mostrarRelato("El Flaco", "—¡{N}! Me enteré de lo de Bruno, el del Puente. Dicen que nadie le gana en su cancha.\n\nSi vas a jugar contra él, avisame: **te hago de compañero**. Vos y yo, como siempre.\n\n(El Flaco te va a acompañar en el picado del Puente: +10% en todas las jugadas.)", [VOLVER]);
    return;
  }

  const frases = [
    "—¿Viste el partido de anoche? Qué golazo, por Dios.",
    "—Cuando seas famoso no te olvides de los del barrio, eh.",
    "—Mi vieja dice que vos vas a llegar. Yo le digo que ya llegaste.",
  ];
  mostrarRelato("El Flaco", frases[azar(0, frases.length - 1)], [VOLVER]);
}


// ---------------------------------------------------------------------
// DOÑA ROSA — misiones "La pelota de Benja" y entrega de la changa
// ---------------------------------------------------------------------
function hablarRosa() {
  // Primero: si traés el pedido del almacén, se lo entregás.
  if (E.misiones.changa === "activa") {
    const premio = completar("changa", 1200, 1);
    mostrarRelato("Doña Rosa", "—¡Ay, el pedido de Tito! Yerba, fideos y el dulce de leche. Qué amor, nene. Tomá, Tito me dijo que te pague yo." + premio, [VOLVER]);
    return;
  }

  const estado = E.misiones.pelota;
  if (!estado) {
    mostrarRelato("Doña Rosa", "—Nene, vos que andás con la pelota todo el día... Mi nieto Benja perdió la suya allá en **El Puente**, cerca del arroyo. Está que no para de llorar. ¿Me la buscarías?", [
      { texto: "Aceptar la misión", accion: () => { aceptar("pelota"); volverAlMundo("Misión nueva: La pelota de Benja. Tomá el colectivo 🚏 a El Puente."); } },
      VOLVER,
    ]);
  } else if (estado === "activa" && flag("pelotaEncontrada")) {
    const premio = completar("pelota", 800, 1);
    mostrarRelato("Doña Rosa", "Benja sale corriendo de la casa y te abraza la pierna. Doña Rosa te pellizca el cachete.\n\n—Sos un sol. Tomá, para un alfajor." + premio, [VOLVER]);
  } else if (estado === "activa") {
    mostrarRelato("Doña Rosa", "—¿Y? ¿La encontraste? Benja dice que la perdió del otro lado del arroyo, en El Puente.", [VOLVER]);
  } else {
    mostrarRelato("Doña Rosa", "—Benja ahora quiere ser como vos. Todo el día pateando contra la pared. Bendito sea.", [VOLVER]);
  }
}

function encontrarPelota() {
  sumarFlag("pelotaEncontrada");
  guardar();
  dibujarMundo();
  mensaje("¡Encontraste la pelota de Benja entre los yuyos! Llevásela a Doña Rosa 👵 en Villa Esperanza.");
}


// ---------------------------------------------------------------------
// BRUNO — el rey del Puente. Misión con partido.
// ---------------------------------------------------------------------
function hablarBruno() {
  if (E.misiones.bruno === "hecha") {
    mostrarRelato("Bruno", "—Eh, rey. —Bruno te choca el puño—. Cuando quieras, revancha. Pero hoy no, que me duele el orgullo.", [VOLVER]);
    return;
  }
  if (flag("brunoDia") === E.dia) {
    mostrarRelato("Bruno", "—Hoy ya jugamos, pibe. Andá a descansar y volvé otro día.", [VOLVER]);
    return;
  }
  const compania = flag("flacoAyuda")
    ? "\n\nEl Flaco aparece corriendo desde la parada: —¡Llegué! ¿Jugamos o qué?"
    : "\n\nVas a jugar con dos pibes del Puente que no conocés. (Tu amigo el Flaco podría ayudarte...)";
  mostrarRelato("Bruno", "Bruno juega descalzo, tiene una cicatriz en la ceja y nunca perdió en su cancha. Te mira de arriba abajo.\n\n—¿Vos sos el de Villa Esperanza? Dicen que jugás. Tres contra tres, acá en el pasto. Si me ganás, te llevás la recaudación de la semana." + compania, [
    {
      texto: "Aceptar el desafío", detalle: "Cuesta 25 de energía",
      deshabilitada: E.energia < 25,
      accion: () => {
        if (!E.misiones.bruno) aceptar("bruno");
        E.flags.brunoDia = E.dia;
        empezarPartido(PARTIDOS.bruno);
      },
    },
    VOLVER,
  ]);
}

PARTIDOS.bruno = {
  titulo: "El rey del Puente",
  nuestro: "Vos",
  rival: "Bruno",
  bonus: () => (flag("flacoAyuda") ? 10 : 0),
  intro: "La canchita del Puente es un rectángulo de pasto pelado al lado del arroyo. Los arcos son dos neumáticos. Medio barrio vino a mirar. Alguien pone cumbia en un parlante.\n\nBruno se escupe las manos. —Tres jugadas. El que hace más goles gana.",
  momentos: [
    {
      minuto: 1,
      texto: "Bruno arranca con la pelota pegada al pie izquierdo. Descalzo, se mueve como si el pasto fuera hielo. Viene hacia vos.",
      opciones: [
        { texto: "Marcarlo bien de cerca", stat: "defensa", dif: 5,
          exito: { texto: "Te le pegás como una estampilla. Bruno intenta girar, no puede, y la pelota se le va al arroyo. —¡Uhhh! —grita el barrio." },
          fallo: { texto: "Bruno te hace un sombrero, la baja con el empeine y la empuja al neumático. Elegante. Insoportable.", gol: "b" } },
        { texto: "Esperarlo y cerrarle el pase", stat: "velocidad", dif: 4,
          exito: { texto: "No te comés el amague. Le cerrás el pase y cortás en el medio." },
          fallo: { texto: "Te quedás quieto y Bruno pasa al lado tuyo como si no existieras.", gol: "b" } },
      ],
    },
    {
      minuto: 2,
      texto: "Te queda la pelota en el pasto pelado, cerca del arroyo. Bruno viene a cerrarte con los brazos abiertos.",
      opciones: [
        { texto: "Tirarle un caño", stat: "regate", dif: 6,
          exito: { texto: "Caño. A Bruno. En su cancha. El parlante se queda en silencio un segundo, y después el barrio entero grita. La empujás al neumático.", gol: "a", fama: 2 },
          fallo: { texto: "Bruno cierra las piernas, te roba y se ríe: —Acá no, pibe. Acá no." } },
        { texto: "Rematar de una", stat: "tiro", dif: 5,
          exito: { texto: "Le pegás de primera, rasante, y la pelota entra justo por el agujero del neumático. Golazo.", gol: "a" },
          fallo: { texto: "El remate pega en el neumático y rebota lejos." } },
        { texto: "Pared con el Flaco", stat: "pase", dif: 4, si: () => flag("flacoAyuda") > 0,
          exito: { texto: "Se la tocás al Flaco, el Flaco te la devuelve de primera, como en el potrero de siempre. Quedás solo. Gol. —¡ESA ES LA DE LA ESQUINA! —grita el Flaco.", gol: "a", flag: { flaco: 1 } },
          fallo: { texto: "La pared no sale: Bruno la lee y corta." } },
      ],
    },
    {
      minuto: 3,
      texto: "Última jugada. Bruno tiene la pelota, pero se la pasa a un compañero y pica al área. Si llega, es gol.",
      opciones: [
        { texto: "Seguir a Bruno a muerte", stat: "fisico", dif: 5,
          exito: { texto: "Corrés al lado de él, hombro con hombro. Saltan juntos. La pelota te pega a vos en la cabeza y sale. Bruno se queda tirado en el pasto, mirando el cielo." },
          fallo: { texto: "Bruno te gana por un paso y cabecea al neumático.", gol: "b" } },
        { texto: "Cortar el pase antes de que llegue", stat: "defensa", dif: 6,
          exito: { texto: "Leés el pase, te tirás y la cortás. En el rebote, contragolpe... ¡y gol tuyo al neumático vacío!", gol: "a", nota: 1.5 },
          fallo: { texto: "No llegás a cortar. Bruno define.", gol: "b" } },
      ],
    },
  ],
  alTerminar: (partido, resultado) => {
    if (resultado === "gana") {
      const premio = completar("bruno", 1500, 2);
      mostrarRelato("El rey del Puente", "Bruno se levanta, se sacude el pasto y te da la mano.\n\n—Nunca nadie me ganó acá. Sos el nuevo rey del Puente, pibe. Tomá, es tuya.\n\nEl barrio entero te aplaude." + premio, [VOLVER]);
    } else {
      mostrarRelato("El rey del Puente", "Bruno levanta los brazos. El barrio grita su nombre.\n\n—Volvé cuando quieras. Acá siempre hay revancha.\n\n(Podés volver a desafiarlo otro día. Entrená, comprá equipo o buscá ayuda.)", [VOLVER]);
    }
  },
};


// ---------------------------------------------------------------------
// DON TITO — almacén del Centro. Misión de reparto.
// ---------------------------------------------------------------------
function hablarTito() {
  const estado = E.misiones.changa;
  if (!estado) {
    mostrarRelato("Almacén de Don Tito", "Don Tito corta fiambre detrás del mostrador.\n\n—¿Vos sos de Villa Esperanza? Tengo un pedido para Doña Rosa y el chico del reparto no vino. ¿Me hacés la gauchada? Ella te paga.", [
      { texto: "Llevar el pedido", accion: () => { aceptar("changa"); volverAlMundo("Misión nueva: llevale el pedido a Doña Rosa 👵 en Villa Esperanza."); } },
      VOLVER,
    ]);
  } else if (estado === "activa") {
    mostrarRelato("Almacén de Don Tito", "—¿Todavía acá? ¡Que Rosa espera el dulce de leche!", [VOLVER]);
  } else {
    mostrarRelato("Almacén de Don Tito", "—Gracias por lo del otro día, pibe. Si algún día llegás a primera, acá tenés fiado.", [VOLVER]);
  }
}


// ---------------------------------------------------------------------
// LUCÍA — fotógrafa. Misión que necesita ESTILO (ropa).
// ---------------------------------------------------------------------
function hablarLucia() {
  if (E.misiones.foto === "hecha") {
    mostrarRelato("Lucía", "—¡Salió la campaña! Estás en un cartel en la avenida, ¿lo viste? Quedaste re bien.", [VOLVER]);
    return;
  }
  if (!E.misiones.foto) aceptar("foto");
  if (estilo() >= 2) {
    const premio = completar("foto", 2000, 3);
    mostrarRelato("Lucía", "Lucía te mira por la cámara. —¡Eso! Esa pinta es justo lo que buscaba. Pelota bajo el brazo, mirada al horizonte... ¡Perfecto!\n\nClic, clic, clic." + premio, [VOLVER]);
  } else {
    mostrarRelato("Lucía", `—Estoy haciendo una campaña de ropa deportiva y busco un pibe de barrio con pinta de crack. Vos jugás bien, pero...  te falta onda. Volvé con algo más canchero.\n\n(Necesitás **2 de Estilo**. Tenés ${estilo()}. Comprá ropa en La Percha 👕, en Villa Esperanza.)`, [VOLVER]);
  }
}
