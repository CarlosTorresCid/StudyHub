import { Link } from 'react-router-dom';
import './ProblemTrainingGuide.css';

const PRIORITY_CLASS = {
  'Muy alta': 'ptg-priority-muy-alta',
  'Alta': 'ptg-priority-alta',
  'Media-Alta': 'ptg-priority-media-alta',
  'Media': 'ptg-priority-media',
};

export const GUIDE_BLOCKS = [
  {
    id: 'graphplan',
    icono: '🧩',
    titulo: 'Graphplan / relaciones mutex',
    prioridad: 'Muy alta',
    aparece: 'Problemas prácticos',
    pide: 'Construir el grafo de planificación nivel a nivel (P[0], A[1], P[1]…) y justificar las relaciones mutex indicando su tipo.',
    plantilla: [
      'Escribe P[0] con el estado inicial.',
      'Construye A[1] con acciones aplicables.',
      'Añade acciones de persistencia/no-op.',
      'Construye P[1] con los efectos.',
      'Repite A[2]/P[2] si el enunciado lo pide.',
      'Busca mutex entre acciones: efectos inconsistentes, interferencia, necesidades competitivas.',
      'Busca mutex entre proposiciones: soporte inconsistente tipo 1 y tipo 2.',
    ],
    errores: [
      'Olvidar no-op.',
      'No incluir proposiciones negadas.',
      'Confundir tipos de mutex.',
      'No justificar.',
    ],
    ejemplo: {
      titulo: 'Graphplan de la paella (examen real)',
      enunciado:
        'Estado inicial: {Hambriento, SartenLimpia, HayArroz}. Objetivo: {Lleno}. ' +
        'Acciones: PrepararPaella (pre: SartenLimpia, HayArroz; ef: HayPaella, ¬SartenLimpia, ¬HayArroz) y ' +
        'ComerPaella (pre: Hambriento, HayPaella; ef: Lleno, ¬Hambriento, ¬HayPaella). ' +
        'Elabora P[0], A[1], P[1], A[2], P[2] e indica una relación mutex de cada uno de los 5 tipos con justificación.',
      diagrama:
        'P[0] = {Hambriento, SartenLimpia, HayArroz}\n' +
        'A[1] = {PrepararPaella, no-op(Hambriento), no-op(SartenLimpia), no-op(HayArroz)}\n' +
        'P[1] = {HayPaella, ¬SartenLimpia, ¬HayArroz,\n' +
        '        Hambriento, SartenLimpia, HayArroz}   (negados + persistidos)\n' +
        'A[2] = {ComerPaella, PrepararPaella, no-ops de todo P[1]}\n' +
        'P[2] = {Lleno, ¬Hambriento, ¬HayPaella} ∪ P[1]',
      resolucion: [
        'P[0] es literalmente el estado inicial.',
        'En A[1] solo es aplicable PrepararPaella (sus precondiciones están en P[0]); ComerPaella no, porque falta HayPaella. Se añade un no-op por cada proposición de P[0].',
        'P[1] reúne los efectos de PrepararPaella y lo que persisten los no-op: aparecen las proposiciones nuevas y también las negadas.',
        'Mutex de efectos inconsistentes en A[1]: PrepararPaella y no-op(SartenLimpia), porque una produce ¬SartenLimpia y la otra SartenLimpia.',
        'Mutex de interferencia en A[1]: PrepararPaella borra SartenLimpia, que es la precondición del no-op(SartenLimpia).',
        'Mutex de necesidades competitivas en A[2]: ComerPaella (necesita HayPaella) y PrepararPaella (necesita SartenLimpia), porque HayPaella y SartenLimpia son mutex en P[1].',
        'Soporte inconsistente tipo 1 en P[1]: dos proposiciones contradictorias, por ejemplo SartenLimpia y ¬SartenLimpia.',
        'Soporte inconsistente tipo 2 en P[1]: dos proposiciones son mutex si TODAS las acciones que pueden producirlas son mutex entre sí. Búscalo cuando haya varias acciones productoras; si todas las parejas productoras son mutex, las proposiciones también lo son.',
      ],
      resultado:
        'En A[2] ya es aplicable ComerPaella y P[2] contiene el objetivo Lleno: el grafo puede detenerse y buscar el plan. Cada mutex queda justificado por su tipo.',
    },
    consejo: 'Justifica cada mutex nombrando su tipo exacto: es lo que más puntúa en la corrección.',
  },
  {
    id: 'minimax',
    icono: '♟️',
    titulo: 'Minimax puro',
    prioridad: 'Alta',
    aparece: 'Problemas prácticos',
    pide: 'Propagar los valores de las hojas hasta la raíz, dar el valor de cada nodo y la estrategia ganadora de MAX (comprobando el umbral si lo hay).',
    plantilla: [
      'Identifica raíz MAX/MIN.',
      'Alterna niveles MAX/MIN.',
      'En MAX toma el máximo.',
      'En MIN toma el mínimo.',
      'Propaga desde hojas hasta raíz.',
      'Escribe el valor de cada nodo.',
      'Indica estrategia de MAX.',
    ],
    errores: [
      'Aplicar máximo en MIN.',
      'No alternar niveles.',
      'Dar solo resultado final.',
    ],
    ejemplo: {
      titulo: 'Árbol de 3 jugadas con umbral de victoria',
      nota: 'Ejemplo representativo basado en los modelos de examen (el árbol cambia, la metodología es idéntica). MAX gana si el valor de la raíz es ≥ 5.',
      enunciado:
        'Árbol con MAX en la raíz, dos nodos MIN (A y B) y cuatro nodos MAX hoja de tercer nivel con recompensas. ' +
        'Aplica Minimax, indica el valor de cada nodo y la estrategia ganadora de MAX.',
      diagrama:
        'MAX raíz\n' +
        '├── MIN A\n' +
        '│   ├── MAX A1 → hojas: 3, 7   ⇒ A1 = max(3,7) = 7\n' +
        '│   └── MAX A2 → hojas: 2, 5   ⇒ A2 = max(2,5) = 5\n' +
        '│       A = min(7,5) = 5\n' +
        '└── MIN B\n' +
        '    ├── MAX B1 → hojas: 6, 1   ⇒ B1 = max(6,1) = 6\n' +
        '    └── MAX B2 → hojas: 4, 2   ⇒ B2 = max(4,2) = 4\n' +
        '        B = min(6,4) = 4\n' +
        'raíz = max(A, B) = max(5, 4) = 5',
      resolucion: [
        'Tercer nivel (MAX): cada nodo toma el máximo de sus hojas: A1 = 7, A2 = 5, B1 = 6, B2 = 4.',
        'Segundo nivel (MIN): cada nodo toma el mínimo de sus hijos: A = min(7,5) = 5 y B = min(6,4) = 4.',
        'Raíz (MAX): toma el máximo de sus hijos: max(5,4) = 5.',
        'Estrategia de MAX: mover hacia A; si MIN responde con A2, MAX termina en la hoja de valor 5.',
      ],
      resultado: 'Valor de la raíz = 5. Como 5 ≥ 5, MAX tiene estrategia ganadora jugando hacia A.',
    },
    consejo: 'Anota MAX/MIN junto a cada nivel antes de propagar y escribe el valor dentro de cada nodo: piden el proceso, no solo la raíz.',
  },
  {
    id: 'alfa-beta',
    icono: '✂️',
    titulo: 'Minimax + poda alfa-beta',
    prioridad: 'Muy alta',
    aparece: 'Problemas prácticos',
    pide: 'Aplicar minimax con poda explorando de izquierda a derecha, marcar los subárboles podados y dar los valores finales de α y β en cada nodo.',
    plantilla: [
      'Recorre izquierda a derecha.',
      'Inicializa alfa = -∞ y beta = +∞.',
      'En MAX actualiza alfa.',
      'En MIN actualiza beta.',
      'Si alfa ≥ beta, poda.',
      'Marca subárboles podados.',
      'Indica valores finales.',
    ],
    errores: [
      'Confundir alfa/beta.',
      'Podar antes de tiempo.',
      'No respetar el orden.',
    ],
    ejemplo: {
      titulo: 'Poda en un árbol MAX-MIN de dos niveles',
      nota: 'Ejemplo representativo basado en los modelos de examen: raíz MAX, tres nodos MIN, exploración de izquierda a derecha.',
      enunciado:
        'Raíz MAX con tres hijos MIN: A con hojas (3, 5), B con hojas (2, 9) y C con hojas (4, 6). ' +
        'Aplica poda alfa-beta indicando qué se poda y por qué.',
      diagrama:
        'MAX raíz (α=-∞, β=+∞)\n' +
        '├── MIN A: hojas 3, 5\n' +
        '│   hoja 3 ⇒ β=3 · hoja 5 no mejora ⇒ A = 3\n' +
        '│   raíz actualiza α = 3\n' +
        '├── MIN B: hojas 2, 9          (hereda α=3, β=+∞)\n' +
        '│   hoja 2 ⇒ β=2 ⇒ α(3) ≥ β(2) ⇒ PODA hoja 9 ✂️\n' +
        '│   B ≤ 2: descartado\n' +
        '└── MIN C: hojas 4, 6          (hereda α=3, β=+∞)\n' +
        '    hoja 4 ⇒ β=4 · hoja 6 no mejora ⇒ C = 4\n' +
        '    raíz = max(3, 4) = 4',
      resolucion: [
        'En A: la hoja 3 baja β a 3; la hoja 5 no la mejora (5 > 3). A vale 3 y la raíz sube α a 3.',
        'En B: la hoja 2 baja β a 2. Como α (3) ≥ β (2), se cumple la condición de poda: la hoja 9 no se explora.',
        'Por qué se poda: B garantiza a MIN un valor ≤ 2, pero MAX ya tiene asegurado un 3 por la rama A, así que MAX nunca elegirá B; seguir explorando B no puede cambiar la decisión.',
        'En C: la hoja 4 baja β a 4 (> α, no se poda); la hoja 6 no mejora. C vale 4.',
        'Raíz: max(3, 4) = 4. MAX elige la rama C.',
      ],
      resultado:
        'Valor de la raíz = 4 jugando hacia C. Subárbol podado: la hoja 9 de B, justificada por α ≥ β (3 ≥ 2). ' +
        'En el examen escribe también el valor minimax propagado de cada nodo visitado y los valores finales de α y β que justifican cada poda.',
    },
    consejo: 'Escribe α y β junto a cada nodo según avanzas y justifica cada poda citando la condición α ≥ β con sus valores concretos.',
  },
  {
    id: 'matriz-confusion',
    icono: '📊',
    titulo: 'Matriz de confusión',
    prioridad: 'Muy alta',
    aparece: 'Preguntas cortas o problemas',
    pide: 'Calcular TP, FN, FP, TN para una clase concreta y las métricas TP Rate (TVP), FP Rate (TFP) y precisión.',
    plantilla: [
      'Identifica clase objetivo.',
      'Recuerda: filas = clase real, columnas = clase predicha.',
      'TP = diagonal.',
      'FN = fila de la clase menos TP.',
      'FP = columna de la clase menos TP.',
      'TN = total - TP - FN - FP.',
      'TP Rate = TP/(TP+FN).',
      'FP Rate = FP/(FP+TN).',
      'Precisión = TP/(TP+FP).',
    ],
    errores: [
      'Confundir filas y columnas.',
      'Confundir FP y FN.',
      'Calcular mal TN en matrices de 3 clases.',
    ],
    ejemplo: {
      titulo: 'Matriz 2×2 de WEKA para la clase "yes"',
      enunciado: 'Dada esta matriz de confusión generada por WEKA, calcula TP, FN, FP, TN, TP Rate, FP Rate y precisión para la clase "yes".',
      diagrama:
        ' a b   <-- classified as\n' +
        ' 8 2 | a = yes\n' +
        ' 1 6 | b = no',
      resolucion: [
        'En WEKA las filas son la clase real y las columnas la clase predicha.',
        'TP (yes reales predichos yes) = 8 — la diagonal de la fila "yes".',
        'FN (yes reales predichos no) = 2 — el resto de la fila "yes".',
        'FP (no reales predichos yes) = 1 — el resto de la columna "a".',
        'TN = total − TP − FN − FP = 17 − 8 − 2 − 1 = 6.',
        'TP Rate = TP/(TP+FN) = 8/10 = 0,8.',
        'FP Rate = FP/(FP+TN) = 1/7 ≈ 0,143.',
        'Precisión = TP/(TP+FP) = 8/9 ≈ 0,889.',
      ],
      resultado: 'Para "yes": TP=8, FN=2, FP=1, TN=6 · TP Rate = 0,8 · FP Rate ≈ 0,143 · Precisión ≈ 0,889.',
    },
    consejo: 'Apunta primero "filas = real, columnas = predicha" en el folio: casi todos los fallos vienen de invertirlo.',
  },
  {
    id: 'ontologias-owl',
    icono: '🕸️',
    titulo: 'Ontologías / OWL',
    prioridad: 'Muy alta',
    aparece: 'Problemas prácticos',
    pide: 'Modelar un enunciado en clases, subclases, propiedades (con dominio y rango), instancias y relaciones concretas.',
    plantilla: [
      'Conceptos generales → clases.',
      'Tipos concretos → subclases.',
      'Nombres propios → instancias.',
      'Verbos/relaciones → ObjectProperty.',
      'Atributos simples → DataProperty.',
      'Define dominio y rango.',
      'Crea instancias con rdf:type.',
      'Relaciona instancias.',
    ],
    errores: [
      'Confundir clase con instancia.',
      'No crear subclases.',
      'No indicar dominio/rango.',
    ],
    ejemplo: {
      titulo: 'Ontología Pizza (examen real)',
      enunciado:
        'Modela: una pizza tiene base (masa original o masa de pan) y tiene ingredientes (tomate, queso, vegetales, carne, frutos del mar). ' +
        'Crea la instancia: pizza margarita de masa de pan con ingredientes tomate y queso.',
      diagrama:
        'Clases:        Pizza, Base, Ingrediente\n' +
        'Subclases:     MasaOriginal ⊑ Base · MasaDePan ⊑ Base\n' +
        '               Tomate, Queso, Vegetales, Carne, FrutosDelMar ⊑ Ingrediente\n' +
        'Propiedades:   tieneBase        (dominio: Pizza, rango: Base)\n' +
        '               tieneIngrediente (dominio: Pizza, rango: Ingrediente)\n' +
        'Instancia:     PizzaMargarita rdf:type Pizza\n' +
        '               PizzaMargarita tieneBase MasaDePan\n' +
        '               PizzaMargarita tieneIngrediente Tomate\n' +
        '               PizzaMargarita tieneIngrediente Queso',
      resolucion: [
        'Conceptos generales del enunciado (pizza, base, ingrediente) se convierten en clases.',
        'Tomate, Queso y el resto de tipos de ingrediente se modelan como subclases porque el enunciado habla de tipos (categorías) de ingredientes. En una respuesta simple podrían modelarse como instancias; la opción de subclases es coherente si se interpretan como categorías.',
        'Los verbos "tiene base" y "tiene ingredientes" se convierten en ObjectProperty, cada una con su dominio (Pizza) y su rango (Base / Ingrediente).',
        'La pizza margarita sí es un individuo concreto: se declara con rdf:type Pizza.',
        'Por último se relaciona la instancia con su base y sus ingredientes usando las propiedades definidas.',
      ],
      resultado: 'Jerarquía de clases con dos taxonomías (bases e ingredientes), dos ObjectProperty con dominio/rango y una instancia completamente relacionada.',
    },
    consejo: 'Para cada nombre del enunciado pregúntate: ¿es un tipo de cosa (clase/subclase) o un individuo con nombre propio (instancia)?',
  },
  {
    id: 'a-estrella',
    icono: '🗺️',
    titulo: 'A* con mapa o grafo',
    prioridad: 'Media',
    aparece: 'Problemas prácticos',
    pide: 'Ejecutar A* iteración a iteración mostrando ABIERTA y CERRADA, dar la ruta final con su coste real y justificar la optimalidad.',
    plantilla: [
      'Identifica nodo inicial y meta.',
      'Crea tabla nodo/padre/g/h/f.',
      'ABIERTA empieza con inicio.',
      'CERRADA empieza vacía.',
      'Expande siempre menor f.',
      'Calcula g acumulado, h y f.',
      'Actualiza si aparece mejor camino.',
      'Termina al extraer la meta.',
      'Reconstruye ruta con padres.',
      'Justifica optimalidad si heurística admisible.',
    ],
    errores: [
      'Usar solo h.',
      'Olvidar g acumulado.',
      'No actualizar mejores caminos.',
    ],
    ejemplo: {
      titulo: 'A* con ciudades — ejemplo representativo',
      nota: 'Grafo textual representativo basado en el patrón real del examen (mapa de carreteras con distancia aérea a Barcelona como heurística).',
      enunciado:
        'Aristas (km): Santander–Bilbao 100, Santander–Burgos 180, Bilbao–Logroño 140, Burgos–Logroño 150, Logroño–Zaragoza 170, Zaragoza–Barcelona 310. ' +
        'Heurística h (distancia aérea a Barcelona): Santander 600, Bilbao 500, Burgos 530, Logroño 400, Zaragoza 250, Barcelona 0. ' +
        'Encuentra la ruta óptima de Santander a Barcelona con A*.',
      diagrama:
        'It. | Expandido (menor f)    | ABIERTA tras expandir (f = g + h)             | CERRADA\n' +
        '----+------------------------+-----------------------------------------------+---------\n' +
        ' 1  | Santander  f=600       | Bilbao f=100+500=600 · Burgos f=180+530=710   | S\n' +
        ' 2  | Bilbao     f=600       | Logroño f=240+400=640 · Burgos 710            | S,Bi\n' +
        ' 3  | Logroño    f=640       | Zaragoza f=410+250=660 · Burgos 710           | S,Bi,L\n' +
        ' 4  | Zaragoza   f=660       | Barcelona f=720+0=720 · Burgos 710            | S,Bi,L,Z\n' +
        ' 5  | Burgos     f=710       | Logroño vía Burgos g=330 > 240 ⇒ no mejora    | +Bu\n' +
        ' 6  | Barcelona  f=720       | META extraída ⇒ fin                           | +BCN',
      resolucion: [
        'Se expande siempre el nodo de ABIERTA con menor f = g + h, nunca solo con h.',
        'g se acumula por el camino: Logroño llega con g = 100 + 140 = 240 vía Bilbao.',
        'En la iteración 5 Burgos se expande antes que Barcelona (710 < 720), pero el camino que ofrece a Logroño (g = 330) es peor que el ya registrado (240), así que no se actualiza nada.',
        'La meta solo cierra el algoritmo cuando se extrae de ABIERTA, no cuando se genera.',
        'Ruta reconstruida con los padres: Santander → Bilbao → Logroño → Zaragoza → Barcelona.',
      ],
      resultado:
        'Coste real = 100 + 140 + 170 + 310 = 720 km. La distancia aérea nunca sobreestima el coste por carretera, luego h es admisible y A* garantiza que esta ruta es óptima.',
    },
    consejo: 'Mantén la tabla nodo/padre/g/h/f al día en cada iteración: los despistes casi siempre vienen de no recalcular g acumulado.',
  },
  {
    id: 'heuristica',
    icono: '🎯',
    titulo: 'Heurística admisible / consistente',
    prioridad: 'Muy alta',
    aparece: 'Pregunta corta con árbol',
    pide: 'Justificar si una heurística es admisible y/o consistente comparando h(n) con h*(n) y con los arcos, y concluir sobre la optimalidad de A* y de la búsqueda avariciosa.',
    plantilla: [
      'Calcula h*(n): coste real mínimo a la meta.',
      'Compara h(n) con h*(n).',
      'Si h(n) ≤ h*(n) para todos, es admisible.',
      "Para consistencia revisa cada arco: h(n) ≤ c(n,n') + h(n').",
      'A* garantiza optimalidad si la heurística es admisible; en búsqueda con grafo cerrado, la consistencia evita problemas de reapertura de nodos y refuerza la garantía práctica.',
      'Avariciosa no garantiza optimalidad porque solo usa h(n).',
    ],
    errores: [
      'Confundir h con coste real.',
      'Comprobar solo un nodo.',
      'Decir que avariciosa es óptima.',
    ],
    ejemplo: {
      titulo: 'Árbol pequeño con h(n) dada',
      nota: 'Ejemplo representativo basado en el patrón real (árbol de búsqueda parcial con heurística visible en cada nodo).',
      enunciado:
        'Árbol: A es el inicio; A→B con coste 2, A→C con coste 3, B→Meta con coste 4, C→Meta con coste 2. ' +
        'Heurística: h(A)=4, h(B)=3, h(C)=2, h(Meta)=0. ¿Es admisible? ¿Es consistente? ¿Garantizan A* y la avariciosa la optimalidad?',
      diagrama:
        'h*(Meta) = 0\n' +
        'h*(B) = 4              (B→Meta)\n' +
        'h*(C) = 2              (C→Meta)\n' +
        'h*(A) = min(2+4, 3+2) = 5\n' +
        '\n' +
        'Admisibilidad:  h(A)=4 ≤ 5 ✓ · h(B)=3 ≤ 4 ✓ · h(C)=2 ≤ 2 ✓ · h(M)=0 ≤ 0 ✓\n' +
        'Consistencia:   A→B: 4 ≤ 2+3=5 ✓ · A→C: 4 ≤ 3+2=5 ✓\n' +
        '                B→M: 3 ≤ 4+0=4 ✓ · C→M: 2 ≤ 2+0=2 ✓',
      resolucion: [
        'Primero se calcula h*(n), el coste real mínimo desde cada nodo hasta la meta, recorriendo los caminos posibles.',
        'Admisibilidad: se comprueba h(n) ≤ h*(n) en TODOS los nodos, no solo en uno. Aquí se cumple en los cuatro, luego h es admisible.',
        "Consistencia: se revisa cada arco con h(n) ≤ c(n,n') + h(n'). Se cumple en los cuatro arcos, luego h también es consistente.",
        'Como h es admisible, A* garantiza encontrar la solución óptima (A→C→Meta, coste 5).',
        'La búsqueda avariciosa solo usa h(n) e ignora el coste recorrido, así que no garantiza optimalidad aunque la heurística sea admisible.',
      ],
      resultado: 'h es admisible y consistente ⇒ A* garantiza la ruta óptima A→C→Meta con coste 5. La avariciosa no ofrece ninguna garantía.',
    },
    consejo: 'Calcula primero h*(n) de todos los nodos; el resto del ejercicio es comparar columnas y citar las dos definiciones.',
  },
  {
    id: 'strips-pddl',
    icono: '⚙️',
    titulo: 'STRIPS / PDDL práctico',
    prioridad: 'Alta',
    aparece: 'Pregunta corta o problema',
    pide: 'Decidir qué acciones son aplicables desde un estado comprobando precondiciones y calcular el estado resultante con efectos positivos y negativos.',
    plantilla: [
      'Copia estado inicial.',
      'Para cada acción, revisa precondiciones.',
      'Si falta una precondición, no es aplicable.',
      'Si se cumplen todas, es aplicable.',
      'Nuevo estado: añade efectos positivos y elimina efectos negativos.',
    ],
    errores: [
      'Aplicar acciones sin comprobar precondiciones.',
      'Olvidar efectos negativos.',
    ],
    ejemplo: {
      titulo: 'El problema de la tarta (examen real)',
      enunciado:
        'Estado inicial: ¬Tener(tarta) ∧ Comida(tarta). Meta: Tener(tarta) ∧ Comida(tarta). ' +
        'Acciones: Comer(tarta) (pre: Tener(tarta); ef: ¬Tener(tarta) ∧ Comida(tarta)) y ' +
        'Hornear(tarta) (pre: ¬Tener(tarta); ef: Tener(tarta)). ' +
        '¿Qué acciones son aplicables desde el estado inicial y qué estado resulta?',
      diagrama:
        'Estado inicial: {¬Tener(tarta), Comida(tarta)}\n' +
        '\n' +
        'Comer(tarta):   pre Tener(tarta)   → NO está en el estado  ⇒ NO aplicable\n' +
        'Hornear(tarta): pre ¬Tener(tarta)  → SÍ está en el estado  ⇒ APLICABLE\n' +
        '\n' +
        'Aplicar Hornear: + Tener(tarta)\n' +
        'Estado resultante: {Tener(tarta), Comida(tarta)}  ⇒ ¡meta alcanzada!',
      resolucion: [
        'Se revisan las precondiciones de cada acción contra el estado, literal a literal.',
        'Comer(tarta) exige Tener(tarta), que no está en el estado inicial: no es aplicable.',
        'Hornear(tarta) exige ¬Tener(tarta), que sí está: es aplicable.',
        'El nuevo estado se construye añadiendo los efectos positivos (Tener) y eliminando los negados; Comida(tarta) se conserva porque nada la borra.',
        'El estado resultante {Tener(tarta), Comida(tarta)} satisface la meta.',
      ],
      resultado: 'Solo Hornear(tarta) es aplicable; tras aplicarla, el estado resultante ya cumple la meta.',
    },
    consejo: 'Trabaja sobre una copia escrita del estado y marca explícitamente qué literales añades y cuáles eliminas.',
  },
  {
    id: 'id3-weka',
    icono: '🌳',
    titulo: 'ID3 / árbol de decisión con WEKA',
    prioridad: 'Media-Alta',
    aparece: 'Problema ocasional',
    pide: 'Clasificar una instancia siguiendo el árbol generado, razonar sobre la relevancia de atributos ausentes e interpretar la matriz de confusión de la salida.',
    plantilla: [
      'Empieza por la raíz del árbol.',
      'Sigue la rama según valores de la instancia.',
      'Llega a una hoja.',
      'La hoja es la clase predicha.',
      'Si un atributo no aparece, no fue relevante para ese modelo.',
      'Si hay matriz, usa plantilla de matriz de confusión.',
    ],
    errores: [
      'Usar atributos que no aparecen.',
      'No seguir el orden de ramas.',
      'Confundir clase real/predicha.',
    ],
    ejemplo: {
      titulo: '"Jugar al aire libre" (examen real, Quinlan 1986)',
      enunciado:
        'Árbol ID3 generado por WEKA con atributos windy, humidity, temperature y outlook, y clase play (yes/no). ' +
        'P1: con windy=TRUE, humidity=normal, temperature=mild, outlook=sunny, ¿qué decide el árbol? ' +
        'P2: ¿es relevante el atributo temperature?',
      diagrama:
        'outlook = sunny\n' +
        '│   humidity = high   → play = no\n' +
        '│   humidity = normal → play = yes   ← nuestra instancia\n' +
        'outlook = overcast    → play = yes\n' +
        'outlook = rainy\n' +
        '    windy = TRUE      → play = no\n' +
        '    windy = FALSE     → play = yes',
      resolucion: [
        'Se parte de la raíz (outlook). La instancia tiene outlook=sunny: se baja por esa rama.',
        'El siguiente nodo pregunta por humidity. La instancia tiene humidity=normal: se llega a la hoja play=yes.',
        'Los valores de windy y temperature no se consultan en este camino: el árbol decide solo con los atributos que aparecen en la ruta.',
        'temperature no aparece en ningún nodo del árbol: ID3 no lo seleccionó porque su ganancia de información no superó a la de los demás atributos. No es relevante para este modelo.',
        'Si la salida de WEKA incluye matriz de confusión, se interpreta con la plantilla del bloque de matriz de confusión.',
      ],
      resultado: 'El árbol clasifica la instancia como play = yes. temperature no es relevante para el modelo: no aparece en el árbol.',
    },
    consejo: 'Recorre el árbol rama a rama con la instancia delante y no uses atributos que no estén en el camino.',
  },
  {
    id: 'rdf',
    icono: '🔗',
    titulo: 'RDF',
    prioridad: 'Alta',
    aparece: 'Pregunta corta',
    pide: 'Traducir frases en lenguaje natural a tripletas sujeto–predicado–objeto, declarando tipos con rdf:type.',
    plantilla: [
      'Identifica individuos.',
      'Identifica relaciones.',
      'Cada frase → sujeto-predicado-objeto.',
      'Usa rdf:type para clases.',
      'Crea una tripleta por hecho.',
    ],
    errores: [
      'Escribir texto natural en vez de tripletas.',
      'No expresar todas las relaciones.',
    ],
    ejemplo: {
      titulo: 'La prima de Juan (examen real)',
      enunciado: '¿Cómo expresarías con RDF la sentencia: "La prima de Juan es María quien también es prima de Luis"?',
      diagrama:
        'Juan  rdf:type    Persona\n' +
        'Maria rdf:type    Persona\n' +
        'Luis  rdf:type    Persona\n' +
        '\n' +
        'tienePrima rdfs:domain Persona\n' +
        'tienePrima rdfs:range  Persona\n' +
        '\n' +
        'Juan  tienePrima  Maria\n' +
        'Luis  tienePrima  Maria',
      resolucion: [
        'Individuos del enunciado: Juan, María y Luis. Cada uno se declara como Persona con rdf:type.',
        'La relación "es prima de" se modela como la propiedad tienePrima, con dominio y rango Persona. Ojo a la dirección: usamos tienePrima con el sentido "X tiene como prima a Y", por eso el sujeto es Juan (y Luis) y el objeto es Maria.',
        'Cada hecho del enunciado genera exactamente una tripleta sujeto–predicado–objeto: Juan tienePrima Maria y Luis tienePrima Maria.',
        'Método general: el sujeto es quien tiene la relación, el predicado es la relación y el objeto es con quién se relaciona.',
      ],
      resultado: 'Tres tripletas de tipo, una propiedad con dominio/rango y dos tripletas de relación: todos los hechos quedan expresados.',
    },
    consejo: 'Cuenta los hechos del enunciado: debe salir exactamente una tripleta por cada uno, sin texto en lenguaje natural.',
  },
];

