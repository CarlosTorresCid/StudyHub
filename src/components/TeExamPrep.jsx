import './TeExamPrep.css';

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function AccordionBlock({ id, icon, title, subtitle, children }) {
  return (
    <details id={`te-prep-${id}`} className="ptg-item">
      <summary className="ptg-summary">
        <span className="ptg-summary-icon" aria-hidden="true">{icon}</span>
        <span className="ptg-summary-main">
          <span className="ptg-summary-title">{title}</span>
          {subtitle && <span className="ptg-summary-sub">{subtitle}</span>}
        </span>
        <span className="ptg-summary-marker" aria-hidden="true">▾</span>
      </summary>
      <div className="ptg-body">
        {children}
      </div>
    </details>
  );
}

function Section({ title, color, children }) {
  return (
    <div className="ptg-section" style={{ borderLeftColor: color || 'var(--accent)' }}>
      {title && (
        <div className="ptg-section-title" style={{ color: color || 'var(--accent)' }}>
          {title}
        </div>
      )}
      {children}
    </div>
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
            <tr key={i}>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Warning({ children }) {
  return (
    <div className="te-prep-warning">
      <span className="te-prep-warning-icon">⚠️</span>
      <span>{children}</span>
    </div>
  );
}

function BoxBlue({ children }) {
  return <div className="te-prep-box-blue">{children}</div>;
}

function BoxAmber({ children }) {
  return <div className="te-prep-box-amber">{children}</div>;
}

function BoxGreen({ children }) {
  return <div className="te-prep-box-green">{children}</div>;
}

function Checklist({ items }) {
  return (
    <ul className="te-prep-checklist">
      {items.map((item, i) => (
        <li key={i}><span className="te-prep-check">✓</span>{item}</li>
      ))}
    </ul>
  );
}

function Para({ children }) {
  return (
    <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>
      {children}
    </p>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{
      margin: '6px 0', paddingLeft: 20, fontSize: 13,
      color: 'var(--text-muted)', lineHeight: 1.75,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function SubTitle({ children }) {
  return <div className="te-prep-subsec-title">{children}</div>;
}

function Gap() {
  return <div style={{ height: 10 }} />;
}

/* ── Sección 0 — ¿Qué es el ejercicio? ────────────────────────────────────── */

function Sec0() {
  return (
    <>
      <Para>
        El examen de Tecnologías Emergentes incluye un caso práctico con un escenario ficticio (personajes de
        animación, deportistas, guerreros espaciales…) que esconde siempre la misma estructura técnica: diseñar
        una solución tecnológica IoT y/o de localización para monitorizar personas o dispositivos. Las respuestas
        se puntúan sobre los apartados que exige el enunciado.
      </Para>
      <BoxBlue>
        <strong>Patrón dominante detectado en todos los modelos de examen (2023–2026):</strong>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18, lineHeight: 1.75, fontSize: 13 }}>
          <li>→ IoT + wearables + datos biométricos → 6 de 10 preguntas</li>
          <li>→ LBS + flota/personal + app móvil → 4 de 10 preguntas</li>
          <li>El escenario cambia; los conceptos técnicos son siempre los mismos.</li>
        </ul>
      </BoxBlue>
      <Gap />
      <Section title="Apartados que suele pedir el enunciado" color="#3b82f6">
        <Table
          heads={['Apartado', 'Qué evalúa el corrector']}
          rows={[
            [<strong>Dispositivos necesarios</strong>, 'Identifica el hardware correcto para el entorno (wearable, tracker GPS, beacon, gateway…)'],
            [<strong>Tecnologías de comunicación</strong>, 'Justifica BLE, WiFi, GNSS, LPWAN según entorno y necesidad (no vale poner cualquiera)'],
            [<strong>Tipo de aplicación y justificación</strong>, 'Nativa / híbrida / webapp con razón concreta (acceso a sensores, offline, coste…)'],
            [<strong>Funcionalidades</strong>, 'Lista de lo que hace la app y los dispositivos, coherente con el escenario'],
            [<strong>Funcionamiento general</strong>, 'Flujo completo: sensor → gateway → servidor → usuario; incluye comunicación autónoma'],
            [<strong>Limitaciones / problemas</strong>, 'Muestra pensamiento crítico; siempre hay al menos batería, privacidad y entorno'],
          ]}
        />
      </Section>
    </>
  );
}

/* ── Sección 1 — Árbol de decisión ────────────────────────────────────────── */

function Sec1() {
  return (
    <>
      <Para>
        Antes de escribir una sola línea de respuesta, lee el enunciado y responde estas preguntas en orden.
        Cada respuesta te dirige al bloque de teoría correcto.
      </Para>

      <Section title="Pregunta 1 — ¿Cuál es el entorno físico?" color="#f59e0b">
        <BoxAmber>
          <strong>Esta es la primera bifurcación. Condiciona TODO lo demás:</strong> qué sensores funcionan,
          qué protocolos de comunicación son viables y qué limitaciones existen.
        </BoxAmber>
        <Gap />
        <Table
          heads={['Entorno', 'Implicaciones inmediatas para la respuesta']}
          rows={[
            [<strong>EXTERIOR abierto (campo, desierto, ciudad)</strong>, 'GNSS funciona. Usar GPS + Galileo. Comunicación 4G/LTE-M. Sin limitaciones especiales.'],
            [<strong>INTERIOR (restaurante, castillo, nave)</strong>, 'GNSS no llega. Usar beacons BLE (iBeacon o Eddystone) para localización por proximidad. Comunicación WiFi o BLE al gateway.'],
            [<strong>MIXTO (interior + exterior)</strong>, 'GNSS en exterior + beacons BLE en interior. Comunicación LTE-M cuando no hay WiFi. Es el caso más frecuente.'],
            [<strong>BAJO EL AGUA (acuático, submarino)</strong>, 'BLE, WiFi y GNSS no funcionan bajo el agua. Almacenamiento local (data logger flash). Sincronización al emerger vía BLE. Certificación IP68 obligatoria.'],
            [<strong>ESPACIO / entorno sin infraestructura</strong>, 'Sin red celular. Almacenamiento local + LoRa o similar cuando hay cobertura. Batería crítica. Temperaturas extremas.'],
          ]}
        />
      </Section>

      <Section title="Pregunta 2 — ¿Qué se monitoriza?" color="#10b981">
        <BoxGreen>
          El enunciado puede pedir monitorizar <strong>PERSONAS</strong> (datos biométricos + posición)
          o <strong>DISPOSITIVOS/VEHÍCULOS</strong> (posición + telemetría) o <strong>AMBOS</strong>.
          Esto determina los sensores y el tipo de LBS.
        </BoxGreen>
        <Gap />
        <Table
          heads={['Qué se monitoriza', 'Sensores y datos implicados']}
          rows={[
            [<strong>Datos biométricos</strong>, 'FC (frecuencia cardíaca) por PPG, SpO2, temperatura corporal, acelerómetro, giroscopio. → Wearable ligero (pulsera o reloj).'],
            [<strong>Posición de personas</strong>, 'GNSS en exterior (receptor GPS+Galileo). Beacons BLE en interior. A-GPS para reducir TTFF.'],
            [<strong>Posición de vehículos / flotas</strong>, 'Tracker GPS embarcado (OBD o cableado). Transmisión autónoma por 4G o LTE-M.'],
            [<strong>Actividad física sin GPS</strong>, 'Acelerómetro triaxial + giroscopio. Estima distancia, pasos, intensidad. Útil bajo el agua o en interiores.'],
            [<strong>Amenazas / entorno</strong>, 'Sensores acústicos, de vibración, cámaras CCTV inteligentes. Comunicación NB-IoT o WiFi.'],
          ]}
        />
      </Section>

      <Section title="Pregunta 3 — ¿Qué tipo de LBS necesita el caso?" color="#3b82f6">
        <BoxBlue>
          Cada pregunta de examen combina LBS orientado a personas y/o a dispositivos, reactivo y/o proactivo.
          Identificarlos correctamente demuestra que dominas la teoría del Tema 3.
        </BoxBlue>
        <Gap />
        <Table
          heads={['Tipo de LBS', 'Definición del temario + señal en el enunciado']}
          rows={[
            [<strong>Orientado a personas</strong>, 'El propósito es determinar la ubicación de una persona o usarla para ofrecerle un servicio. La persona DEBE controlar cuándo comparte su posición. → Señal: vigilante, guerrera, atleta, superhéroe.'],
            [<strong>Orientado a dispositivos</strong>, 'El propósito es localizar un dispositivo o vehículo de forma autónoma. → Señal: flota de vehículos, naves, trackers, carsharing.'],
            [<strong>Reactivo (Pull)</strong>, 'El usuario invoca el servicio activamente. La interacción es siempre explícita. → Señal: "el usuario consulta", "busca", "solicita".'],
            [<strong>Proactivo (Push)</strong>, 'Se activa automáticamente ante un evento de localización predefinido. Interacción asíncrona. → Señal: "notifica automáticamente", "envía al más cercano", "alerta cuando se aleja de la zona".'],
          ]}
        />
      </Section>

      <Section title="Pregunta 4 — ¿Qué tecnología de comunicación corresponde?" color="#f59e0b">
        <BoxAmber>
          La selección del protocolo <strong>SIEMPRE necesita justificación.</strong> No vale decir "WiFi"
          o "Bluetooth" sin explicar por qué. La justificación es la mitad del punto.
        </BoxAmber>
        <Gap />
        <Table
          heads={['Protocolo', 'Cuándo usarlo (según teoría Tema 6)']}
          rows={[
            [<strong>BLE 5.0</strong>, 'Corto alcance (hasta 60 m), muy bajo consumo. → Entre el wearable y el gateway. En interiores. Beacons. Pulseras.'],
            [<strong>WiFi (IEEE 802.11ac)</strong>, 'Medio alcance, alto ancho de banda. → Gateway → servidor en instalaciones con red local. Ideal en interiores con infraestructura.'],
            [<strong>4G / LTE</strong>, 'Alto ancho de banda, consumo medio-alto. → Cuando se necesita transmisión de video o datos grandes en exterior con cobertura.'],
            [<strong>LTE-M (LPWAN estándar)</strong>, 'Bajo consumo, largo alcance, bajo ancho de banda. → Dispositivos IoT en movilidad (trackers de vehículos, wearables en exterior sin WiFi). Estándar 3GPP sobre infraestructura LTE.'],
            [<strong>NB-IoT (LPWAN estándar)</strong>, 'Consumo mínimo, largo alcance, muy bajo ancho de banda. → Sensores fijos que envían datos pequeños esporádicamente (sensores de ciudad, alarmas).'],
            [<strong>LoRa (LPWAN propietaria)</strong>, 'Consumo mínimo, largo alcance, muy bajo ancho de banda. → Entornos sin infraestructura celular (rural, espacio, desierto remoto). Propietaria de Semtech.'],
            [<strong>Sigfox (LPWAN propietaria)</strong>, 'Similar a LoRa. → Alternativa cuando la red Sigfox tiene cobertura en la zona.'],
            [<strong>Almacenamiento local (flash)</strong>, 'No es un protocolo: es la solución cuando NO hay comunicación posible (bajo el agua, sin cobertura). Los datos se sincronizan al recuperar conectividad.'],
          ]}
        />
        <Gap />
        <BoxGreen>
          <strong>REGLA CLAVE del temario:</strong> Las tecnologías LPWAN tienen ancho de banda muy reducido
          (medido en Kbps) pero son ideales para IoT por su bajo consumo y largo alcance.{' '}
          LTE-M y NB-IoT son estándares (3GPP). LoRa y Sigfox son propietarias.
        </BoxGreen>
      </Section>

      <Section title="Pregunta 5 — ¿Qué tipo de aplicación se elige y por qué?" color="#ef4444">
        <Warning>
          Este apartado es obligatorio en las preguntas mixtas (IoT + LBS + App). La respuesta SIEMPRE
          debe justificar la elección con criterios concretos. Memoriza los argumentos de cada tipo.
        </Warning>
        <Gap />
        <Table
          heads={['Tipo de app', 'Cuándo elegirla (argumentos del temario)']}
          rows={[
            [<strong>Nativa</strong>, 'Cuando se necesita: acceso completo a TODOS los sensores (GPS, cámara, BLE), máximo rendimiento, funcionalidad offline completa, seguridad máxima. Desventaja: dos desarrollos separados (iOS + Android), mayor coste.'],
            [<strong>Híbrida</strong>, 'Cuando se necesita: acceso al GPS y sensores básicos mediante plugins, funcionalidad offline, UN SOLO equipo de desarrollo para ambas plataformas. Equilibrio entre coste y rendimiento. Frameworks: Flutter, React Native. Desventaja: velocidad menor que nativa, UX algo inferior.'],
            [<strong>Web App (webapp)</strong>, 'Cuando la app es informativa o transaccional sin necesidad de GPS nativo ni funcionamiento offline. Usa HTML + CSS + JavaScript. Funciona en cualquier navegador. Desventaja: sin acceso pleno al hardware, no funciona offline.'],
          ]}
        />
        <Gap />
        <BoxAmber>
          <strong>ARGUMENTO EXAMEN para elegir:</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18, lineHeight: 1.75, fontSize: 13 }}>
            <li>→ Si el presupuesto es clave y se necesita multiplataforma: <strong>híbrida</strong></li>
            <li>→ Si la seguridad, el rendimiento o el acceso total a hardware son críticos: <strong>nativa</strong></li>
            <li>→ La web app NUNCA es la respuesta correcta cuando hay GPS o funcionamiento offline.</li>
          </ul>
        </BoxAmber>
      </Section>
    </>
  );
}

/* ── Sección 2 — Módulos de respuesta (A-F) ────────────────────────────────── */

function Sec2() {
  return (
    <>
      <Para>
        Una vez que el árbol de decisión ha identificado qué módulos aplican, combina el contenido
        correspondiente y adapta los detalles al escenario concreto del enunciado.
      </Para>

      {/* MÓDULO A */}
      <Section title="MÓDULO A — Wearable biomédico" color="#3b82f6">
        <BoxBlue>
          <strong>Aplica siempre que el enunciado pida monitorizar la actividad física o la salud de personas.</strong>
        </BoxBlue>

        <SubTitle>A.1 — Descripción del dispositivo</SubTitle>
        <Para>
          El dispositivo principal que porta cada persona es un wearable biomédico (pulsera o smartwatch) ligero
          e impermeable con certificación IP68. Integra los siguientes sensores:
        </Para>
        <BulletList items={[
          <><strong>FC por PPG:</strong> mide la frecuencia cardíaca de forma continua y detecta picos anómalos que indican sobresfuerzo o fatiga acumulada.</>,
          <><strong>SpO2:</strong> niveles por debajo del 95 % indican problemas cardiorrespiratorios que requieren intervención.</>,
          <><strong>Temperatura corporal:</strong> detecta golpe de calor, especialmente crítico en entornos de alta temperatura (cocinas, desiertos, combate prolongado).</>,
          <><strong>Acelerómetro triaxial y giroscopio:</strong> cuantifican la actividad física (pasos, distancia, intensidad, cambios de dirección) sin necesidad de GPS.</>,
        ]} />

        <SubTitle>A.2 — Tecnología de comunicación del wearable</SubTitle>
        <Para>
          El wearable se comunica con el gateway local mediante <strong>Bluetooth Low Energy (BLE 5.0)</strong> por su muy
          bajo consumo (autonomía 12-24 h) y alcance suficiente (hasta 60 m en abierto, 20-40 m en interiores). En
          exteriores sin gateway WiFi, usa <strong>LTE-M</strong> directamente: tecnología LPWAN estándar (3GPP) de bajo
          consumo para dispositivos IoT en movilidad.
        </Para>

        <SubTitle>A.3 — Limitaciones del módulo A</SubTitle>
        <BulletList items={[
          'La batería limita la autonomía a 12-24 horas. Se mitiga con carga inalámbrica estándar Qi.',
          'Los datos biométricos son categoría especial según el RGPD: cifrado de extremo a extremo y consentimiento explícito obligatorios.',
          'IP68 garantiza resistencia al sudor y lluvia, pero no a inmersiones prolongadas a gran profundidad.',
        ]} />
      </Section>

      {/* MÓDULO B */}
      <Section title="MÓDULO B — Localización en exteriores (GNSS)" color="#10b981">
        <BoxGreen>
          <strong>Aplica cuando el entorno es exterior y se necesita posición geográfica precisa.</strong>
        </BoxGreen>

        <SubTitle>B.1 — Receptor GNSS</SubTitle>
        <Para>
          Para la localización en exteriores se utiliza un receptor <strong>GNSS multiconstellación (GPS + Galileo)</strong>.
          GPS ofrece cobertura global; Galileo (sistema europeo) ofrece mayor precisión en señal civil. La combinación
          mejora exactitud y disponibilidad. El tracker vehicular envía la posición cada 10-30 segundos de forma
          completamente autónoma, sin intervención del conductor (principio IoT de comunicación automática entre objetos).
        </Para>

        <SubTitle>B.2 — A-GPS para reducir el TTFF</SubTitle>
        <Para>
          Los dispositivos que necesitan primera posición rápida usan <strong>A-GPS</strong> (GPS Asistido): descarga
          previamente las efemérides de los satélites via red, reduciendo el <strong>Time To First Fix (TTFF)</strong> de
          varios minutos a pocos segundos.
        </Para>

        <SubTitle>B.3 — Limitaciones del módulo B</SubTitle>
        <BulletList items={[
          'El GNSS no funciona en interiores: señal atenuada o bloqueada por estructuras. En interiores → Módulo C.',
          'El efecto multicamino (multipath) degrada la precisión en entornos urbanos densos o estadios con tribunas altas.',
          'El consumo del receptor GNSS en modo continuo reduce la autonomía del wearable.',
        ]} />
      </Section>

      {/* MÓDULO C */}
      <Section title="MÓDULO C — Localización en interiores (beacons BLE)" color="#3b82f6">
        <BoxBlue>
          <strong>Aplica cuando el entorno es interior o mixto y se necesita conocer la zona donde se encuentra una persona.</strong>
        </BoxBlue>

        <SubTitle>C.1 — Beacons BLE</SubTitle>
        <Para>
          Para interiores se utilizan <strong>balizas o beacons</strong>: dispositivos de tamaño reducido que emiten
          cíclicamente por BLE una señal con un <strong>ID único</strong> propio de cada baliza. Pila con autonomía de
          hasta 4 años, sin alimentación activa. Dos tipos:
        </Para>
        <BulletList items={[
          <><strong>iBeacon</strong> (Apple, 2013): funciona con iOS y Android. Envía UUID, Major Number (zona/planta) y Minor Number (baliza concreta).</>,
          <><strong>Eddystone</strong> (Google, 2015): funciona con iOS y Android. Más versátil: puede enviar URL, telemetría e información de distancia para apps de navegación interior.</>,
        ]} />

        <SubTitle>C.2 — Cómo funciona la localización por beacons</SubTitle>
        <Para>
          El wearable o smartphone detecta la señal BLE del beacon más cercano y lee su ID. El sistema lo traduce
          a una zona concreta (p.ej. Major=1 → Planta baja, Minor=3 → Sala de cocina). Precisión de zona, no de
          centímetros; suficiente para los casos de uso del examen.
        </Para>

        <SubTitle>C.3 — Gateway WiFi</SubTitle>
        <Para>
          En interiores, el <strong>gateway WiFi</strong> (router o hub conectado a la red local) recibe los datos de
          los wearables vía BLE y los retransmite al servidor central por WiFi (IEEE 802.11ac o superior). El gateway
          actúa como concentrador de la primera capa IoT.
        </Para>
      </Section>

      {/* MÓDULO D */}
      <Section title="MÓDULO D — Entorno acuático / sin comunicación radio" color="#ef4444">
        <Warning>
          Aplica cuando la actividad se desarrolla bajo el agua o en cualquier entorno donde las comunicaciones
          de radio sean inviables.
        </Warning>

        <SubTitle>D.1 — Principio fundamental</SubTitle>
        <Para>
          Las ondas de radio (BLE, WiFi, 4G, GNSS) son absorbidas por el agua a pocos centímetros de profundidad. Solución:
        </Para>
        <BulletList items={[
          'Almacenamiento local: el wearable registra todos los datos en memoria flash interna durante la inmersión.',
          'Sincronización al emerger: cuando la persona sale a la superficie, el wearable transmite automáticamente todos los datos almacenados al gateway (p.ej. boya con BLE). Sincronización autónoma, sin intervención humana.',
        ]} />

        <SubTitle>D.2 — Sensores en entorno acuático</SubTitle>
        <Para>
          Sin comunicación, el wearable usa sensores que no requieren señal externa: acelerómetro triaxial + giroscopio
          (actividad de nado, distancia estimada), FC y SpO2 (almacenamiento local). Certificación <strong>IP68</strong>{' '}
          obligatoria (1,5 m, 30 min). Para profundidades mayores: IP69K o certificación de presión específica.
          Carga mediante inducción Qi (sin conectores expuestos).
        </Para>

        <SubTitle>D.3 — Limitaciones del módulo D</SubTitle>
        <BulletList items={[
          'Monitorización siempre diferida: no hay datos en tiempo real durante la inmersión.',
          'La presión hidrostática en profundidad puede superar la certificación IP68.',
          'La salinidad marina corroe componentes si hay alguna apertura no hermética.',
          'La temperatura fría en profundidad reduce la autonomía de la batería.',
        ]} />
      </Section>

      {/* MÓDULO E */}
      <Section title="MÓDULO E — Arquitectura del sistema IoT (flujo completo)" color="#10b981">
        <BoxGreen>
          <strong>Este bloque describe el "funcionamiento general" que pide casi siempre el enunciado.</strong>
        </BoxGreen>

        <SubTitle>E.1 — Tres capas del sistema IoT</SubTitle>
        <BulletList items={[
          <><strong>Capa 1 — Dispositivos (edge):</strong> sensores y wearables que captan datos del mundo físico. Los objetos IoT tienen dos partes diferenciadas: la parte física (hardware) y los servicios o acciones asociadas. Se comunican de forma autónoma, sin intervención humana.</>,
          <><strong>Capa 2 — Conectividad y gateway:</strong> el gateway (tablet, router, boya, hub) agrega los datos de todos los dispositivos de la capa 1 y los retransmite al servidor. Usa WiFi o 4G/LTE-M según el entorno.</>,
          <><strong>Capa 3 — Backend / servidor central:</strong> recibe, almacena, procesa y analiza todos los datos. Aplica la lógica de detección de anomalías, genera alertas y presenta la información en un dashboard. Puede apoyarse en plataformas como ThingSpeak (canales por dispositivo, campos personalizables, analíticas e informes).</>,
        ]} />

        <SubTitle>E.2 — Tipos de toma de decisiones (teoría Tema 6)</SubTitle>
        <BulletList items={[
          <><strong>Manejo de información:</strong> el objeto gestiona su propia información y la retorna cuando es preguntado.</>,
          <><strong>Notificación:</strong> el objeto notifica situaciones a otros dispositivos o personas ante determinados eventos. No controla su actividad.</>,
          <><strong>Toma de decisiones:</strong> el mayor nivel de inteligencia; el objeto puede autoadministrarse y ejecutar lógica de negocio. Puede ser centralizada (en el servidor) o distribuida (en varios objetos de la red).</>,
        ]} />
        <Gap />
        <Para>
          En los ejercicios de examen, la toma de decisiones suele ser <strong>centralizada en el servidor</strong>.
        </Para>
      </Section>

      {/* MÓDULO F */}
      <Section title="MÓDULO F — Tipo de aplicación móvil (decisión justificada)" color="#f59e0b">
        <BoxAmber>
          En los casos que piden diseñar una app,{' '}
          <strong>la justificación de la elección es la mitad del punto.</strong>
        </BoxAmber>

        <SubTitle>F.1 — App nativa: cuándo y por qué</SubTitle>
        <Para>
          Elegir nativa cuando: acceso completo a TODOS los sensores (GPS, cámara, BLE, acelerómetro); máximo
          rendimiento y mejor UX; funcionamiento offline completo; seguridad crítica con módulos de cifrado
          avanzado. <strong>Desventaja:</strong> dos desarrollos separados (iOS con Swift + Android con Kotlin), mayor coste.
        </Para>

        <SubTitle>F.2 — App híbrida: cuándo y por qué</SubTitle>
        <Para>
          Elegir híbrida cuando: presupuesto limitado y se quiere un único equipo de desarrollo para iOS y Android
          (Flutter, React Native); acceso al GPS y sensores básicos mediante plugins nativos; funcionalidad offline
          necesaria. <strong>Desventaja:</strong> velocidad algo menor que nativa, UX ligeramente inferior.
        </Para>

        <SubTitle>F.3 — App web (webapp): cuándo NO elegirla</SubTitle>
        <Warning>
          Descartar la webapp cuando el enunciado requiere: acceso nativo al GPS (HTML5 Geolocation es limitado
          e impreciso), funcionamiento offline, o acceso a sensores de hardware más allá del básico. En los
          exámenes de TE, <strong>la webapp nunca es la respuesta correcta.</strong>
        </Warning>
      </Section>
    </>
  );
}

/* ── Sección 3 — Mapa rápido: escenario → módulos ─────────────────────────── */

function Sec3() {
  return (
    <>
      <Para>
        Identifica el tipo de pregunta en el enunciado, localiza los módulos correspondientes en la Sección 2
        y combínalos para construir tu respuesta.
      </Para>
      <Table
        heads={['Tipo de pregunta', 'Módulos a combinar']}
        rows={[
          [<strong>IoT + biométrico + exterior</strong>, 'A (wearable) + B (GNSS) + E (arquitectura 3 capas)'],
          [<strong>IoT + biométrico + interior</strong>, 'A (wearable) + C (beacons) + E (arquitectura 3 capas)'],
          [<strong>IoT + biométrico + mixto</strong>, 'A + B (exterior) + C (interior) + E'],
          [<strong>IoT + biométrico + acuático</strong>, 'A + D (almacenamiento local) + E (sincronización diferida)'],
          [<strong>IoT + biométrico + espacio/sin red</strong>, 'A + almacenamiento local + LoRa cuando hay cobertura + E'],
          [<strong>LBS + flotas + app móvil</strong>, 'B (tracker vehicular) + LBS orientado a dispositivos + F (tipo de app)'],
          [<strong>LBS + personas + app móvil</strong>, 'B o C (según entorno) + LBS orientado a personas + F (tipo de app)'],
          [<strong>Mixto IoT + LBS + App</strong>, 'A + B/C + LBS + E + F'],
        ]}
      />
    </>
  );
}

/* ── Sección 4 — Tabla de limitaciones por entorno ───────────────────────── */

function Sec4() {
  return (
    <>
      <Para>
        El apartado de limitaciones siempre suma puntos. Incluye siempre al menos las dos primeras
        (batería y RGPD) más la específica del entorno.
      </Para>
      <Table
        heads={['Limitación', 'Entorno donde aplicar + explicación teórica']}
        rows={[
          [<strong>Batería</strong>, 'TODOS. Los dispositivos IoT dependen de baterías. La autonomía debe cubrir la actividad completa (partido, turno, misión) con margen.'],
          [<strong>Privacidad y RGPD</strong>, 'TODOS. Los datos biométricos y de posición son datos personales (los de salud son categoría especial). Requieren cifrado, consentimiento explícito y acceso restringido.'],
          [<strong>Comunicación inviable bajo el agua</strong>, 'ACUÁTICO. BLE, WiFi y GNSS no funcionan en inmersión. Solución: almacenamiento local + sincronización al emerger.'],
          [<strong>GNSS no funciona en interiores</strong>, 'INTERIOR/MIXTO. La señal de satélite llega atenuada o bloqueada por estructuras. Solución: beacons BLE.'],
          [<strong>Efecto multicamino (multipath)</strong>, 'URBANO / ESTADIOS. Los edificios altos o tribunas reflejan la señal GNSS y degradan la precisión.'],
          [<strong>Interferencias en cocina/entornos industriales</strong>, 'INTERIOR con equipos eléctricos. Microondas y motores interfieren con BLE y WiFi.'],
          [<strong>Cobertura celular limitada</strong>, 'DESIERTO / RURAL / ESPACIO. Sin infraestructura de red, 4G y LTE-M no funcionan. Solución: LoRa o almacenamiento local.'],
          [<strong>Precisión de zona (no de centímetros)</strong>, 'BEACONS. La localización por beacons identifica la zona (sala, planta) pero no la posición exacta.'],
          [<strong>Temperaturas extremas</strong>, 'ESPACIO / EXTERIOR EXTREMO. Afectan a la batería (reduce capacidad) y a la electrónica.'],
          [<strong>Presión hidrostática</strong>, 'ACUÁTICO PROFUNDO. A más de 1,5 m de profundidad, la presión puede superar la certificación IP68.'],
        ]}
      />
    </>
  );
}

/* ── Sección 5 — Plantilla de respuesta completa ─────────────────────────── */

function Sec5() {
  return (
    <>
      <BoxBlue>
        <strong>Tiempo estimado en examen: 30-40 minutos · Extensión: 400-600 palabras · Estructura: apartados numerados.</strong>
        <br />
        Los 6 bloques corresponden a los 6 apartados habituales del enunciado. Adapta cada bloque al escenario concreto.
      </BoxBlue>
      <Gap />

      <Section title="Bloque 1 — Dispositivos necesarios" color="#3b82f6">
        <Para>
          El dispositivo principal que porta cada <em>[persona]</em> es un wearable biomédico (pulsera/smartwatch)
          con certificación IP<em>[68/69K según entorno]</em>, que integra: sensor de FC por PPG, SpO2, temperatura
          corporal, acelerómetro triaxial y giroscopio.
          Añadir GNSS si hay exterior; omitir si es solo interior o acuático.
        </Para>
        <BoxAmber>
          <strong>Si hay vehículos/flotas:</strong> Cada [vehículo/nave] lleva un tracker GNSS vehicular
          (receptor GPS+Galileo + módulo 4G/LTE-M) que envía la posición de forma autónoma al servidor cada 10-30 segundos.
        </BoxAmber>
        <Gap />
        <BoxAmber>
          <strong>Si hay interior:</strong> Se distribuyen beacons BLE tipo [iBeacon/Eddystone] por las distintas
          zonas de [el espacio]. Cada beacon emite un ID único; el Major Number identifica la zona y el Minor Number
          el beacon concreto.
        </BoxAmber>
      </Section>

      <Section title="Bloque 2 — Tecnologías de comunicación" color="#10b981">
        <Para>
          El wearable transmite datos al gateway mediante <strong>Bluetooth Low Energy (BLE 5.0)</strong>, por su muy
          bajo consumo energético y su alcance suficiente en el entorno.
        </Para>
        <BoxAmber>
          <strong>Si exterior o movilidad:</strong> Cuando no hay gateway WiFi disponible, el wearable usa LTE-M
          (tecnología LPWAN estándar 3GPP de bajo consumo diseñada para dispositivos IoT en movilidad) para enviar
          datos directamente al servidor.
        </BoxAmber>
        <Gap />
        <BoxAmber>
          <strong>Si acuático:</strong> Durante la inmersión, las comunicaciones de radio no son posibles —el agua
          absorbe las ondas BLE y WiFi a pocos centímetros—. Los datos se almacenan en memoria flash local y se
          sincronizan automáticamente al emerger.
        </BoxAmber>
        <Gap />
        <Para>El gateway [WiFi/4G] retransmite los datos al servidor central.</Para>
      </Section>

      <Section title="Bloque 3 — Tipo de aplicación y justificación" color="#f59e0b">
        <Para>
          Se propone una aplicación <strong>[nativa/híbrida]</strong> para iOS y Android. La justificación es:
        </Para>
        <BoxAmber>
          <strong>Si nativa:</strong> La app necesita acceso completo a todos los sensores del dispositivo (GPS, BLE,
          acelerómetro). Las apps nativas son las únicas que pueden acceder a prácticamente todo el hardware.
          Además, se requiere funcionamiento offline completo y el máximo rendimiento. Como desventaja, implica dos
          desarrollos separados, lo que eleva el coste respecto a una app híbrida.
        </BoxAmber>
        <Gap />
        <BoxAmber>
          <strong>Si híbrida:</strong> Se elige app híbrida (desarrollada con Flutter) por su equilibrio entre coste
          y funcionalidad. Un único equipo de desarrollo cubre iOS y Android. Los plugins nativos permiten el acceso
          al GPS y sensores necesarios. La app puede funcionar en modo offline —almacenando datos localmente y
          sincronizando al recuperar cobertura—. La velocidad es algo menor que la nativa, pero suficiente para
          este caso de uso.
        </BoxAmber>
      </Section>

      <Section title="Bloque 4 — Funcionalidades" color="#8b5cf6">
        <Para>La solución proporciona las siguientes funcionalidades:</Para>
        <Checklist items={[
          'Monitorización en tiempo real de FC, SpO2, temperatura y actividad física de cada [persona].',
          'Localización en tiempo real: [exterior: posición GPS con actualización cada X segundos] / [interior: zona por proximidad a beacons].',
          'Si hay vehículos: seguimiento de la flota en mapa en tiempo real, con historial de rutas y alertas de zona.',
          'Detección automática de anomalías: si algún parámetro supera el umbral predefinido, el servidor emite una alerta push al responsable.',
          'Dashboard para el coordinador: panel con todos los [personas/vehículos] en mapa, métricas de salud y alertas activas.',
          'Informes históricos: análisis de rendimiento por sesión/turno/misión.',
          'Si LBS proactivo: asignación automática del recurso más cercano al punto de incidencia mediante notificación push asíncrona.',
        ]} />
      </Section>

      <Section title="Bloque 5 — Funcionamiento general" color="#10b981">
        <Para>
          El sistema sigue la arquitectura IoT de tres capas. En la <strong>primera capa</strong>, los wearables de
          cada [persona] captan datos de forma continua. Según el temario, los objetos IoT se comunican de forma
          autónoma, sin intervención humana, enviando y recibiendo información digital. En la <strong>segunda capa</strong>,
          el gateway [WiFi/4G] agrega los datos de todos los dispositivos activos y los reenvía al servidor. En la{' '}
          <strong>tercera capa</strong>, el servidor central (que puede apoyarse en plataformas como ThingSpeak,
          con canales por dispositivo y campos para cada parámetro) procesa los datos, ejecuta la lógica de detección
          de anomalías y presenta la información en el dashboard al coordinador.
        </Para>
        <Para>
          La toma de decisiones es <strong>centralizada en el servidor</strong>: este recibe todos los datos, aplica
          los umbrales de alerta y actúa en consecuencia.
        </Para>
        <BoxAmber>
          <strong>Si hay decisión en el dispositivo:</strong> En situaciones críticas (sin cobertura), el propio
          wearable puede emitir una alerta vibrotáctil local al usuario, alcanzando el mayor nivel de inteligencia
          IoT: la toma de decisiones autónoma en el objeto.
        </BoxAmber>
      </Section>

      <Section title="Bloque 6 — Limitaciones y posibles problemas" color="#ef4444">
        <Para>La solución presenta las siguientes limitaciones a considerar:</Para>
        <BulletList items={[
          <><strong>Batería:</strong> la autonomía de los wearables limita la duración de la monitorización continua. Se mitiga con tecnologías de bajo consumo (BLE, LTE-M) y carga inalámbrica Qi.</>,
          <><strong>RGPD:</strong> los datos biométricos y de posición son datos personales sensibles. Requieren cifrado de extremo a extremo, consentimiento explícito y limitación del acceso al servidor.</>,
          <><strong>Entorno específico:</strong> [acuático: no hay monitorización en tiempo real durante la inmersión] / [interior: la precisión de los beacons es de zona, no de metros] / [sin cobertura: los datos son diferidos hasta sincronización].</>,
          <><strong>Interferencias:</strong> [si cocina/entorno industrial: los equipos eléctricos pueden interferir con BLE y WiFi] / [si GNSS en estadio: el efecto multicamino degrada la precisión].</>,
        ]} />
      </Section>
    </>
  );
}

/* ── Sección 6 — Errores frecuentes ──────────────────────────────────────── */

function Sec6() {
  const trampas = [
    ['TRAMPA 1', 'Poner GNSS en interiores.', 'El GNSS no llega a interiores. Siempre usar beacons BLE en interiores.'],
    ['TRAMPA 2', 'Poner BLE para comunicación de largo alcance o fuera del edificio.', 'BLE es de corto alcance (max 60 m). Para exterior o movilidad: LTE-M o 4G.'],
    ['TRAMPA 3', 'Poner WiFi como única opción de comunicación en exteriores.', 'WiFi requiere infraestructura local. En exteriores sin red local: 4G o LTE-M.'],
    ['TRAMPA 4', 'Elegir webapp cuando el enunciado pide acceso al GPS u offline.', 'La webapp no accede plenamente al hardware ni funciona sin conexión. → Nativa o híbrida.'],
    ['TRAMPA 5', 'Decir que el IoT funciona con intervención humana.', 'Los objetos IoT se comunican de forma AUTÓNOMA, sin intervención de personas. Usar esa frase exacta.'],
    ['TRAMPA 6', 'No mencionar limitaciones.', 'Batería, RGPD y la limitación específica del entorno son puntos seguros. Siempre incluirlas.'],
    ['TRAMPA 7', 'Confundir LTE-M con 4G estándar.', 'LTE-M es una variante LPWAN del 4G diseñada para IoT: bajo consumo, menor ancho de banda. El 4G estándar tiene alto consumo y no es LPWAN.'],
    ['TRAMPA 8', 'Olvidar que LoRa es propietaria y NB-IoT / LTE-M son estándares.', 'LoRa y Sigfox = propietarias. NB-IoT y LTE-M = estándares 3GPP. El examen lo pregunta.'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {trampas.map(([label, title, desc], i) => (
        <div key={i} className="te-prep-warning" style={{ flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span className="te-prep-warning-icon">🚫</span>
            <div>
              <span style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: '#b91c1c', marginRight: 8,
              }}>{label}:</span>
              <strong style={{ fontSize: 13 }}>{title}</strong>
            </div>
          </div>
          <div style={{ paddingLeft: 30, fontSize: 12.5, color: 'var(--text-muted)' }}>
            → {desc}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Sección 7 — Glosario ─────────────────────────────────────────────────── */

function Sec7() {
  return (
    <Table
      heads={['Término', 'Definición del temario (a usar textualmente en el examen)']}
      rows={[
        [<strong>LBS</strong>, 'Servicios que integran la ubicación (geográfica, de red o conceptual) de un dispositivo móvil con otra información de contexto relevante, proporcionando al usuario un valor añadido.'],
        [<strong>LBS proactivo (Push)</strong>, 'Se inicializa automáticamente siempre que se produce un evento de localización predefinido. La interacción es asíncrona y no prevista de antemano por el usuario.'],
        [<strong>LBS reactivo (Pull)</strong>, 'El servicio es siempre activado explícitamente por el usuario. La interacción entre el usuario y el servicio es siempre del mismo tipo.'],
        [<strong>LBS orientado a personas</strong>, 'La persona objeto de la localización es quien siempre debe controlar el servicio y decidir explícitamente cuándo se obtiene y usa la información de su ubicación.'],
        [<strong>LBS orientado a dispositivos</strong>, 'El propósito principal es localizar dispositivos o vehículos de forma autónoma, sin intervención del propietario (p.ej. gestión de flotas, carsharing).'],
        [<strong>Beacons / balizas</strong>, 'Dispositivos de tamaño reducido que usan BLE para transmitir cíclicamente una señal con un ID único. Pila con autonomía de hasta 4 años. Dos tipos: iBeacon (Apple) y Eddystone (Google).'],
        [<strong>IoT (Internet de las Cosas)</strong>, 'Sistema donde los objetos físicos, que disponen de una parte digital, se comunican con otros sistemas de forma autónoma, sin intervención humana.'],
        [<strong>LPWAN</strong>, 'Low Power Wide Area Network. Tecnologías de comunicación de bajo consumo y largo alcance para IoT. Estándares: LTE-M, NB-IoT. Propietarias: LoRa, Sigfox.'],
        [<strong>BLE (Bluetooth Low Energy)</strong>, 'Estándar Bluetooth orientado a muy bajo consumo. Versión 5.0. Alcance hasta 60 m. Usado en wearables, beacons y comunicación dispositivo-gateway en interiores.'],
        [<strong>GNSS</strong>, 'Global Navigation Satellite System. Sistemas de navegación global por satélite. GPS (EE.UU.), Galileo (UE), GLONASS (Rusia), BeiDou (China).'],
        [<strong>TTFF</strong>, 'Time To First Fix. Tiempo que tarda un receptor GNSS en calcular la primera posición. Se reduce con A-GPS (GPS asistido por red).'],
        [<strong>Toma de decisiones IoT</strong>, 'El mayor nivel de inteligencia de un objeto IoT: el objeto puede autoadministrarse y ejecutar lógica de negocio. Puede ser centralizada (en servidor) o distribuida (en varios objetos).'],
        [<strong>IP68</strong>, 'Certificación de resistencia a la inmersión en agua (1,5 m durante 30 min según IEC 60529). Obligatoria para wearables en entornos acuáticos o de sudoración intensa.'],
      ]}
    />
  );
}

/* ── Componente principal ─────────────────────────────────────────────────── */

export default function TeExamPrep() {
  return (
    <section className="te-prep" aria-label="Manual de respuesta — Ejercicio de desarrollo TE">

      <div className="te-prep-header">
        <div className="te-prep-icon" aria-hidden="true">📖</div>
        <div>
          <div className="te-prep-title">Manual de Respuesta — Desarrollo TE</div>
          <div className="te-prep-subtitle">
            Ejercicio de desarrollo · Prof. Pablo Gargallo · Convocatoria 2026
          </div>
        </div>
      </div>

      <div className="te-prep-stats">
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Secciones del manual</div>
          <div className="te-prep-stat-value">0 a 7</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Módulos reutilizables</div>
          <div className="te-prep-stat-value accent">A – F (6)</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Entornos analizados</div>
          <div className="te-prep-stat-value">5 tipos</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Tiempo en examen</div>
          <div className="te-prep-stat-value">30-40 min</div>
        </div>
      </div>

      <div className="ptg-list">

        <AccordionBlock
          id="sec0"
          icon="📝"
          title="0 — ¿Qué es el ejercicio de desarrollo?"
          subtitle="Patrón dominante · Estructura del enunciado · Qué evalúa el corrector"
        >
          <Sec0 />
        </AccordionBlock>

        <AccordionBlock
          id="sec1"
          icon="🌳"
          title="1 — Árbol de decisión: de lo general a lo concreto"
          subtitle="5 preguntas clave · Entorno · Monitorización · LBS · Comunicación · App"
        >
          <Sec1 />
        </AccordionBlock>

        <AccordionBlock
          id="sec2"
          icon="🧩"
          title="2 — Módulos de respuesta reutilizables (A-F)"
          subtitle="Módulo A: Wearable · B: GNSS · C: Beacons · D: Acuático · E: Arquitectura · F: App"
        >
          <Sec2 />
        </AccordionBlock>

        <AccordionBlock
          id="sec3"
          icon="🗺️"
          title="3 — Mapa rápido: escenario → módulos"
          subtitle="Tabla de combinaciones por tipo de pregunta"
        >
          <Sec3 />
        </AccordionBlock>

        <AccordionBlock
          id="sec4"
          icon="⚠️"
          title="4 — Tabla de limitaciones por entorno"
          subtitle="Batería · RGPD · Acuático · Interior · Multicamino · Temperatura · Presión"
        >
          <Sec4 />
        </AccordionBlock>

        <AccordionBlock
          id="sec5"
          icon="📋"
          title="5 — Plantilla de respuesta completa"
          subtitle="6 bloques · 400-600 palabras · 30-40 minutos"
        >
          <Sec5 />
        </AccordionBlock>

        <AccordionBlock
          id="sec6"
          icon="🚫"
          title="6 — Errores frecuentes a evitar"
          subtitle="8 trampas habituales con su corrección"
        >
          <Sec6 />
        </AccordionBlock>

        <AccordionBlock
          id="sec7"
          icon="📖"
          title="7 — Glosario de términos del examen"
          subtitle="13 definiciones a usar textualmente · LBS · IoT · GNSS · LPWAN · BLE · IP68"
        >
          <Sec7 />
        </AccordionBlock>

      </div>

      <div style={{ marginTop: 20 }}>
        <BoxBlue>
          <strong>RESUMEN EJECUTIVO — Los 4 pasos del examen:</strong>
          <ol style={{ margin: '8px 0 0', paddingLeft: 22, lineHeight: 1.85, fontSize: 13 }}>
            <li>
              <strong>PASO 1 —</strong> Lee el enunciado y responde el árbol de decisión (Sección 1):
              ¿Entorno exterior, interior, mixto, acuático o sin red? · ¿Monitorizo personas (biométrico),
              vehículos o ambos? · ¿Qué tipo de LBS pide? · ¿Qué tecnología de comunicación corresponde?
              · ¿Qué tipo de app?
            </li>
            <li>
              <strong>PASO 2 —</strong> Combina los módulos (Sección 2):
              A (wearable) + B (GNSS) + C (beacons) + D (acuático) + E (arquitectura) + F (app).
            </li>
            <li>
              <strong>PASO 3 —</strong> Redacta con la plantilla (Sección 5).
              Los 6 bloques = los 6 apartados del enunciado.
            </li>
            <li>
              <strong>PASO 4 —</strong> Incluye siempre: batería + RGPD + limitación específica del entorno.
            </li>
          </ol>
        </BoxBlue>
      </div>

    </section>
  );
}
