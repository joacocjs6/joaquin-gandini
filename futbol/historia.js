// =====================================================================
//  historia.js — Los capítulos: escenas y partidos
// =====================================================================
//  Para escribir historia NO hace falta saber mucho código: copiá una
//  escena, cambiale el id, el texto y las opciones. {N} se reemplaza
//  por el nombre del jugador.
//
//  En los partidos, cada opción tiene:
//    stat:  qué habilidad usa ("regate", "tiro", "pase"...)
//    dif:   qué tan difícil es (3 fácil ... 8 muy difícil)
//    exito: qué pasa si te sale    fallo: qué pasa si no
//      gol: "a" (nuestro) o "b" (de ellos)
//      nota: cuánto sube o baja tu calificación
//      fama: cuánta fama ganás
//      flag: decisiones que quedan guardadas para el futuro
//      bonus: % que se suma (o resta) al resto del partido
// =====================================================================

const ESCENAS = {};
const PARTIDOS = {};


// =====================================================================
//  CAPÍTULO 1 — EL POTRERO
// =====================================================================

ESCENAS.c1_intro = {
  titulo: "Capítulo 1 · El potrero",
  texto: "Villa Esperanza, seis de la tarde. El sol se esconde atrás de los monoblocks y la calle Las Heras ya no es una calle: es una cancha. Dos ladrillos de cada lado, una pelota Pulpo medio desinflada y la promesa de siempre: **el que pierde paga la Coca.**\n\n—¡Dale, {N}, que se va la luz! —grita el Flaco desde la esquina.",
  opciones: [
    { texto: "Atarte las zapatillas y salir", ir: "c1_equipos" },
  ],
};

ESCENAS.c1_equipos = {
  titulo: "Capítulo 1 · El potrero",
  texto: "Se arman los equipos. De un lado: vos, el Flaco, Nacho, y el Gordo Ramírez al arco. Del otro, los del Pasaje, con el Colo de capitán: dos años más grande, un metro ochenta y cero amigos.\n\n—A tres goles —dice el Colo, haciendo jueguitos—. Y si se pincha la pelota, la paga el que la pinchó.",
  opciones: [
    { texto: "¡A jugar!", accion: () => empezarPartido(PARTIDOS.calle) },
  ],
};

