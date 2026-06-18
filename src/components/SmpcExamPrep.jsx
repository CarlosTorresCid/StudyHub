import './TeExamPrep.css';

const BLUE = '#4F7CAC';
const DARK_BLUE = '#2d5a8a';
const PURPLE = '#8b5cf6';
const RED = '#ef4444';
const ORANGE = '#E07B39';
const EMERALD = '#10b981';
const YELLOW = '#d97706';

/* ── Helpers ───────────────────────────────────────────────────────────── */

function AccordionBlock({ id, icon, title, subtitle, children }) {
  return (
    <details id={`smpc-prep-${id}`} className="ptg-item">
      <summary className="ptg-summary">
        <span className="ptg-summary-icon" aria-hidden="true">{icon}</span>
        <span className="ptg-summary-main">
          <span className="ptg-summary-title">{title}</span>
          {subtitle && <span className="ptg-summary-sub">{subtitle}</span>}
        </span>
        <span className="ptg-summary-marker" aria-hidden="true">▾</span>
      </summary>
      <div className="ptg-body">{children}</div>
    </details>
  );
}

function Section({ title, color, children }) {
  const c = color || BLUE;
  return (
    <div className="ptg-section" style={{ borderLeftColor: c }}>
      {title && <div className="ptg-section-title" style={{ color: c }}>{title}</div>}
      {children}
    </div>
  );
}

function BadgeList({ badges, variant }) {
  return (
    <div className="te-prep-badge-list">
      {badges.map((b, i) => (
        <span key={i} className={`te-prep-badge ${variant || ''}`}>{b}</span>
      ))}
    </div>
  );
}

function Frase({ children }) {
  return <blockquote className="te-prep-frase">{children}</blockquote>;
}

function Warning({ children }) {
  return (
    <div className="te-prep-warning">
      <span className="te-prep-warning-icon">⚠️</span>
      <span>{children}</span>
    </div>
  );
}

function Info({ children }) {
  return <div className="te-prep-info">{children}</div>;
}

function Checklist({ items }) {
  return (
    <ul className="te-prep-checklist">
      {items.map((item, i) => (
        <li key={i}><span className="te-prep-check">✓</span><span>{item}</span></li>
      ))}
    </ul>
  );
}

function ErrorList({ items }) {
  return (
    <ul className="te-prep-checklist">
      {items.map((item, i) => (
        <li key={i}><span className="te-prep-xmark">✗</span><span>{item}</span></li>
      ))}
    </ul>
  );
}

function Table({ heads, rows }) {
  return (
    <div className="te-prep-table-wrap">
      <table className="te-prep-table">
        <thead>
          <tr>{heads.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Rule({ label, children }) {
  return (
    <div className="te-prep-rule" style={{
      borderLeftColor: BLUE,
      background: 'linear-gradient(180deg, rgba(79,124,172,0.07), rgba(79,124,172,0.03))',
      border: '1px solid rgba(79,124,172,0.22)',
      borderLeft: `4px solid ${BLUE}`,
    }}>
      <div className="te-prep-rule-label" style={{ color: DARK_BLUE }}>{label}</div>
      <div className="te-prep-rule-text">{children}</div>
    </div>
  );
}

function QA({ question, answer, id }) {
  return (
    <div className="te-prep-qa">
      {id && (
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: BLUE, marginBottom: 4 }}>
          {id}
        </div>
      )}
      <div className="te-prep-qa-q">📝 {question}</div>
      <div className="te-prep-qa-a">{answer}</div>
    </div>
  );
}

function NotaExamen({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 15px',
      fontSize: 13, color: 'var(--text)', lineHeight: 1.65,
      background: 'linear-gradient(180deg, rgba(79,124,172,0.08), rgba(79,124,172,0.03))',
      border: '1px solid rgba(79,124,172,0.18)',
      borderLeft: `4px solid ${BLUE}`,
      borderRadius: '0 13px 13px 0',
      marginBottom: 8,
    }}>
      <span style={{ flexShrink: 0, fontSize: 16 }}>⭐</span>
      <span>{children}</span>
    </div>
  );
}

/* ── Block 0: Resumen rápido y cómo responder ──────────────────────────── */