export function ProblemTrainingCard({ to }) {
  return (
    <section className="ptg-card">
      <div className="ptg-card-icon" aria-hidden="true">🧭</div>
      <div className="ptg-card-body">
        <div className="ptg-card-title">Entrenamiento de problemas</div>
        <p className="ptg-card-text">
          Manual paso a paso para resolver Graphplan, Minimax, matrices, ontologías,
          A*, RDF y el resto de ejercicios típicos de IAIC.
        </p>
      </div>
      <Link to={to} className="btn btn-primary ptg-card-cta">
        Abrir entrenamiento
      </Link>
    </section>
  );
}

export default function ProblemTrainingGuide() {
  return (
    <div className="problem-training-guide">
      <nav className="ptg-chips" aria-label="Tipos de problema">
        {GUIDE_BLOCKS.map(block => (
          <a key={block.id} href={`#ptg-${block.id}`} className="ptg-chip">
            <span aria-hidden="true">{block.icono}</span>
            {block.titulo}
          </a>
        ))}
      </nav>

      <div className="ptg-list">
        {GUIDE_BLOCKS.map(block => (
          <details key={block.id} id={`ptg-${block.id}`} className="ptg-item">
            <summary className="ptg-summary">
              <span className="ptg-summary-icon" aria-hidden="true">{block.icono}</span>
              <span className="ptg-summary-main">
                <span className="ptg-summary-title">{block.titulo}</span>
                <span className="ptg-summary-sub">{block.aparece}</span>
              </span>
              <span className={`ptg-priority ${PRIORITY_CLASS[block.prioridad] || ''}`}>
                {block.prioridad}
              </span>
              <span className="ptg-summary-marker" aria-hidden="true">▾</span>
            </summary>

            <div className="ptg-body">
              <p className="ptg-pide">
                <strong>Qué suele pedir el examen:</strong> {block.pide}
              </p>

              <div className="ptg-section ptg-section-plantilla">
                <div className="ptg-section-title">Plantilla paso a paso</div>
                <ol className="ptg-steps">
                  {block.plantilla.map((paso, i) => (
                    <li key={i}>{paso}</li>
                  ))}
                </ol>
              </div>

              <div className="ptg-section ptg-section-ejemplo">
                <div className="ptg-section-title">Ejemplo resuelto · {block.ejemplo.titulo}</div>
                {block.ejemplo.nota && (
                  <p className="ptg-ejemplo-nota">{block.ejemplo.nota}</p>
                )}
                <p className="ptg-ejemplo-enunciado">{block.ejemplo.enunciado}</p>
                {block.ejemplo.diagrama && (
                  <pre className="ptg-ejemplo-diagrama">{block.ejemplo.diagrama}</pre>
                )}
                <ul className="ptg-ejemplo-pasos">
                  {block.ejemplo.resolucion.map((paso, i) => (
                    <li key={i}>{paso}</li>
                  ))}
                </ul>
                <p className="ptg-ejemplo-resultado">
                  <strong>Resultado:</strong> {block.ejemplo.resultado}
                </p>
              </div>

              <div className="ptg-section ptg-section-errores">
                <div className="ptg-section-title">Errores típicos</div>
                <ul className="ptg-errors">
                  {block.errores.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>

              <div className="ptg-tip">
                <span className="ptg-tip-label">💡 Consejo de examen</span>
                {block.consejo}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