PARTIDOS.calle = {
  titulo: "Capítulo 1 · La calle",
  nuestro: "La Esquina",
  rival: "El Pasaje",
  intro: "Los vecinos sacan las reposeras a la vereda. Don Cacho apoya los codos en el mostrador del kiosco. Dos perros se acomodan a mirar. El Colo pisa la pelota en el medio de la calle y te sonríe con media boca.\n\nEsto no es un partido cualquiera. En la calle, lo que pasa hoy se cuenta mañana.",
  momentos: [
    {
      minuto: 1,
      texto: "El Colo saca del medio con un taco sobrador. Los del Pasaje se la pasan entre ellos, tranquilos, como si la calle fuera de ellos. El Colo levanta la cabeza y te mira. Viene derecho hacia vos.",
      opciones: [
        {
          texto: "Salir a apretarlo con todo", stat: "fisico", dif: 3,
          exito: { texto: "Le ponés el cuerpo, chocan hombro con hombro y el Colo, que no esperaba que un pibe más chico le fuera así, pierde la pelota. Desde la vereda, una vecina grita: —¡Eso, nene!", flag: { garra: 1 } },
          fallo: { texto: "El Colo te ve venir, amaga y te deja sentado en el cordón. Patea... ¡y el Gordo Ramírez la saca con la panza! Uff. Se salvaron." },
        },
        {
          texto: "Cerrarle el camino y esperar", stat: "defensa", dif: 3,
          exito: { texto: "Te parás como te enseñó el Gordo: de costado, mirando la pelota y no las piernas. El Colo intenta pasar, le tapás el camino y la pelota queda para Nacho." },
          fallo: { texto: "Te quedás esperando, el Colo acelera y antes de que te des cuenta ya la metió entre los ladrillos.", gol: "b" },
        },
      ],
    },
    {
      minuto: 6,
      texto: "Nacho recupera y te la tira. La recibís pegado al cordón, entre un Fiat 147 estacionado y el Colo, que vuelve desesperado. Adelante, solo uno de ellos. A tu izquierda, el Flaco levanta la mano: está solo, solísimo.",
      opciones: [
        {
          texto: "Encarar al Colo", stat: "regate", dif: 4,
          exito: { texto: "Amagás para un lado, salís para el otro y se la pasás por entre las piernas. ¡CAÑO! Los pibes del kiosco gritan como si fuera la Bombonera. Quedás de frente a los ladrillos y la empujás despacito, disfrutándolo.", gol: "a", fama: 1, nota: 1 },
          fallo: { texto: "Querés tirarle el caño pero el Colo cierra las piernas a tiempo. Te la roba y encima se ríe: —¿Qué querías hacer, nene?" },
        },
        {
          texto: "Tocársela al Flaco", stat: "pase", dif: 3,
          exito: { texto: "La ves antes que nadie. Un pase suave, al pie, que pasa por debajo del Fiat... ¡y le llega justo! El Flaco ni la para: zurdazo cruzado.", gol: "a", flag: { flaco: 1 } },
          fallo: { texto: "El pase sale fuerte y la pelota se mete debajo del Fiat. Tres minutos para sacarla con una escoba. El Flaco te mira serio." },
        },
        {
          texto: "Patear de lejos", stat: "tiro", dif: 5,
          exito: { texto: "Le pegás de empeine, con todo, desde la mitad de la cuadra. La pelota sale como un misil, pega en el ladrillo... ¡y entra! De esos goles que se cuentan en el barrio durante una semana.", gol: "a", fama: 1, nota: 1 },
          fallo: { texto: "Le pegás con toda el alma... y la pelota sale para cualquier lado. ¡PAM! Se estrella contra la persiana del kiosco. Don Cacho sale con un trapo en la mano: —¡LA PRÓXIMA SE LA PINCHO, EH!", flag: { persiana: 1 } },
        },
      ],
    },
    {
      minuto: 11,
      texto: "—¡AUTOOO! —grita alguien. Todos se corren a la vereda mientras pasa un Falcon viejo, despacito, tocando bocina. Pero el Colo, vivo, ni espera a que termine de pasar: saca rápido y sale corriendo con la pelota.",
      opciones: [
        {
          texto: "¡Correrlo!", stat: "velocidad", dif: 4,
          exito: { texto: "Salís disparado esquivando el paragolpes del Falcon. Lo alcanzás justo antes de los ladrillos y le sacás la pelota con la punta. —¡Tramposo! —le gritan todos." },
          fallo: { texto: "Arrancás tarde. El Colo la empuja tranquilo. —Vale, vale, el auto ya había pasado —dice, con una sonrisa de costado.", gol: "b" },
        },
        {
          texto: "Reclamar: «¡Eso no vale!»",
          exito: { texto: "—¡Eh, Colo, no vale! ¡El auto estaba pasando! Los pibes de los dos equipos te dan la razón. El Colo protesta, pero tiene que volver a sacar. Así se juega en la calle: la ley la hace la mayoría.", nota: 0, flag: { justo: 1 } },
        },
      ],
    },
    {
      minuto: 15,
      texto: "Agarrás la pelota en el medio y arrancás... y el Colo, desde atrás, te baja con un patadón en el tobillo. Caés de cara al asfalto. Te arde la rodilla. Silencio en la calle. Todos te miran: ¿qué vas a hacer?",
      opciones: [
        {
          texto: "Levantarte sin decir nada y seguir", stat: "fisico", dif: 4,
          exito: { texto: "Te levantás. La rodilla sangra un poco. No decís nada. En la jugada siguiente, rengueando, metés un pase largo que Nacho empuja al gol. Nadie dice nada, pero todos te miran distinto.", gol: "a", nota: 1, flag: { garra: 1 } },
          fallo: { texto: "Querés seguir pero el tobillo no responde. Te quedás sentado en el cordón mientras los del Pasaje aprovechan el hueco.", gol: "b" },
        },
        {
          texto: "Ir al humo con el Colo",
          exito: { texto: "Te levantás y lo empujás. Él te empuja. Se arma el revoleo: gritos, manos, el Flaco que se mete en el medio. —¡Basta! ¡Si siguen, se termina! Se calman. Pero tenés la cabeza más caliente que el asfalto y vas a jugar peor.", nota: -0.5, bonus: -5, flag: { peleador: 1 } },
        },
        {
          texto: "Pedir la falta y patearla vos", stat: "tiro", dif: 5,
          exito: { texto: "Acomodás la pelota. Dos pasos. Le pegás de cara interna, con efecto. La pelota se curva por encima de la mano estirada del arquero y entra pegada al ladrillo. —¡Eso es venganza, papá!", gol: "a", nota: 1 },
          fallo: { texto: "Le pegás bien, pero el arquero de ellos vuela y la saca con la punta de los dedos." },
        },
      ],
    },
    {
      minuto: 20,
      texto: "Contragolpe de ellos. El Colo se escapa solo por el medio de la calle y va derecho a encarar al Gordo Ramírez. Vos venís corriendo desde atrás, con el corazón en la garganta.",
      opciones: [
        {
          texto: "Tirarte al piso a cruzarlo", stat: "defensa", dif: 5,
          exito: { texto: "Barrida perfecta. Te raspás toda la pierna contra el asfalto, pero la pelota sale limpia y el Colo pasa de largo. El Gordo te levanta de un brazo: —¡Sos un animal!", nota: 1, flag: { garra: 1 } },
          fallo: { texto: "Te tirás a la desesperada pero llegás tarde. El Colo la toca por encima del Gordo.", gol: "b" },
        },
        {
          texto: "Gritarle al Gordo: «¡SALÍ!»", prob: 50,
          exito: { texto: "—¡SALÍ, GORDO! El Gordo te hace caso, sale con los brazos abiertos y achica el arco. El Colo patea apurado... ¡y le pega al Gordo en la panza! Pelota afuera." },
          fallo: { texto: "El Gordo duda, sale a medias, y el Colo lo gambetea con toda la calma del mundo.", gol: "b" },
        },
      ],
    },
    {
      minuto: 25,
      texto: "—¡{N}! ¡A COMEEER! Es tu vieja, desde la ventana. Ya se prendieron los faroles.\n\n—¡Última! ¡El que hace el gol gana! —grita alguien. La pelota te cae a vos en tres cuartos de cancha. Se te nubla todo. Esta es la que vale.",
      opciones: [
        {
          texto: "Gambetear hasta el arco", stat: "regate", dif: 5,
          exito: { texto: "Pasás a uno. Pasás a dos. El Colo te tira otra patada y la saltás. Quedás solo frente al arquero y la tocás a un costado, suave, como si nada. Los pibes se te tiran encima.", gol: "a", fama: 1, nota: 1 },
          fallo: { texto: "Pasás a uno, pasás a dos... y el Colo te la roba con un manotazo. —¡Mano! —gritás. —¡Siga, siga! —gritan ellos." },
        },
        {
          texto: "Clavarla al ángulo", stat: "tiro", dif: 6,
          exito: { texto: "Le pegás desde lejos con todo lo que tenés. La pelota sube, sube... y baja justo donde estaría el ángulo si el arco tuviera travesaño. Cinco minutos de discusión: ¿fue alta? Pero la calle decide: ¡GOL!", gol: "a", fama: 2, nota: 1 },
          fallo: { texto: "Le pegás con todo pero la pelota se va por arriba. Rebota en el techo de un Renault 12 y la alarma empieza a sonar. Corren todos." },
        },
        {
          texto: "Esperar al Flaco y tocar", stat: "pase", dif: 4,
          exito: { texto: "Levantás la cabeza. El Flaco pica al vacío. Se la ponés justo ahí, donde solo él puede llegar. El Flaco define cruzado y se tira de rodillas en el asfalto, como en la tele.", gol: "a", nota: 1, flag: { flaco: 1 } },
          fallo: { texto: "Le das el pase al Flaco, pero un pibe del Pasaje la corta y la revienta hacia el fondo de la cuadra." },
        },
      ],
    },
  ],
  alTerminar: () => irA("c1_final"),
};