function Block0() {
  const grupos = [
    {
      label: 'JADE y comportamientos (T4)',
      color: BLUE,
      border: 'rgba(79,124,172,0.2)',
      bg: 'rgba(79,124,172,0.05)',
      preguntas: [
        'smpc-desarrollo-001 — CyclicBehaviour, OneShotBehaviour y performativa REQUEST (parque solar)',
        'smpc-desarrollo-012 · Pregunta 3 — Comportamientos JADE en examen integrador (parque solar)',
      ],
    },
    {
      label: 'Agentes, autonomía y arquitectura BDI (T1–T3)',
      color: PURPLE,
      border: 'rgba(139,92,246,0.2)',
      bg: 'rgba(139,92,246,0.05)',
      preguntas: [
        'smpc-desarrollo-002 — Autonomía del agente y preprocesamiento',
        'smpc-desarrollo-010 — AID para plataformas remotas y elección BDI (hospital)',
        'smpc-desarrollo-013 · Pregunta 1 — BDI en examen integrador (hospital)',
      ],
    },
    {
      label: 'Preprocesamiento de imágenes (T7–T8)',
      color: EMERALD,
      border: 'rgba(16,185,129,0.2)',
      bg: 'rgba(16,185,129,0.05)',
      preguntas: [
        'smpc-desarrollo-002 — Qué es el preprocesamiento, por qué antes de segmentación',
        'smpc-desarrollo-015 · Pregunta 1 — Etapas de preprocesamiento en logística',
      ],
    },
    {
      label: 'Transformada de Fourier (T9)',
      color: ORANGE,
      border: 'rgba(224,123,57,0.2)',
      bg: 'rgba(224,123,57,0.05)',
      preguntas: [
        'smpc-desarrollo-003 — Ventaja de Fourier e interferencia periódica (parque solar)',
        'smpc-desarrollo-004 — Fourier y procesamiento distribuido en tiempo real',
        'smpc-desarrollo-005 — Filtro paso bajo vs. filtro de muesca (industria)',
        'smpc-desarrollo-008 · Pregunta 3 — Fourier en videovigilancia',
        'smpc-desarrollo-012 · Pregunta 1 — Fourier en examen integrador (parque solar)',
        'smpc-desarrollo-014 · Pregunta 3 — Fourier en videovigilancia (variante)',
      ],
    },
    {
      label: 'Segmentación de imágenes (T10)',
      color: YELLOW,
      border: 'rgba(217,119,6,0.2)',
      bg: 'rgba(217,119,6,0.05)',
      preguntas: [
        'smpc-desarrollo-006 — Criterios y tres categorías de segmentación (parque solar)',
        'smpc-desarrollo-007 — Umbralización e iluminación no uniforme + coordinación agentes',
        'smpc-desarrollo-011 · Pregunta 3 — Umbralización en hospital (escala de grises)',
        'smpc-desarrollo-012 · Pregunta 2 — Segmentación en examen integrador',
        'smpc-desarrollo-013 · Pregunta 3 — Umbralización en examen integrador',
        'smpc-desarrollo-015 · Pregunta 2 — Segmentación en logística',
      ],
    },
    {
      label: 'Pipeline completo de visión artificial (T7–T10)',
      color: RED,
      border: 'rgba(239,68,68,0.2)',
      bg: 'rgba(239,68,68,0.05)',
      preguntas: [
        'smpc-desarrollo-008 — Pipeline completo de videovigilancia (3 preguntas)',
        'smpc-desarrollo-011 — Pipeline médico: visión por computador + umbralización (hospital)',
        'smpc-desarrollo-013 — Examen integrador: BDI + pipeline + umbralización (hospital)',
        'smpc-desarrollo-014 — Pipeline de videovigilancia (variante con Fourier)',
        'smpc-desarrollo-015 — Pipeline de inspección industrial (logística)',
      ],
    },
    {
      label: 'Integración SMA + visión artificial (T1)',
      color: BLUE,
      border: 'rgba(79,124,172,0.2)',
      bg: 'rgba(79,124,172,0.05)',
      preguntas: [
        'smpc-desarrollo-004 — SMA vs. sistema centralizado en tiempo real',
        'smpc-desarrollo-007 — Contract Net para repartir análisis por zonas',
        'smpc-desarrollo-009 — Integración de visión artificial y SMA',
      ],
    },
  ];

  return (
    <>
      <Section title="Estructura del examen de desarrollo" color={BLUE}>
        <Info>
          La pregunta de desarrollo es <strong>un único ejercicio integrador dividido en 3 apartados</strong>, cada uno de 2 puntos (total 6 pts). Los apartados suelen combinar 2-3 patrones en un mismo escenario (parque solar, hospital, videovigilancia, logística).
        </Info>
        <Table
          heads={['Partes', 'Puntuación']}
          rows={[
            ['10 preguntas tipo test', '4 pts (0,4 pts × 10)'],
            ['1 pregunta de desarrollo — 3 apartados', '6 pts (2 pts × 3)'],
          ]}
        />
      </Section>

      <Section title="Guía de 5 pasos para responder cualquier apartado" color={PURPLE}>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li><strong style={{ color: 'var(--text)' }}>Identifica el patrón</strong> — ¿Comportamiento JADE? ¿Fourier? ¿Segmentación? ¿Pipeline? ¿BDI?</li>
          <li><strong style={{ color: 'var(--text)' }}>Define brevemente los conceptos clave</strong> — 1-2 frases por concepto.</li>
          <li><strong style={{ color: 'var(--text)' }}>Aplica al caso concreto</strong> — Usa los elementos del enunciado (parque, hospital, cámara, agente…).</li>
          <li><strong style={{ color: 'var(--text)' }}>Justifica la elección</strong> — Por qué esa técnica/comportamiento/arquitectura y no otra.</li>
          <li><strong style={{ color: 'var(--text)' }}>Cierra con ventaja o consecuencia práctica</strong> — Qué mejora o permite este enfoque.</li>
        </ol>
      </Section>

      <Section title="Preguntas del banco agrupadas por patrón" color={EMERALD}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {grupos.map((g) => (
            <div key={g.label} style={{
              padding: '12px 15px',
              borderRadius: 13,
              border: `1px solid ${g.border}`,
              borderLeft: `4px solid ${g.color}`,
              background: `linear-gradient(180deg, ${g.bg}, transparent)`,
            }}>
              <div style={{ fontWeight: 800, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.07em', color: g.color, marginBottom: 7 }}>
                {g.label}
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {g.preguntas.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Casos recurrentes en el banco" color={ORANGE}>
        <Table
          heads={['Escenario', 'Patrones que suele combinar']}
          rows={[
            ['Parque solar (paneles fotovoltaicos)', 'Fourier (reflejo del sol) + Segmentación (zonas sucias) + JADE (orden de limpieza)'],
            ['Hospital / Resonancia magnética', 'BDI (monitorización continua) + Pipeline (preprocesamiento + umbralización) + Visión computador'],
            ['Videovigilancia urbana', 'Pipeline completo (preprocesamiento + segmentación + clasificación) + Fourier (ruido exterior)'],
            ['Inspección industrial / Logística', 'Preprocesamiento + Segmentación + Detección de bordes/gradiente + Pipeline'],
            ['Análisis médico de células', 'Umbralización + limitación iluminación no uniforme + coordinación Contract Net'],
          ]}
        />
      </Section>
    </>
  );
}

/* ── Block 1: JADE y comportamientos ────────────────────────────────────── */

function Block1() {
  return (
    <>
      <NotaExamen>Patrón más frecuente del banco. Aparece en smpc-desarrollo-001 y como Pregunta 3 del examen integrador (smpc-desarrollo-012).</NotaExamen>

      <Section title="Qué suelen pedir" color={BLUE}>
        <BadgeList badges={[
          'CyclicBehaviour vs OneShotBehaviour',
          'Justificar el comportamiento elegido',
          'Performativa ACL adecuada',
          'Por qué REQUEST y no INFORM',
          'Tarea continua vs. acción puntual',
        ]} />
      </Section>

      <Section title="Los tres tipos de comportamiento JADE" color={PURPLE}>
        <Table
          heads={['Comportamiento', 'Cuándo usarlo', 'Ejemplo en examen']}
          rows={[
            ['CyclicBehaviour', 'Tarea continua o repetida: escuchar mensajes, monitorizar resultados, comprobar el estado del entorno.', 'Escuchar continuamente los resultados del análisis de imagen del agente de visión.'],
            ['OneShotBehaviour', 'Acción puntual que se ejecuta una sola vez: enviar una orden, lanzar una alerta.', 'Enviar la orden de limpieza al robot cuando se detecta suciedad.'],
            ['Behaviour (con done())', 'Comportamiento con condición de finalización manual. Se usa cuando el número de iteraciones es conocido o depende de una condición compleja.', 'Procesar un número fijo de imágenes y finalizar.'],
          ]}
        />
      </Section>

      <Section title="Performativas ACL más importantes" color={ORANGE}>
        <Table
          heads={['Performativa', 'Significado', 'Cuándo usarla']}
          rows={[
            ['REQUEST', 'Solicitar al agente receptor que realice una acción concreta.', 'El agente gestor pide al robot que ejecute la limpieza.'],
            ['INFORM', 'Comunicar un resultado o información al receptor.', 'El agente de visión informa al gestor de que ha detectado suciedad.'],
            ['CFP (Call For Proposal)', 'Anunciar una tarea y pedir propuestas (Contract Net).', 'El coordinador anuncia zonas de imagen para que los agentes oferten.'],
            ['PROPOSE', 'Responder a un CFP con una oferta.', 'Agente especializado propone analizar la zona norte.'],
            ['ACCEPT_PROPOSAL', 'Aceptar una oferta recibida.', 'El coordinador acepta la oferta del agente.'],
          ]}
        />
        <Warning>
          Trampa frecuente: usar <strong>INFORM</strong> cuando el agente solicita una acción. Si el objetivo es que el receptor haga algo, la performativa es <strong>REQUEST</strong>. INFORM solo comunica información, no solicita.
        </Warning>
      </Section>

      <Section title="Respuesta modelo" color={EMERALD}>
        <Frase>
          &ldquo;Para escuchar continuamente los resultados del análisis de imagen se usaría un <strong>CyclicBehaviour</strong>, porque se ejecuta indefinidamente y es adecuado para una monitorización constante.

Para enviar la orden de limpieza se usaría un <strong>OneShotBehaviour</strong>, porque la orden es una acción puntual que debe ejecutarse una sola vez cuando se detecta la condición de suciedad.

La performativa ACL más adecuada es <strong>REQUEST</strong>, ya que expresa que el agente emisor solicita al receptor que realice una acción concreta, en este caso ejecutar la limpieza.&rdquo;
        </Frase>
      </Section>

      <Section title="Palabras clave obligatorias" color={BLUE}>
        <BadgeList badges={['CyclicBehaviour', 'OneShotBehaviour', 'indefinidamente', 'acción puntual', 'una sola vez', 'REQUEST', 'performativa ACL', 'solicitar una acción']} />
      </Section>

      <Section title="Errores frecuentes" color={RED}>
        <ErrorList items={[
          'Usar OneShotBehaviour para escucha continua de mensajes.',
          'Usar CyclicBehaviour para enviar una única orden.',
          'Confundir REQUEST con INFORM: REQUEST solicita acción, INFORM comunica información.',
          'No justificar por qué se elige cada comportamiento.',
          'Omitir la performativa ACL cuando la pregunta la pide explícitamente.',
        ]} />
      </Section>

      <Section title="Preguntas del banco relacionadas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            id="smpc-desarrollo-001"
            question="El agente que decide cuándo lanzar la orden de limpieza debe: (a) escuchar continuamente los resultados del análisis de imagen y (b) enviar la orden al robot. Indica qué tipo de comportamiento JADE usarías para cada tarea, justificándolo, y qué performativa ACL sería la más adecuada para solicitar la limpieza al robot y por qué. (Parque solar)"
            answer="(a) CyclicBehaviour — se ejecuta indefinidamente, adecuado para monitorización constante. (b) OneShotBehaviour — acción puntual ejecutada una sola vez al detectar suciedad. Performativa: REQUEST, porque solicita al robot que realice una acción concreta."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 2: Agentes, autonomía y BDI ──────────────────────────────────── */

function Block2() {
  return (
    <>
      <NotaExamen>Aparece en smpc-desarrollo-010 (AID + BDI) y como Pregunta 1 del integrador smpc-desarrollo-013. La justificación de BDI frente a reactivo/proactivo es la clave.</NotaExamen>

      <Section title="Qué suelen pedir" color={BLUE}>
        <BadgeList badges={[
          'AID y plataformas remotas',
          'Agente reactivo vs proactivo vs BDI',
          'Por qué BDI para sistemas médicos',
          'Autonomía como propiedad del agente',
          'Creencias / deseos / intenciones',
        ]} />
      </Section>

      <Section title="AID — Agent Identifier" color={PURPLE}>
        <Info>
          El <strong>AID</strong> (Agent Identifier) identifica de forma única a un agente dentro de la plataforma JADE. Sus <strong>direcciones</strong> indican los puntos de acceso o transporte mediante los que otros agentes pueden enviarle mensajes, incluso si se encuentra en una <strong>plataforma remota diferente</strong>.
        </Info>
        <Rule label="Plantilla AID">
          {`El AID identifica de forma única al agente.
Sus direcciones permiten localizar y contactar con agentes en plataformas remotas,
indicando los puntos de acceso o transportes disponibles para enviarles mensajes.`}
        </Rule>
      </Section>

      <Section title="Tipos de agente — Comparativa" color={ORANGE}>
        <Table
          heads={['Tipo', 'Cómo actúa', 'Limitación']}
          rows={[
            ['Reactivo', 'Solo responde a estímulos inmediatos del entorno. Sin estado interno ni planificación.', 'No planifica ni mantiene historial.'],
            ['Proactivo', 'Toma iniciativa según sus objetivos, sin esperar solo estímulos externos.', 'No integra historial ni adapta planes complejos.'],
            ['BDI', 'Mantiene creencias (información), deseos (objetivos) e intenciones (planes concretos). Planifica y se adapta.', 'Más complejo de implementar.'],
          ]}
        />
        <Warning>
          Para sistemas que deben planificar, mantener historial del paciente/entorno y adaptarse a cambios, el tipo adecuado es siempre <strong>BDI</strong>. Justificarlo mencionando los tres componentes (creencias, deseos, intenciones) y aplicarlos al caso concreto.
        </Warning>
      </Section>

      <Section title="Cómo justificar BDI en examen" color={EMERALD}>
        <Checklist items={[
          'Creencias → qué información maneja el agente (resultados de análisis, historial del paciente, imágenes).',
          'Deseos → objetivos del sistema (detectar anomalías, reducir falsos negativos, programar revisiones).',
          'Intenciones → planes concretos que ejecuta (lanzar alerta, planificar revisión periódica, priorizar caso).',
          'Citar que el agente reactivo solo respondería a estímulos y el proactivo no integraría historial.',
          'Vincular la planificación y adaptación con la necesidad concreta del escenario.',
        ]} />
      </Section>

      <Section title="Autonomía — La propiedad clave" color={BLUE}>
        <Frase>
          &ldquo;La propiedad del agente que le permite decidir sin intervención humana es la <strong>autonomía</strong>: el agente puede actuar y tomar decisiones según sus objetivos y el estado percibido del entorno, sin requerir instrucciones explícitas de un operario en cada momento.&rdquo;
        </Frase>
      </Section>

      <Section title="Respuesta modelo completa — BDI hospital" color={PURPLE}>
        <Frase>
          &ldquo;Para el sistema hospitalario sería más adecuado un agente <strong>BDI</strong>. Un agente puramente reactivo solo respondería a estímulos inmediatos, sin capacidad de planificar. Un agente proactivo puede tomar iniciativa, pero el modelo BDI encaja mejor cuando el sistema debe gestionar conocimiento del entorno y del paciente, objetivos y planes.

En BDI, las <strong>creencias</strong> representan la información disponible: resultados de análisis, historial clínico y estado del paciente. Los <strong>deseos</strong> representan objetivos: detectar anomalías, reducir falsos negativos o programar revisiones periódicas. Las <strong>intenciones</strong> son los planes concretos que el agente decide ejecutar: lanzar una alerta, planificar una revisión o priorizar un caso. Por eso BDI es adecuado para monitorización continua con adaptación al historial.&rdquo;
        </Frase>
      </Section>

      <Section title="Palabras clave obligatorias" color={BLUE}>
        <BadgeList badges={['BDI', 'creencias', 'deseos', 'intenciones', 'planificación', 'historial', 'autonomía', 'AID', 'plataforma remota', 'reactivo', 'proactivo']} />
      </Section>

      <Section title="Errores frecuentes" color={RED}>
        <ErrorList items={[
          'Elegir agente reactivo para escenarios que requieren planificación o historial.',
          'No aplicar los tres componentes BDI (creencias, deseos, intenciones) al caso concreto.',
          'Confundir AID con la dirección IP del servidor.',
          'Decir que el AID es solo el nombre del agente, sin mencionar las direcciones de transporte.',
          'Omitir la autonomía cuando la pregunta pide la propiedad que permite actuar sin intervención humana.',
        ]} />
      </Section>

      <Section title="Preguntas del banco relacionadas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            id="smpc-desarrollo-010"
            question="Dos agentes JADE se están comunicando, pero uno está en una plataforma remota. ¿Para qué se usan las direcciones del AID? ¿Qué tipo de agente (reactivo, proactivo o BDI) sería más adecuado para un sistema que no solo responde a anomalías, sino que también planifica revisiones periódicas y se adapta al historial del paciente?"
            answer="El AID identifica de forma única al agente; sus direcciones indican los puntos de acceso para que otros agentes puedan enviarle mensajes incluso en plataformas remotas. BDI es el más adecuado: creencias (resultados, historial), deseos (detectar anomalías, programar revisiones), intenciones (lanzar alerta, priorizar caso). El reactivo solo responde a estímulos; el proactivo no integra historial complejo."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 3: Preprocesamiento de imágenes ──────────────────────────────── */

function Block3() {
  return (
    <>
      <NotaExamen>Aparece en smpc-desarrollo-002 como pregunta standalone y como Pregunta 1 de smpc-desarrollo-015 (logística). Casi siempre se pide junto con la justificación del «por qué antes de la segmentación».</NotaExamen>

      <Section title="Qué suelen pedir" color={BLUE}>
        <BadgeList badges={[
          'Qué es el preprocesamiento',
          'Por qué antes de la segmentación',
          'Qué problemas evita',
          'Qué operaciones incluye',
          'Propiedad del agente para decidirlo',
        ]} />
      </Section>

      <Section title="Definición y operaciones típicas" color={PURPLE}>
        <Info>
          El <strong>preprocesamiento</strong> consiste en preparar la imagen antes del análisis principal, aplicando operaciones para mejorar su calidad y eliminar información que interferiría con el procesamiento posterior.
        </Info>
        <Table
          heads={['Operación', 'Qué soluciona']}
          rows={[
            ['Eliminación de ruido (filtrado)', 'Reduce artefactos o píxeles espurios que confundirían la segmentación.'],
            ['Mejora de contraste', 'Hace más diferenciables las regiones de interés respecto al fondo.'],
            ['Normalización de iluminación', 'Compensa variaciones de luz que afectarían a la umbralización.'],
            ['Reducción de información innecesaria', 'Elimina regiones o canales irrelevantes para centrar el análisis.'],
            ['Extracción de región de interés (ROI)', 'Acota el área de análisis para reducir coste computacional.'],
            ['Conversión a escala de grises', 'Simplifica el espacio de color cuando el color no aporta información relevante.'],
          ]}
        />
      </Section>

      <Section title="Por qué es necesario ANTES de la segmentación" color={ORANGE}>
        <Frase>
          &ldquo;Es necesario antes de la segmentación porque la segmentación intenta separar regiones u objetos significativos. Si la imagen contiene <strong>ruido, artefactos o información irrelevante</strong>, la segmentación puede detectar regiones falsas o perder objetos importantes. El preprocesamiento mejora la fiabilidad del análisis posterior.&rdquo;
        </Frase>
      </Section>

      <Section title="Conexión con autonomía del agente" color={EMERALD}>
        <Info>
          La propiedad que permite al agente decidir <strong>sin intervención humana</strong> cuándo aplicar el preprocesamiento es la <strong>autonomía</strong>: el agente percibe el estado de la imagen (nivel de ruido, contraste) y decide aplicar las operaciones necesarias según sus objetivos.
        </Info>
      </Section>

      <Section title="Palabras clave obligatorias" color={BLUE}>
        <BadgeList badges={['preprocesamiento', 'ruido', 'contraste', 'región de interés', 'segmentación', 'fiabilidad', 'autonomía', 'artefactos', 'normalización de iluminación']} />
      </Section>

      <Section title="Errores frecuentes" color={RED}>
        <ErrorList items={[
          'Describir el preprocesamiento sin conectarlo con la mejora de la segmentación posterior.',
          'No mencionar la autonomía cuando la pregunta pide la propiedad del agente.',
          'Confundir preprocesamiento con segmentación.',
          'Omitir la normalización de iluminación como operación de preprocesamiento.',
        ]} />
      </Section>

      <Section title="Preguntas del banco relacionadas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            id="smpc-desarrollo-002"
            question="Un agente de visión artificial recibe una imagen con ruido antes de procesarla. Explica qué es el preprocesamiento, por qué es necesario realizarlo antes de la segmentación, y qué propiedad del agente le permite decidir de forma autónoma cuándo aplicarlo."
            answer="El preprocesamiento prepara la imagen antes del análisis aplicando eliminación de ruido, mejora de contraste o extracción de ROI. Es necesario antes de la segmentación porque el ruido puede generar regiones falsas. La propiedad que permite decidirlo sin intervención humana es la autonomía."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 4: Transformada de Fourier ───────────────────────────────────── */

function Block4() {
  return (
    <>
      <NotaExamen>Patrón con más preguntas en el banco (6 preguntas lo mencionan). Siempre aparece como uno de los apartados del examen integrador. Hay que dominar la diferencia filtro paso bajo vs. filtro de muesca.</NotaExamen>

      <Section title="Qué suelen pedir" color={BLUE}>
        <BadgeList badges={[
          'Ventaja del dominio de frecuencia',
          'Qué ocurre al aplicar Fourier',
          'Filtro adecuado para interferencia periódica',
          'Filtro paso bajo vs. filtro de muesca',
          'Por qué Fourier frente al dominio espacial',
        ]} />
      </Section>

      <Section title="Qué aporta la Transformada de Fourier" color={PURPLE}>
        <Table
          heads={['Pregunta', 'Respuesta para el examen']}
          rows={[
            ['¿Qué hace Fourier?', 'Pasa la imagen del dominio espacial (píxeles) al dominio de la frecuencia (componentes frecuenciales).'],
            ['¿Por qué es útil para ruido periódico?', 'Los patrones periódicos aparecen concentrados en componentes frecuenciales concretas, lo que permite localizarlos y eliminarlos de forma selectiva.'],
            ['¿Qué significa "global"?', 'Cada valor de salida en el dominio frecuencial depende de todos los píxeles de entrada. Es una transformación global, no local.'],
            ['¿Qué componentes tiene?', 'La señal se descompone en una componente media o DC y en componentes sinusoidales o armónicos.'],
          ]}
        />
      </Section>

      <Section title="Filtros en el dominio de la frecuencia" color={ORANGE}>
        <Table
          heads={['Filtro', 'Qué hace', '¿Cuándo usar?']}
          rows={[
            ['Filtro de muesca (notch) / rechaza-banda', 'Elimina exactamente las frecuencias del patrón periódico sin afectar el resto de la imagen.', 'Para interferencias periódicas (reflejo, iluminación fluorescente, trama regular).'],
            ['Filtro paso bajo', 'Elimina todas las altas frecuencias → suaviza la imagen.', 'Para ruido aleatorio de alta frecuencia. NO usar para interferencia periódica.'],
            ['Filtro paso alto', 'Elimina bajas frecuencias → realza bordes y detalles.', 'Para realce de contornos.'],
            ['Filtro paso banda', 'Deja pasar solo un rango de frecuencias.', 'Para seleccionar un rango específico de frecuencias relevantes.'],
          ]}
        />
        <Warning>
          <strong>Error crítico:</strong> un filtro paso bajo elimina altas frecuencias de forma <em>general</em> y destruye bordes, textura y detalles. Para una interferencia periódica, el filtro correcto es el <strong>filtro de muesca</strong>, que actúa selectivamente sobre las frecuencias del patrón.
        </Warning>
      </Section>

      <Section title="Plantilla de respuesta — Fourier e interferencia periódica" color={EMERALD}>
        <Frase>
          &ldquo;La ventaja fundamental de trabajar en el dominio de la frecuencia es que los <strong>patrones periódicos</strong> aparecen concentrados en componentes frecuenciales concretas. Esto permite localizarlos y eliminarlos de forma <strong>selectiva</strong>, sin modificar de manera indiscriminada todos los píxeles de la imagen.

Al aplicar la Transformada de Fourier, la imagen deja de representarse directamente por intensidades espaciales y pasa a representarse como <strong>componentes de frecuencia</strong>. Cada valor de salida depende de todos los píxeles de entrada (transformación global). La señal se descompone en una componente media o DC y en <strong>armónicos</strong>.

Para eliminar exclusivamente el patrón periódico, el filtro adecuado es un <strong>filtro de muesca o rechaza-banda</strong> centrado en las frecuencias concretas del patrón, de modo que se elimina la interferencia sin destruir bordes, textura o detalles útiles de la imagen.&rdquo;
        </Frase>
      </Section>

      <Section title="Palabras clave obligatorias" color={BLUE}>
        <BadgeList badges={['Transformada de Fourier', 'dominio de la frecuencia', 'dominio espacial', 'patrón periódico', 'componentes frecuenciales', 'selectivo', 'filtro de muesca', 'rechaza-banda', 'componente DC', 'armónicos', 'global']} />
      </Section>

      <Section title="Errores frecuentes" color={RED}>
        <ErrorList items={[
          'Proponer un filtro paso bajo para una interferencia periódica (el paso bajo suaviza y destruye detalles).',
          'No explicar que Fourier cambia la representación de espacial a frecuencial.',
          'No mencionar que los patrones periódicos se concentran en frecuencias concretas (es la clave de la ventaja).',
          'No justificar por qué el filtro de muesca es más adecuado que el paso bajo.',
          'Confundir "dominio espacial" con "dominio de la frecuencia".',
        ]} />
      </Section>

      <Section title="Preguntas del banco relacionadas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            id="smpc-desarrollo-003"
            question="Las imágenes presentan un patrón periódico de interferencia por el reflejo del sol. ¿Qué ventaja ofrece el dominio de la frecuencia frente a trabajar sobre los píxeles? ¿Qué ocurre con los datos al aplicar la Transformada de Fourier? (Parque solar)"
            answer="Ventaja: los patrones periódicos se concentran en componentes frecuenciales concretas, permitiendo su eliminación selectiva. Al aplicar Fourier: la imagen pasa de dominio espacial (píxeles) a dominio frecuencial; cada valor de salida depende de todos los píxeles de entrada (global); se descompone en componente DC y armónicos."
          />
          <QA
            id="smpc-desarrollo-005"
            question="Se propone aplicar directamente un filtro paso bajo para limpiar una interferencia periódica. ¿Quién tiene razón: el que lo propone o el que lo discute? ¿Qué filtro sería más adecuado?"
            answer="Tiene razón quien lo discute. Un filtro paso bajo elimina altas frecuencias de forma general y destruye bordes, textura y detalles necesarios para detectar defectos. Para interferencia periódica el filtro adecuado es un filtro de muesca (notch) o rechaza-banda centrado en las frecuencias del patrón, que lo elimina sin afectar el resto de la imagen."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 5: Segmentación de imágenes ──────────────────────────────────── */

function Block5() {
  return (
    <>
      <NotaExamen>Aparece en 6 preguntas del banco. Los dos puntos más preguntados: (1) criterios + tres categorías de técnicas, y (2) umbralización + limitación de iluminación no uniforme.</NotaExamen>

      <Section title="Qué suelen pedir" color={BLUE}>
        <BadgeList badges={[
          'Criterios de segmentación',
          'Tres categorías de técnicas',
          'Umbralización en escala de grises',
          'Limitación ante iluminación no uniforme',
          'Alternativas a la umbralización',
          'Coordinación de agentes por zonas',
        ]} />
      </Section>

      <Section title="Criterios de segmentación" color={PURPLE}>
        <Info>
          Los algoritmos de segmentación buscan regiones significativas basándose en dos criterios:
        </Info>
        <Table
          heads={['Criterio', 'Qué significa']}
          rows={[
            ['Homogeneidad interna', 'Los píxeles de una región comparten propiedades similares (color, textura, nivel de gris).'],
            ['Contraste con regiones vecinas', 'La región se diferencia claramente de su entorno o frontera.'],
          ]}
        />
      </Section>

      <Section title="Las tres categorías de técnicas de segmentación" color={ORANGE}>
        <Table
          heads={['Categoría', 'Cómo funciona', 'Ejemplo']}
          rows={[
            ['Crecimiento y contracción de regiones', 'Agrupa o reduce regiones conectadas en el dominio espacial según similitud de propiedades.', 'Crecimiento de semillas desde píxeles iniciales.'],
            ['Métodos de agrupamiento (clustering)', 'Agrupa píxeles según características en espacios n-dimensionales.', 'K-means sobre intensidades o colores.'],
            ['Detección de bordes o contornos', 'Localiza discontinuidades o cambios bruscos para delimitar objetos.', 'Operadores Sobel, Canny.'],
          ]}
        />
      </Section>

      <Section title="Umbralización — La técnica más preguntada" color={EMERALD}>
        <Frase>
          &ldquo;La segmentación por umbralización consiste en comparar la <strong>intensidad de cada píxel</strong> con un valor umbral. Los píxeles que superan el umbral se asignan al primer plano (blanco) y los que no lo superan al fondo (negro). El resultado es una <strong>imagen binaria</strong>.&rdquo;
        </Frase>
        <Table
          heads={['', 'Umbralización simple', 'Umbralización adaptativa / local']}
          rows={[
            ['Umbral', 'Único valor global para toda la imagen.', 'Varía según la zona o vecindad de cada píxel.'],
            ['Funciona bien si...', 'La iluminación es uniforme y el objeto contrasta claramente con el fondo.', 'La iluminación no es uniforme o la imagen tiene zonas con diferentes niveles de brillo.'],
            ['Limitación', 'Si la iluminación no es uniforme, el mismo umbral puede clasificar mal píxeles de zonas distintas.', 'Mayor coste computacional.'],
          ]}
        />
        <Warning>
          Si la pregunta menciona <strong>iluminación no uniforme</strong>, hay que indicar que la umbralización simple falla y proponer la <strong>umbralización adaptativa</strong> u otras alternativas (segmentación por regiones, clustering, bordes).
        </Warning>
      </Section>

      <Section title="Coordinación de agentes para compensar limitaciones" color={BLUE}>
        <Info>
          Una solución multiagente ante la iluminación no uniforme: <strong>Contract Net</strong>. Un agente gestor anuncia las zonas de la imagen como tareas (CFP), los agentes especializados ofrecen procesar cada zona (PROPOSE), el gestor acepta (ACCEPT_PROPOSAL) y cada agente aplica su propio umbral local adaptado a su zona.
        </Info>
      </Section>

      <Section title="Palabras clave obligatorias" color={BLUE}>
        <BadgeList badges={['segmentación', 'umbralización', 'umbral', 'imagen binaria', 'homogeneidad interna', 'contraste', 'crecimiento de regiones', 'clustering', 'detección de bordes', 'iluminación no uniforme', 'umbralización adaptativa', 'Contract Net']} />
      </Section>

      <Section title="Errores frecuentes" color={RED}>
        <ErrorList items={[
          'No mencionar los dos criterios (homogeneidad + contraste).',
          'Describir solo una o dos categorías de técnicas cuando la pregunta pide tres.',
          'No mencionar la limitación de umbralización ante iluminación no uniforme.',
          'No proponer alternativa cuando la umbralización simple falla.',
          'Confundir umbralización (binaria, global) con segmentación por regiones.',
        ]} />
      </Section>

      <Section title="Preguntas del banco relacionadas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            id="smpc-desarrollo-006"
            question="Tras eliminar la interferencia, el sistema aplica segmentación para aislar las zonas sucias. Explica qué criterios siguen los algoritmos de segmentación para encontrar regiones, y nombra y describe brevemente las tres categorías principales de técnicas. (Parque solar)"
            answer="Criterios: homogeneidad interna (píxeles de la región comparten propiedades) y contraste con regiones vecinas. Tres categorías: (1) crecimiento/contracción de regiones — agrupa regiones conectadas en dominio espacial; (2) clustering — agrupa píxeles según características n-dimensionales; (3) detección de bordes — localiza discontinuidades para delimitar objetos."
          />
          <QA
            id="smpc-desarrollo-007"
            question="En un sistema multiagente de análisis de imágenes médicas, varios agentes colaboran para segmentar células. Explica la umbralización, su limitación ante iluminación no uniforme, y cómo la coordinación de agentes compensaría esa limitación."
            answer="La umbralización compara la intensidad de cada píxel con un umbral → imagen binaria. Limitación: un umbral fijo falla si la iluminación no es uniforme (misma célula con intensidades diferentes por zona). Solución: Contract Net — agente gestor anuncia zonas, agentes especializados asumen cada zona y aplican umbral local adaptado."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 6: Pipeline completo de visión artificial ────────────────────── */

function Block6() {
  return (
    <>
      <NotaExamen>El pipeline completo (5-6 etapas) y la diferencia visión humana vs. visión por computador aparecen en 5 preguntas del banco. Casi siempre es Pregunta 2 del examen integrador.</NotaExamen>

      <Section title="Qué suelen pedir" color={BLUE}>
        <BadgeList badges={[
          'Visión humana vs. visión por computador',
          'Etapas del pipeline',
          'Qué se consigue en cada etapa',
          'Detección de bordes / operadores gradiente',
          'Aplicar el pipeline a un caso concreto',
        ]} />
      </Section>

      <Section title="Visión humana vs. visión por computador" color={PURPLE}>
        <Table
          heads={['', 'Visión humana', 'Visión por computador']}
          rows={[
            ['Destinatario de la imagen procesada', 'Una persona que la interpreta.', 'La máquina, que extrae información y toma decisiones automáticas.'],
            ['Objetivo', 'Facilitar la visualización o comprensión humana.', 'Automatizar la detección, clasificación o decisión.'],
            ['Ejemplo', 'Aplicaciones de mejora de imagen para diagnóstico asistido por médico.', 'Sistema que detecta objetos abandonados y genera alerta sin intervención humana.'],
          ]}
        />
        <Rule label="Clave para identificar el tipo">
          {`Si el sistema genera una alerta o toma una decisión SIN que una persona analice la imagen → visión por computador.
Si la imagen se procesa para que sea MÁS FÁCIL de ver o entender por un médico/operario → visión humana.`}
        </Rule>
      </Section>

      <Section title="Pipeline de análisis de imágenes — 6 etapas" color={ORANGE}>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li><strong style={{ color: 'var(--text)' }}>Adquisición / captura</strong> — Obtener la imagen digital desde la cámara o sensor.</li>
          <li><strong style={{ color: 'var(--text)' }}>Preprocesamiento</strong> — Reducir ruido, normalizar iluminación, mejorar contraste, extraer ROI.</li>
          <li><strong style={{ color: 'var(--text)' }}>Segmentación</strong> — Separar la imagen en regiones u objetos significativos (aislar candidatos).</li>
          <li><strong style={{ color: 'var(--text)' }}>Extracción de características</strong> — Calcular propiedades de los objetos segmentados: forma, tamaño, textura, color, contorno, permanencia temporal…</li>
          <li><strong style={{ color: 'var(--text)' }}>Clasificación / reconocimiento de patrones</strong> — Decidir a qué categoría pertenece el objeto (defecto, tumor, objeto abandonado, placa sucia…).</li>
          <li><strong style={{ color: 'var(--text)' }}>Decisión / actuación</strong> — Generar una alerta, enviar una orden, activar un mecanismo.</li>
        </ol>
        <Info style={{ marginTop: 8 }}>
          <strong>En examen, la mayoría de preguntas piden solo las etapas 2, 3, 4 y 5</strong> (preprocesamiento, segmentación, extracción de características y clasificación). Describirlas siempre en orden y aplicarlas al escenario concreto.
        </Info>
      </Section>

      <Section title="Detección de daños / defectos — Operadores de borde" color={EMERALD}>
        <Info>
          Para detectar defectos superficiales o daños en objetos ya segmentados se usan <strong>operadores de detección de bordes o gradiente</strong> (Sobel, Prewitt, Laplaciano). Su fundamento matemático: los bordes y grietas se corresponden con <strong>variaciones fuertes de intensidad</strong>, detectables mediante derivadas o aproximaciones discretas del gradiente.
        </Info>
      </Section>

      <Section title="Plantilla general — Pipeline" color={BLUE}>
        <Frase>
          &ldquo;El sistema seguiría un <strong>pipeline de análisis de imágenes</strong>: (1) <strong>Adquisición</strong> de la imagen mediante la cámara. (2) <strong>Preprocesamiento</strong>: reducción de ruido, normalización de iluminación y mejora de contraste para preparar la imagen. (3) <strong>Segmentación</strong>: separación del objeto de interés respecto al fondo. (4) <strong>Extracción de características</strong>: forma, tamaño, textura, contorno o permanencia del objeto. (5) <strong>Clasificación</strong>: decisión sobre si el objeto corresponde a la categoría buscada. (6) <strong>Actuación</strong>: generación de alerta o envío de orden.

Se corresponde con una aplicación de <strong>visión por computador</strong> porque la máquina analiza automáticamente las imágenes y toma decisiones sin que una persona examine cada fotograma.&rdquo;
        </Frase>
      </Section>

      <Section title="Palabras clave obligatorias" color={BLUE}>
        <BadgeList badges={['pipeline', 'adquisición', 'preprocesamiento', 'segmentación', 'extracción de características', 'clasificación', 'visión por computador', 'visión humana', 'operador de borde', 'gradiente', 'Sobel']} />
      </Section>

      <Section title="Errores frecuentes" color={RED}>
        <ErrorList items={[
          'Mezclar visión humana con visión por computador (recordar: si decide la máquina → visión por computador).',
          'Omitir la extracción de características: sin ella, la clasificación no puede hacerse.',
          'No aplicar las etapas al escenario concreto del enunciado.',
          'Confundir segmentación (separar objeto) con clasificación (decidir qué es el objeto).',
          'No mencionar el operador de borde cuando la pregunta pide cómo detectar daños o defectos.',
        ]} />
      </Section>

      <Section title="Preguntas del banco relacionadas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            id="smpc-desarrollo-008"
            question="Sistema de videovigilancia para detectar objetos abandonados. (1) ¿Visión humana o por computador? (2) Describe las 3 etapas del pipeline. (3) Ventaja de trabajar en dominio de la frecuencia para filtrar ruido."
            answer="(1) Visión por computador: la máquina detecta y alerta sin intervención humana. (2) Preprocesamiento (reducir ruido, normalizar) → Segmentación (aislar objetos sobre el pavimento) → Extracción de características + clasificación (forma, tamaño, permanencia → decidir si es abandonado). (3) Fourier permite identificar componentes periódicas del ruido (lluvia, vibración) y eliminarlas selectivamente."
          />
          <QA
            id="smpc-desarrollo-015"
            question="Sistema de inspección de paquetes en cinta transportadora. (1) Etapas de preprocesamiento. (2) Técnica de segmentación para separar paquete del fondo. (3) Cómo detectar daños una vez segmentado."
            answer="(1) Conversión a escala de grises, reducción de ruido, normalización de iluminación, mejora de contraste. (2) Umbralización si hay contraste claro paquete-fondo; alternativamente detección de bordes o crecimiento de regiones. Condición: homogeneidad interna y contraste suficiente. (3) Operadores de borde/gradiente (Sobel, Prewitt, Laplaciano): detectan variaciones bruscas de intensidad que corresponden a grietas o defectos."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 7: Integración SMA + visión artificial ───────────────────────── */

function Block7() {
  return (
    <>
      <NotaExamen>Aparece en smpc-desarrollo-009 (pregunta standalone) y de forma transversal en smpc-desarrollo-004 (SMA vs. centralizado) y smpc-desarrollo-007 (Contract Net).</NotaExamen>

      <Section title="Qué suelen pedir" color={BLUE}>
        <BadgeList badges={[
          'Cómo se complementan SMA y visión artificial',
          'Ventajas de la combinación',
          'SMA vs. sistema centralizado',
          'Papel del agente coordinador',
          'Ciclo percibir-razonar-actuar',
        ]} />
      </Section>

      <Section title="Qué aporta cada tecnología" color={PURPLE}>
        <Table
          heads={['Tecnología', 'Qué aporta', 'Rol en el sistema']}
          rows={[
            ['Visión artificial', 'Percepción del entorno: adquirir, preprocesar, segmentar, extraer características, clasificar.', 'Proporciona información estructurada a partir de imágenes.'],
            ['Sistemas multiagente', 'Razonamiento distribuido, coordinación y actuación: varios agentes autónomos interpretan resultados, se reparten tareas y deciden acciones.', 'Procesa la información, decide y actúa.'],
          ]}
        />
        <Frase>
          &ldquo;La combinación permite construir sistemas que <strong>perciben, razonan y actúan</strong> (ciclo percibir-razonar-actuar). La visión artificial proporciona la percepción; el sistema multiagente proporciona el razonamiento y la actuación.&rdquo;
        </Frase>
      </Section>

      <Section title="Ventajas de combinar SMA + visión artificial" color={ORANGE}>
        <Table
          heads={['Ventaja', 'Por qué']}
          rows={[
            ['Distribución del trabajo', 'Varios agentes procesan cámaras o zonas de imagen en paralelo.'],
            ['Escalabilidad', 'Se añaden nuevos agentes sin rediseñar el sistema centralizado.'],
            ['Robustez', 'Si un agente falla, los demás continúan funcionando (sin punto único de fallo).'],
            ['Tiempo real', 'Comunicación asíncrona de JADE: un agente envía resultados sin bloquear su hilo de control.'],
            ['Modularidad', 'Cada agente es responsable de una tarea específica (adquisición, filtrado, clasificación, decisión).'],
          ]}
        />
      </Section>

      <Section title="SMA vs. sistema centralizado" color={EMERALD}>
        <Table
          heads={['', 'Sistema centralizado', 'Sistema multiagente']}
          rows={[
            ['Control', 'Un único proceso gestiona todo.', 'Varios agentes con hilo de control propio.'],
            ['Escalabilidad', 'Difícil: el cuello de botella es el nodo central.', 'Alta: se añaden agentes sin afectar al resto.'],
            ['Robustez', 'Punto único de fallo.', 'Si un agente falla, el sistema sigue funcionando.'],
            ['Tiempo real', 'Puede bloquearse procesando una tarea larga.', 'Comunicación asíncrona; un agente no bloquea a los demás.'],
          ]}
        />
      </Section>

      <Section title="Plantilla de respuesta — Integración" color={BLUE}>
        <Frase>
          &ldquo;La <strong>visión artificial</strong> aporta la capacidad de percepción: adquirir imágenes, preprocesarlas, segmentarlas, extraer características y clasificar patrones para obtener información útil del entorno. Los <strong>sistemas multiagente</strong> aportan la capacidad de razonamiento distribuido, coordinación y actuación: varios agentes autónomos pueden interpretar los resultados, repartirse tareas y decidir acciones.

La combinación permite implementar el ciclo <strong>percibir → razonar → actuar</strong>. Sus ventajas son la distribución del trabajo, la escalabilidad, la robustez ante fallos, la comunicación asíncrona y la capacidad de responder en tiempo real, por ejemplo procesando varias cámaras simultáneamente.&rdquo;
        </Frase>
      </Section>

      <Section title="Palabras clave obligatorias" color={BLUE}>
        <BadgeList badges={['percibir-razonar-actuar', 'distribuido', 'coordinación', 'escalabilidad', 'robustez', 'tiempo real', 'comunicación asíncrona', 'hilo de control', 'punto único de fallo', 'modularidad']} />
      </Section>

      <Section title="Errores frecuentes" color={RED}>
        <ErrorList items={[
          'No mencionar ventajas concretas del SMA frente a un sistema centralizado.',
          'Olvidar la comunicación asíncrona como ventaja para tiempo real.',
          'No mencionar el ciclo percibir-razonar-actuar.',
          'Hablar de ventajas genéricas sin aplicarlas al escenario del enunciado.',
          'Omitir la robustez (ausencia de punto único de fallo) como diferencia respecto al centralizado.',
        ]} />
      </Section>

      <Section title="Preguntas del banco relacionadas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            id="smpc-desarrollo-009"
            question="La visión artificial y los sistemas multiagente son dos tecnologías que, combinadas, permiten construir sistemas autónomos capaces de percibir, razonar y actuar. Explica cómo se complementan ambas tecnologías y qué ventajas aporta su combinación."
            answer="Visión artificial → percepción (adquirir, preprocesar, segmentar, extraer, clasificar). SMA → razonamiento distribuido, coordinación y actuación. Combinación: ciclo percibir-razonar-actuar. Ventajas: distribución del trabajo, escalabilidad, robustez ante fallos, comunicación asíncrona, tiempo real. Ejemplos: vigilancia urbana, control de calidad, parques solares, análisis médico."
          />
          <QA
            id="smpc-desarrollo-004"
            question="Un agente de procesamiento filtra ruido periódico con Fourier y envía resultados a otros agentes. ¿Por qué un sistema multiagente es más adecuado que uno centralizado para gestionar este proceso en tiempo real?"
            answer="El SMA reparte el trabajo entre varios agentes con su propio hilo de control. La comunicación asíncrona permite enviar resultados sin bloquearse esperando respuesta. Esto mejora la escalabilidad, la robustez y permite procesar varias cámaras o zonas simultáneamente, algo imposible en un sistema centralizado con un único cuello de botella."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Componente principal ──────────────────────────────────────────────── */

export default function SmpcExamPrep() {
  return (
    <section className="te-prep" aria-label="Preparación examen SMPC">

      {/* Cabecera */}
      <div className="te-prep-header">
        <div className="te-prep-icon" style={{
          background: `linear-gradient(180deg, #ffffff, rgba(79,124,172,0.1))`,
          border: `1px solid rgba(79,124,172,0.22)`,
        }} aria-hidden="true">🤖</div>
        <div>
          <div className="te-prep-title">Preparación examen SMPC</div>
          <div className="te-prep-subtitle">
            7 patrones de desarrollo · 15 preguntas analizadas · Respuestas modelo incluidas
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="te-prep-stats">
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Estructura examen</div>
          <div className="te-prep-stat-value">10 test + 1 desarrollo (3 apt.)</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Desarrollo</div>
          <div className="te-prep-stat-value accent">6 pts (2 pts × 3 apt.)</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Patrón dominante</div>
          <div className="te-prep-stat-value">Fourier + Pipeline + Segmentación</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Caso más recurrente</div>
          <div className="te-prep-stat-value">Parque solar · Hospital · Videovigilancia</div>
        </div>
      </div>

      {/* Acordeones */}
      <div className="ptg-list">

        <AccordionBlock
          id="resumen"
          icon="🗺️"
          title="Resumen rápido y cómo responder"
          subtitle="Estructura del examen · Guía de 5 pasos · Preguntas agrupadas por patrón · Casos recurrentes"
        >
          <Block0 />
        </AccordionBlock>

        <AccordionBlock
          id="jade"
          icon="🤝"
          title="Patrón 1 — JADE y comportamientos"
          subtitle="CyclicBehaviour · OneShotBehaviour · Performativas ACL · REQUEST vs INFORM"
        >
          <Block1 />
        </AccordionBlock>

        <AccordionBlock
          id="bdi"
          icon="🧠"
          title="Patrón 2 — Agentes, autonomía y arquitectura BDI"
          subtitle="AID · Reactivo vs Proactivo vs BDI · Creencias / Deseos / Intenciones · Autonomía"
        >
          <Block2 />
        </AccordionBlock>

        <AccordionBlock
          id="preprocesamiento"
          icon="🖼️"
          title="Patrón 3 — Preprocesamiento de imágenes"
          subtitle="Qué es · Por qué antes de segmentar · Operaciones típicas · Autonomía del agente"
        >
          <Block3 />
        </AccordionBlock>

        <AccordionBlock
          id="fourier"
          icon="📡"
          title="Patrón 4 — Transformada de Fourier"
          subtitle="Dominio frecuencial · Interferencia periódica · Filtro de muesca vs. paso bajo"
        >
          <Block4 />
        </AccordionBlock>

        <AccordionBlock
          id="segmentacion"
          icon="🔲"
          title="Patrón 5 — Segmentación de imágenes"
          subtitle="Criterios · Tres categorías · Umbralización · Iluminación no uniforme · Contract Net"
        >
          <Block5 />
        </AccordionBlock>

        <AccordionBlock
          id="pipeline"
          icon="🏭"
          title="Patrón 6 — Pipeline completo de visión artificial"
          subtitle="Visión humana vs. computador · 6 etapas · Detección de bordes · Casos reales"
        >
          <Block6 />
        </AccordionBlock>

        <AccordionBlock
          id="integracion"
          icon="🌐"
          title="Patrón 7 — Integración SMA + visión artificial"
          subtitle="Percibir-razonar-actuar · SMA vs. centralizado · Escalabilidad · Robustez · Tiempo real"
        >
          <Block7 />
        </AccordionBlock>

      </div>
    </section>
  );
}