ESCENAS.c1_final = {
  titulo: "Capítulo 1 · El potrero",
  texto: () => {
    const r = E.ultimoPartido.resultado;
    let t = {
      gana: "Los del Pasaje se van puteando bajito. El Colo saca la plata del bolsillo y paga la Coca de dos litros sin mirarte a los ojos. La toman sentados en el cordón, pasándose la botella.",
      empata: "Empate. Nadie paga la Coca, o mejor dicho: la pagan entre todos, juntando monedas. Hasta el Colo pone. Sentados en el cordón, por un rato no hay barrios ni pasajes.",
      pierde: "Perdieron. Ponés tus últimas monedas para la Coca. El Colo toma primero, bien largo, mirándote. —La próxima traé más plata, nene.",
    }[r];
    if (flag("flaco") > 0) t += "\n\nEl Flaco te pasa la botella primero. —Vos sí que la ves, eh.";
    if (flag("peleador") > 0) t += "\n\nEl Colo te mira de lejos. Esto no terminó.";
    t += "\n\nEntonces notás algo raro: en el kiosco de Don Cacho, un tipo de gorra gris, con un termo bajo el brazo, anota algo en una libretita. Te mira. Le pregunta algo a Don Cacho, te señala, y se va caminando sin apuro.";
    return t;
  },
  opciones: [
    { texto: "Ir a preguntarle a Don Cacho", ir: "c1_cacho" },
    { texto: "Ni bola: a tomar la Coca", ir: "c1_fin" },
  ],
};

ESCENAS.c1_cacho = {
  titulo: "Capítulo 1 · El potrero",
  alEntrar: () => sumarFlag("curioso"),
  texto: () => (flag("persiana")
    ? "—¡Vos! ¡El de la persiana! —Don Cacho te apunta con el trapo. Después suspira—. Bueno, igual te digo. "
    : "—¿Quién era ese, Don Cacho?\n\n—") +
    "Me preguntó tu nombre y a qué escuela vas. Dijo que se llama **Ramón**. Tenía cara de saber de fútbol, eh. De esos que ya no quedan.",
  opciones: [{ texto: "Volver con los pibes", ir: "c1_fin" }],
};

ESCENAS.c1_fin = {
  titulo: "Fin del Capítulo 1",
  texto: "Se hace de noche en Villa Esperanza. Mañana hay escuela.\n\n**Ahora el barrio es tuyo.** Podés recorrerlo, comprar ropa, entrenar en el potrero ⚽ o tomarte el colectivo 🚏 a otros barrios.\n\n**Para seguir la historia:** dormí en tu casa 🏠 y al otro día andá a la escuela 🏫.",
  opciones: [
    {
      texto: "Recorrer el barrio",
      accion: () => {
        E.capitulo = 2;
        E.diaFinCapitulo = E.dia;
        volverAlMundo("Usá las flechas para moverte. Caminá contra un lugar o una persona para entrar o hablar.");
      },
    },
  ],
};


// =====================================================================
//  CAPÍTULO 2 — EL RECREO
// =====================================================================

ESCENAS.c2_intro = {
  titulo: "Capítulo 2 · El recreo",
  texto: () => "Escuela Secundaria N° 14, tercera hora. La profe Graciela explica ecuaciones y vos dibujás una cancha en el margen de la carpeta.\n\nPor la ventana del aula se ve el patio... y en la reja, hablando con el director, un tipo de gorra gris con un termo bajo el brazo." +
    (flag("curioso") ? "\n\nEs él. **Ramón.**" : "\n\nTe suena de algún lado."),
  opciones: [
    { texto: "Prestar atención a la clase", ir: "c2_clase" },
    { texto: "Seguir mirando por la ventana", ir: "c2_ventana" },
  ],
};

ESCENAS.c2_clase = {
  titulo: "Capítulo 2 · El recreo",
  alEntrar: () => sumarFlag("estudioso"),
  texto: "—{N}, ¿cuánto da x?\n\nPor milagro, lo sabés. —Muy bien. ¿Ves que cuando querés, podés? —dice la profe, y te guiña un ojo.\n\nRRRRING. Suena el timbre.",
  opciones: [{ texto: "Salir al patio", ir: "c2_recreo" }],
};

ESCENAS.c2_ventana = {
  titulo: "Capítulo 2 · El recreo",
  texto: "—{N}, ¿el patio te va a resolver la ecuación?\n\nLas risas del curso. Te ponés rojo como un tomate.\n\nRRRRING. Salvado por la campana.",
  opciones: [{ texto: "Salir al patio", ir: "c2_recreo" }],
};

ESCENAS.c2_recreo = {
  titulo: "Capítulo 2 · El recreo",
  texto: "Treinta pibes salen disparados. En el patio, la final de siempre: **3° A contra 3° B.** Dos mochilas de cada lado, una pelota de goma que pica como loca y veinte minutos de recreo.\n\nEn 3° B está Santi, el más alto de la escuela. En tu equipo, Mili, que le pega mejor que todos los varones juntos.\n\nRamón se acomodó contra la reja. Te está mirando.",
  opciones: [{ texto: "Arrancar el partido", accion: () => empezarPartido(PARTIDOS.recreo) }],
};

PARTIDOS.recreo = {
  titulo: "Capítulo 2 · El recreo",
  nuestro: "3° A",
  rival: "3° B",
  intro: "Los de primer año se suben a los bancos para mirar. El preceptor Ruiz cruza los brazos en la puerta. Santi se tira el pelo para atrás.\n\nY detrás de la reja, una libretita abierta.",
  momentos: [
    {
      minuto: 1,
      texto: "Arranca el partido. De reojo ves que Ramón saca la libretita. Te tiemblan las piernas. Mili te toca la espalda: —¿Qué te pasa? Jugá.",
      opciones: [
        {
          texto: "Olvidarte de él y jugar tu juego",
          exito: { texto: "Respirás hondo. Es el patio de siempre, la pelota de siempre. Ramón desaparece de tu cabeza. Te sentís liviano. (+8% en todas las jugadas de este partido)", nota: 0, bonus: 8, flag: { concentrado: 1 } },
        },
        {
          texto: "Mostrarte: jueguitos y lujos", stat: "regate", dif: 5,
          exito: { texto: "Recibís y la levantás: uno, dos, tres jueguitos, la pisás, taco, sombrerito a un pibe de 3° B. El patio estalla. En la reja, Ramón anota algo.", fama: 1, flag: { lucido: 1 } },
          fallo: { texto: "Querés hacer un sombrerito, pero la pelota de goma pica para cualquier lado. Te la roban y Santi la manda a guardar entre las mochilas.", gol: "b", flag: { ego: 1 } },
        },
      ],
    },
    {
      minuto: 5,
      texto: "Córner para 3° B. Bah, \"córner\": tiran la pelota desde al lado del bebedero. Santi se viene al área. Te toca marcarlo a vos. Te lleva una cabeza entera.",
      opciones: [
        {
          texto: "Saltar con él", stat: "fisico", dif: 6,
          exito: { texto: "Saltás como nunca saltaste. No le ganás en altura, pero le ganás en ganas: lo molestás lo justo, la pelota le rebota en el hombro y sale.", nota: 1 },
          fallo: { texto: "Saltás, pero Santi está en otro piso. Cabezazo limpio, contra el piso, adentro.", gol: "b" },
        },
        {
          texto: "Anticiparte y cortar antes", stat: "velocidad", dif: 4,
          exito: { texto: "Mientras Santi se acomoda para el cabezazo, te adelantás y la cortás con la rodilla. Santi se queda saltando solo, como un tonto.", nota: 1 },
          fallo: { texto: "Arrancás antes de tiempo, la pelota te pasa por arriba y Santi la empuja en el segundo palo.", gol: "b" },
        },
      ],
    },
    {
      minuto: 9,
      texto: "La pelota te queda en el borde del área, de frente al arco... y justo detrás del arco están los ventanales de la sala de profesores. El preceptor Ruiz grita desde la puerta: —¡CUIDADO CON LOS VIDRIOS, EH!",
      opciones: [
        {
          texto: "Pegarle igual, con todo", stat: "tiro", dif: 5,
          exito: { texto: "Bomba. La pelota entra justo entre las dos mochilas, a diez centímetros del vidrio. Ruiz se agarra la cabeza... y después aplaude.", gol: "a", nota: 1 },
          fallo: { texto: "Bomba. Demasiado alta. CRASH. El silencio en el patio es total. Un vidrio de la sala de profesores, hecho pedazos. Ruiz anota tu nombre en su planilla.", nota: -1, flag: { vidrio: 1 } },
        },
        {
          texto: "Bajarla y jugar por abajo", stat: "pase", dif: 4,
          exito: { texto: "La parás, mirás, y se la tocás rasante a Mili, que entra por el costado. Mili la empuja de zurda. El ventanal, intacto.", gol: "a", flag: { mili: 1 } },
          fallo: { texto: "La bajás pero tardás demasiado. Te la quitan y sale el contragolpe de 3° B." },
        },
      ],
    },
    {
      minuto: 14,
      texto: "Recuperás en el medio y arrancás. Mili pica por la derecha, sola, levantando el brazo: —¡{N}! ¡ACÁ!",
      opciones: [
        {
          texto: "Darle el pase a Mili", stat: "pase", dif: 4,
          exito: { texto: "Pase en profundidad. Mili la recibe, levanta la cabeza y se la pica por encima al arquero. Te señala con el dedo mientras festeja.", gol: "a", nota: 1, flag: { mili: 1 } },
          fallo: { texto: "El pase sale largo y se va contra la pared del gimnasio. Mili resopla." },
        },
        {
          texto: "Jugarla solo", stat: "regate", dif: 6,
          exito: { texto: "Ignorás a Mili y encarás a tres. Uno, dos, tres. Gol. El patio grita tu nombre. Mili, en cambio, no te habla más en todo el recreo.", gol: "a", fama: 1, flag: { ego: 1 } },
          fallo: { texto: "Encarás a tres. Al tercero no lo pasás. Mili te mira con los brazos abiertos: —¿En serio?", flag: { ego: 1 } },
        },
      ],
    },
    {
      minuto: 19,
      texto: "Queda un minuto de recreo. Ruiz ya tiene la mano sobre el timbre. Un centro pasado cae en el área, la pelota pica una vez, alta, y te queda a la altura de la cabeza... de espaldas al arco.",
      opciones: [
        {
          texto: "¡Chilena!", stat: "tiro", dif: 7,
          exito: { texto: "Te tirás para atrás. El mundo se da vuelta. Le pegás con el empeine en el aire y la pelota entra pegada a la mochila. Caés de espalda sobre el cemento y no te importa nada. Treinta pibes corren hacia vos. En la reja, Ramón se quedó con la boca abierta.", gol: "a", fama: 2, nota: 1.5 },
          fallo: { texto: "Te tirás para atrás... y le pegás al aire. Caés de espalda sobre el cemento. Duele. Y encima suena el timbre." },
        },
        {
          texto: "Bajarla con el pecho y girar", stat: "regate", dif: 5,
          exito: { texto: "La bajás con el pecho, girás sobre tu pie y la cruzás al segundo palo. Gol. Suena el timbre en el mismo segundo.", gol: "a", nota: 1 },
          fallo: { texto: "La bajás, pero Santi te la saca de abajo justo cuando suena el timbre." },
        },
        {
          texto: "Peinarla para un compañero", stat: "pase", dif: 5,
          exito: { texto: "La peinás de cabeza hacia atrás, al punto del penal, donde entra Nacho... ¡zapatazo! Gol sobre la hora.", gol: "a", nota: 1, flag: { equipo: 1 } },
          fallo: { texto: "La peinás para atrás pero no hay nadie. Suena el timbre." },
        },
      ],
    },
  ],
  alTerminar: () => irA("c2_post"),
};

ESCENAS.c2_post = {
  titulo: "Capítulo 2 · El recreo",
  texto: () => {
    let t = {
      gana: "3° A gana la final del recreo. Te levantan en andas hasta la puerta del aula.",
      empata: "Empate. Santi dice que la próxima los liquidan. Vos decís lo mismo.",
      pierde: "Perdieron. Los de 3° B se burlan todo el camino hasta el aula.",
    }[E.ultimoPartido.resultado];
    if (flag("vidrio")) t += "\n\nPero antes de entrar, el preceptor Ruiz te agarra del hombro: —Vos, a dirección. Ahora.\n\nEn la dirección está el director... y al lado, sentado tranquilo con su mate, Ramón.";
    else t += "\n\nCuando vas a entrar al aula, alguien te chista desde la reja. Es él. Ramón.";
    return t;
  },
  opciones: [{ texto: "Acercarte", ir: "c2_ramon" }],
};

ESCENAS.c2_ramon = {
  titulo: "Capítulo 2 · El recreo",
  texto: () => {
    let t = "—Vos sos {N}, ¿no? Ramón Ferreyra. Hace treinta años que busco jugadores para **Unión del Sur**. Te vi ayer en la calle y hoy quise ver si era casualidad.";
    if (flag("vidrio")) t += "\n\nMira al director. —Lo del vidrio lo arreglamos. Yo también rompí unos cuantos.";
    // Lo que Ramón notó depende de TUS decisiones:
    if (flag("flaco") + flag("mili") + flag("equipo") >= 2) t += "\n\n—Levantás la cabeza. Ves al compañero. Eso no se enseña, pibe.";
    else if (flag("ego") > 0) t += "\n\n—Te gusta lucirte, eh. Cuidado con eso: en el fútbol de verdad, el que juega solo, termina solo.";
    if (flag("garra") >= 2) t += "\n\n—Y tenés sangre. Te pegan y te levantás. Eso me gusta.";
    if (flag("peleador") > 0) t += "\n\n—Lo que no me gustó es lo del otro día con el grandote. La cabeza caliente te va a costar caro.";
    return t;
  },
  opciones: [
    { texto: "—¿Me está cargando?", accion: () => sumarFlag("desconfiado"), ir: "c2_tarjeta" },
    { texto: "—¿Qué tengo que hacer?", ir: "c2_tarjeta" },
  ],
};

ESCENAS.c2_tarjeta = {
  titulo: "Capítulo 2 · El recreo",
  texto: () => (flag("desconfiado") ? "Ramón se ríe. —No, pibe. A mí el fútbol no me da risa.\n\n" : "") +
    "Te da una tarjeta arrugada:\n\n**CLUB ATLÉTICO UNIÓN DEL SUR**\n**Prueba de inferiores — Sábado 9 hs**\n\n—Está en el Centro. Tomate el colectivo. Llevá botines si tenés; si no, venite igual.",
  opciones: [
    { texto: "Contarle a tu vieja", ir: "c2_mama" },
    { texto: "Guardar el secreto", ir: "c2_secreto" },
  ],
};

ESCENAS.c2_mama = {
  titulo: "Capítulo 2 · El recreo",
  alEntrar: () => { sumarFlag("familia"); E.plata += 2000; },
  texto: "Esa noche, en la cocina, le mostrás la tarjeta. Tu vieja la lee dos veces. No dice nada. Se levanta, abre la lata de galletitas donde guarda la plata del mes y te da unos billetes doblados.\n\n—Para los botines. Y vas a ir con la frente en alto, ¿me escuchaste?\n\n**+$2.000**",
  opciones: [{ texto: "Abrazarla", ir: "c2_fin" }],
};

ESCENAS.c2_secreto = {
  titulo: "Capítulo 2 · El recreo",
  alEntrar: () => sumarFlag("secreto"),
  texto: "Guardás la tarjeta en la billetera, al lado de la figurita del Diego. Nadie tiene que saber nada hasta que sea verdad.",
  opciones: [{ texto: "Seguir", ir: "c2_fin" }],
};

ESCENAS.c2_fin = {
  titulo: "Fin del Capítulo 2",
  texto: "**Próximo objetivo:** la prueba en el Club Unión del Sur 🏟️, en el Centro. Tomate el colectivo en la parada 🚏.\n\nAntes de ir, quizás te convenga entrenar en el potrero ⚽, ganar unos pesos con alguna changa o comprarte botines en Deportes Gol 👟.",
  opciones: [
    {
      texto: "Volver al barrio",
      accion: () => {
        E.capitulo = 3;
        E.diaFinCapitulo = E.dia;
        volverAlMundo("Objetivo: la prueba en Unión del Sur (Centro).");
      },
    },
  ],
};


// =====================================================================
//  CAPÍTULO 3 — LA PRUEBA
// =====================================================================

ESCENAS.c3_intro = {
  titulo: "Capítulo 3 · La prueba",
  texto: () => {
    let t = "Club Atlético Unión del Sur. La cancha tiene pasto de verdad, con líneas blancas recién pintadas. Hay cuarenta pibes haciendo precalentamiento. Casi todos con botines que brillan.";
    if (!E.equipo.pies) t += "\n\nVos tenés las zapatillas de siempre, con un agujero en la punta. Alguien atrás tuyo se ríe.";
    else t += `\n\nMirás tus ${ITEMS[E.equipo.pies].nombre.toLowerCase()}. Hoy se estrenan.`;
    if (flag("familia")) t += "\n\nEn la tribuna, chiquita entre los otros padres, está tu vieja. Te hace un gesto con el puño.";
    if (E.fama >= 4) t += "\n\nUno de los pibes te señala: —Ese es el de Villa Esperanza. Dicen que la rompe.";
    t += "\n\nUn hombre con silbato y planilla se te para enfrente: el **Profe Medina**.\n\n—A ver, ¿y vos de qué jugás?";
    return t;
  },
  opciones: () => Object.keys(POSICIONES).map((id) => ({
    texto: `${POSICIONES[id].emoji} ${POSICIONES[id].nombre}`,
    detalle: POSICIONES[id].desc,
    accion: () => elegirPosicion(id),
    ir: "c3_puntos",
  })),
};

function elegirPosicion(id) {
  E.posicion = id;
  const bonus = POSICIONES[id].bonus;
  for (const s in bonus) E.stats[s] += bonus[s];
  E.puntos += 4; // puntos extra para repartir antes de la prueba
}

ESCENAS.c3_puntos = {
  titulo: "Capítulo 3 · La prueba",
  texto: () => {
    const pos = POSICIONES[E.posicion];
    let t = `—${pos.nombre}, eh. A ver qué tenés.\n\nTu posición te dio: ` +
      Object.keys(pos.bonus).map((s) => `+${pos.bonus[s]} ${STATS[s].nombre}`).join(", ") + ".";
    t += `\n\n**Precalentamiento.** Tenés **${E.puntos}** puntos para repartir. Cada uno sube 1 una stat. Pensá qué vas a necesitar en tu posición.\n\n`;
    t += Object.keys(STATS).map((s) => `${STATS[s].emoji} ${STATS[s].nombre}: **${stat(s)}**`).join("\n");
    return t;
  },
  opciones: () => {
    const lista = [];
    if (E.puntos > 0) {
      for (const s in STATS) {
        lista.push({
          texto: `+1 ${STATS[s].emoji} ${STATS[s].nombre}`,
          detalle: `Ahora: ${E.stats[s]}`,
          si: () => E.stats[s] < STAT_MAX,
          accion: () => { E.stats[s]++; E.puntos--; },
          ir: "c3_puntos",
        });
      }
    }
    lista.push({
      texto: E.puntos > 0 ? "Guardar los puntos y salir a la cancha" : "Salir a la cancha",
      accion: () => empezarPartido(PARTIDOS.prueba),
    });
    return lista;
  },
};

ESCENAS.c3_revancha = {
  titulo: "Capítulo 3 · La prueba",
  texto: "Volviste. Medina levanta las cejas cuando te ve. —Mirá vos. El que no se rinde. A ver si esta vez me convencés.",
  opciones: [{ texto: "Salir a la cancha", accion: () => empezarPartido(PARTIDOS.prueba) }],
};

// Jugadas de la prueba según tu POSICIÓN.
const JUGADAS_POSICION = {
  delantero: [
    {
      minuto: 8, texto: "Te tiran un pelotazo largo. El central de pecheras verdes, un grandote que ya juega en la Quinta, te respira en la nuca. La pelota viene picando.",
      opciones: [
        { texto: "Aguantarla de espaldas y descargar", stat: "fisico", dif: 5,
          exito: { texto: "Ponés el cuerpo, el grandote te empuja, pero no te movés. Descargás para el medio y tu equipo arma la jugada. Medina anota algo." },
          fallo: { texto: "El grandote te pasa por arriba como un camión. Pelota perdida." } },
        { texto: "Ganarle en velocidad", stat: "velocidad", dif: 5,
          exito: { texto: "Le das un toquecito al costado y salís como una flecha. Lo dejás tres metros atrás. Medina deja de escribir para mirar.", nota: 1 },
          fallo: { texto: "Arrancás, pero el central es rápido para su tamaño. Te cierra contra la línea." } },
      ],
    },
    {
      minuto: 21, texto: "¡Mano a mano! Quedaste solo frente al arquero. Cuarenta pibes mirando. Medina se olvidó de la planilla.",
      opciones: [
        { texto: "Definir abajo, cruzado", stat: "tiro", dif: 6,
          exito: { texto: "Lo mirás al arquero, abre el arco... y se la ponés abajo, contra el palo. Ni se tiró.", gol: "a", nota: 1.5 },
          fallo: { texto: "Le pegás cruzado... y el arquero la saca con el pie. Medina se agarra la cabeza." } },
        { texto: "Gambetear al arquero", stat: "regate", dif: 6,
          exito: { texto: "Amagás el remate, el arquero se tira, lo pasás y la empujás al arco vacío.", gol: "a", nota: 1.5 },
          fallo: { texto: "Amagás, pero el arquero no se come el amague y te la saca de los pies." } },
        { texto: "Picarla", stat: "tiro", dif: 8,
          exito: { texto: "Ves que el arquero sale... y se la picás por arriba, suave, con el alma. Entra despacito. Silencio. Después, aplausos en la tribuna.", gol: "a", nota: 2, fama: 2 },
          fallo: { texto: "La querés picar, pero te queda corta y el arquero la agarra en el aire. Medina: —¡Las cosas simples, pibe!", nota: -1 } },
      ],
    },
    {
      minuto: 33, texto: "Centro desde la izquierda, pasado, al segundo palo. Llegás entrando a toda velocidad.",
      opciones: [
        { texto: "Cabezazo al piso", stat: "fisico", dif: 6,
          exito: { texto: "Te elevás entre dos y le das con la frente, hacia abajo, como enseñan. Pique y adentro.", gol: "a", nota: 1 },
          fallo: { texto: "Saltás, pero la pelota te pega en la nuca y se va afuera." } },
        { texto: "Volea", stat: "tiro", dif: 7,
          exito: { texto: "La agarrás de volea, en el aire, y la red se infla como una vela.", gol: "a", nota: 1.5, fama: 1 },
          fallo: { texto: "La volea sale a la tribuna. Un padre la devuelve de mala gana." } },
      ],
    },
    {
      minuto: 40, texto: "Último ataque. Recibís en la medialuna con un defensor encima y un compañero entrando libre por la derecha.",
      opciones: [
        { texto: "Rematar", stat: "tiro", dif: 6,
          exito: { texto: "Te perfilás y le pegás con todo. Al ángulo.", gol: "a", nota: 1 },
          fallo: { texto: "Remate directo al cuerpo del defensor." } },
        { texto: "Pasarla al compañero libre", stat: "pase", dif: 5,
          exito: { texto: "Lo ves de reojo. Pase justo. Tu compañero define. Medina asiente: un delantero que también ve.", gol: "a", nota: 1, flag: { equipo: 1 } },
          fallo: { texto: "El pase lo corta el defensor." } },
      ],
    },
  ],

  medio: [
    {
      minuto: 6, texto: "La pelota pasa por tus pies por primera vez. Medina grita desde el costado: —¡Cabeza levantada, cinco!",
      opciones: [
        { texto: "Pase filtrado entre líneas", stat: "pase", dif: 6,
          exito: { texto: "Ves un hueco que nadie más ve. La metés entre dos centrales y el nueve queda solo... gol.", gol: "a", nota: 1.5 },
          fallo: { texto: "La idea era buena, pero el pase sale muy fuerte y se va al lateral." } },
        { texto: "Pase seguro al costado", stat: "pase", dif: 3,
          exito: { texto: "Toque simple al lateral. Sin riesgo. Medina no anota nada.", nota: 0 },
          fallo: { texto: "Hasta el pase fácil te sale mal. Son los nervios." } },
        { texto: "Girar y encarar", stat: "regate", dif: 5,
          exito: { texto: "Recibís de espaldas, girás con la suela y dejás a tu marca mirando al cielo. Medina sonríe.", nota: 1 },
          fallo: { texto: "Al girar te la roban. Contraataque de ellos." } },
      ],
    },
    {
      minuto: 18, texto: "Contraataque rival. El diez de ellos viene lanzado por el medio y sos el único que puede cortarlo.",
      opciones: [
        { texto: "Barrida al pie", stat: "defensa", dif: 5,
          exito: { texto: "Barrida limpia. Pelota tuya. Medina aplaude dos veces.", nota: 1 },
          fallo: { texto: "Llegás tarde. El diez la toca y es gol.", gol: "b" } },
        { texto: "Falta táctica",
          exito: { texto: "Lo agarrás de la camiseta. Amarilla. Pero el contraataque muere ahí. Medina hace una mueca: no le gusta, pero lo entiende.", nota: -0.5 } },
      ],
    },
    {
      minuto: 29, texto: "Rebote en la puerta del área. La pelota viene picando hacia vos, perfecta para pegarle.",
      opciones: [
        { texto: "Remate de media distancia", stat: "tiro", dif: 6,
          exito: { texto: "Le pegás de lleno. La pelota va con efecto, se abre, se cierra... y entra al lado del palo.", gol: "a", nota: 1.5, fama: 1 },
          fallo: { texto: "¡Al poste! El ruido metálico retumba en toda la cancha." } },
        { texto: "Abrir a la banda", stat: "pase", dif: 4,
          exito: { texto: "Abrís para el siete, que tira el centro... y el nueve la mete.", gol: "a", nota: 1 },
          fallo: { texto: "Pase cortado." } },
      ],
    },
    {
      minuto: 39, texto: "Tiro libre a favor, en tres cuartos. Nadie se anima. Te dan la pelota a vos.",
      opciones: [
        { texto: "Patear directo al arco", stat: "tiro", dif: 7,
          exito: { texto: "Por encima de la barrera, abajo del travesaño. El arquero ni se mueve. Golazo.", gol: "a", nota: 2, fama: 2 },
          fallo: { texto: "A la barrera." } },
        { texto: "Centro al área", stat: "pase", dif: 6,
          exito: { texto: "Centro cerrado al punto del penal. Cabezazo y adentro.", gol: "a", nota: 1.5 },
          fallo: { texto: "El centro lo descuelga el arquero." } },
      ],
    },
  ],

  defensor: [
    {
      minuto: 5, texto: "El nueve de pecheras verdes es una moto. Le tiran un pelotazo a tu espalda.",
      opciones: [
        { texto: "Correrlo", stat: "velocidad", dif: 6,
          exito: { texto: "Lo alcanzás y lo cerrás contra la línea hasta que la pelota sale.", nota: 1 },
          fallo: { texto: "Te gana la espalda... y define.", gol: "b" } },
        { texto: "Anticiparte", stat: "defensa", dif: 5,
          exito: { texto: "Leíste el pase antes de que saliera. Corte limpio.", nota: 1 },
          fallo: { texto: "Saltás al anticipo y la pelota te pasa. Mano a mano para él... ¡afuera! Por poco.", nota: -0.5 } },
      ],
    },
    {
      minuto: 16, texto: "Córner en contra. Te toca marcar al más alto de ellos.",
      opciones: [
        { texto: "Ganarle de arriba", stat: "fisico", dif: 6,
          exito: { texto: "Saltás y la despejás de cabeza lejísimos. Medina: —¡Eso!", nota: 1 },
          fallo: { texto: "Te gana el salto. Gol de cabeza.", gol: "b" } },
        { texto: "Ponerle el cuerpo antes del salto", stat: "defensa", dif: 5,
          exito: { texto: "Lo trabás justo antes de que salte. No llega. La pelota sale.", nota: 1 },
          fallo: { texto: "Te esquiva el bloqueo y cabecea solo.", gol: "b" } },
      ],
    },
    {
      minuto: 27, texto: "Recuperás en el fondo. Tenés tiempo. Un volante rival viene a presionarte.",
      opciones: [
        { texto: "Salir jugando con un pase al medio", stat: "pase", dif: 5,
          exito: { texto: "Pase entre líneas: saliste jugando como un profesional. El ataque arranca desde vos... y termina en gol.", gol: "a", nota: 1 },
          fallo: { texto: "El pase lo intercepta el volante. Peligro... pero tu arquero salva.", nota: -1 } },
        { texto: "Gambetearlo", stat: "regate", dif: 6,
          exito: { texto: "Lo dejás pasar de largo con un amague. Los padres aplauden a un defensor que se anima.", nota: 1.5, fama: 1 },
          fallo: { texto: "Te la roba en tu propia área. Gol.", gol: "b", nota: -1 } },
        { texto: "Reventarla",
          exito: { texto: "La mandás a la tribuna. Sin riesgos, sin gloria.", nota: 0 } },
      ],
    },
    {
      minuto: 38, texto: "Último hombre. El nueve se escapa y quedan los dos solos rumbo al arco.",
      opciones: [
        { texto: "Esperar y quitársela limpia", stat: "defensa", dif: 6,
          exito: { texto: "Esperás, esperás... y le sacás la pelota con la punta del pie. Medina tira la gorra al aire.", nota: 1.5 },
          fallo: { texto: "Te tirás, él la toca a un costado y gol.", gol: "b" } },
        { texto: "Bajarlo",
          exito: { texto: "Lo bajás. Amarilla... en un partido de verdad era roja. Medina te mira serio.", nota: -1 } },
      ],
    },
  ],

  arquero: [
    {
      minuto: 4, texto: "Primer remate de afuera: fuerte, a media altura.",
      opciones: [
        { texto: "Volar y sacarla", stat: "defensa", dif: 5,
          exito: { texto: "Volás y la sacás con una mano. Ruido de guantes contra la pelota.", nota: 1 },
          fallo: { texto: "Se te escapa entre las manos.", gol: "b" } },
        { texto: "Descolgarla segura", stat: "fisico", dif: 4,
          exito: { texto: "La agarrás contra el pecho. Seguridad ante todo.", nota: 0.5 },
          fallo: { texto: "Rebote... y gol del que venía entrando.", gol: "b" } },
      ],
    },
    {
      minuto: 15, texto: "Centro al área. Un bosque de cabezas.",
      opciones: [
        { texto: "Salir a cortarlo", stat: "fisico", dif: 6,
          exito: { texto: "Salís gritando ¡MÍA! y la agarrás en el aire entre tres.", nota: 1 },
          fallo: { texto: "Salís y no llegás. Gol de cabeza con el arco vacío.", gol: "b", nota: -1 } },
        { texto: "Quedarte en la línea", stat: "defensa", dif: 5,
          exito: { texto: "Cabezazo... ¡y lo sacás en la línea con un reflejo!", nota: 1 },
          fallo: { texto: "Cabezazo y adentro.", gol: "b" } },
      ],
    },
    {
      minuto: 25, texto: "Atajaste y tenés la pelota en las manos. Ves al siete de tu equipo solo en la mitad de la cancha.",
      opciones: [
        { texto: "Saque rápido con la mano", stat: "pase", dif: 5,
          exito: { texto: "Saque largo y preciso. El siete arranca, contraataque... ¡gol!", gol: "a", nota: 1.5 },
          fallo: { texto: "El saque sale corto y se lo roban." } },
        { texto: "Tomarte tu tiempo y ordenar",
          exito: { texto: "La dormís un poco. Ordenás la defensa a los gritos. Medina aprueba: el arquero manda.", nota: 0.5 } },
      ],
    },
    {
      minuto: 40, texto: "¡Penal para ellos! Último minuto. El nueve acomoda la pelota. Te mira. Vos lo mirás.",
      opciones: [
        { texto: "Tirarte a tu izquierda", stat: "defensa", dif: 6,
          exito: { texto: "Te tirás a la izquierda... ¡y la sacás! ¡ATAJASTE EL PENAL!", nota: 2, fama: 2 },
          fallo: { texto: "Te tirás a la izquierda. Él la pone a la derecha.", gol: "b" } },
        { texto: "Quedarte parado hasta el final", stat: "defensa", dif: 7,
          exito: { texto: "Esperás, esperás... y él la pica al medio. La agarrás sin moverte. Le arruinaste la vida.", nota: 2, fama: 2 },
          fallo: { texto: "Esperás demasiado y la cruza a un palo.", gol: "b" } },
        { texto: "Bailar sobre la línea", stat: "fisico", dif: 5,
          exito: { texto: "Te movés como loco sobre la línea. El nueve se pone nervioso... y la tira afuera.", nota: 1.5 },
          fallo: { texto: "No se pone nervioso. Gol.", gol: "b" } },
      ],
    },
  ],
};

PARTIDOS.prueba = {
  titulo: "Capítulo 3 · La prueba",
  nuestro: "Naranjas",
  rival: "Verdes",
  bonus: () => (flag("familia") ? 5 : 0),
  intro: "Pecheras naranjas contra pecheras verdes. Dos tiempos de veinte minutos. Medina se para en la mitad de la cancha con la planilla.\n\n—Acá no me importa quién gana. Me importa **cómo** juegan. Necesitan nota 7 o más para quedarse.",
  momentos: () => JUGADAS_POSICION[E.posicion],
  alTerminar: (P) => irA(P.nota >= 7 ? "c3_fichado" : "c3_otra"),
};

ESCENAS.c3_fichado = {
  titulo: "Capítulo 3 · La prueba",
  alEntrar: () => { E.capitulo = 4; E.fama += 2; },
  texto: () => {
    let t = "Medina se acerca con la planilla bajo el brazo. Te mira un rato largo.\n\n—{N}. El martes a las cuatro entrenás con la Séptima. Traé el apto médico.\n\nTe da la mano. Es una mano dura, de cancha.";
    t += "\n\nEn la tribuna, Ramón levanta el termo como si brindara.";
    if (flag("familia")) t += " A su lado, tu vieja llora y se ríe al mismo tiempo.";
    if (flag("secreto")) t += "\n\nY vos pensás: ahora sí. Ahora se lo podés contar a todos.";
    t += "\n\n**¡SOS JUGADOR DE UNIÓN DEL SUR!**\n\n**Fin del Capítulo 3.** Ahora podés entrenar en el club 🏟️ (rinde el doble que el potrero). El Capítulo 4 —el debut— está en camino.";
    return t;
  },
  opciones: [{ texto: "Volver al barrio como un crack", accion: () => volverAlMundo("¡Fichaste en Unión del Sur! Entrená en el club para mejorar más rápido.") }],
};

ESCENAS.c3_otra = {
  titulo: "Capítulo 3 · La prueba",
  alEntrar: () => { E.diaFinCapitulo = E.dia; sumarFlag("revancha"); },
  texto: "Medina se acerca, serio.\n\n—Tenés algo, pibe. Pero hoy no alcanzó. Volvé otro día. Y entrená.\n\nEl colectivo de vuelta se hace eterno.\n\n**Consejo:** entrená en el potrero ⚽, comprá equipo en Deportes Gol 👟 o subí de nivel con misiones. Podés volver a probarte después de dormir.",
  opciones: [{ texto: "Volver al barrio", accion: () => volverAlMundo("Volvé a probarte en Unión del Sur cuando estés listo.") }],
};
