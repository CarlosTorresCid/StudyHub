import './TeExamPrep.css';

const GREEN = '#2E8B57';
const BLUE = '#3b82f6';
const PURPLE = '#8b5cf6';
const RED = '#ef4444';
const ORANGE = '#E07B39';
const EMERALD = '#10b981';

/* ── Helpers ───────────────────────────────────────────────────────────── */

function AccordionBlock({ id, icon, title, subtitle, children }) {
  return (
    <details id={`casi-prep-${id}`} className="ptg-item">
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
  const c = color || GREEN;
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
      borderLeftColor: GREEN,
      background: 'linear-gradient(180deg, rgba(46,139,87,0.07), rgba(46,139,87,0.03))',
      border: '1px solid rgba(46,139,87,0.22)',
      borderLeft: `4px solid ${GREEN}`,
    }}>
      <div className="te-prep-rule-label" style={{ color: '#1a6640' }}>{label}</div>
      <div className="te-prep-rule-text">{children}</div>
    </div>
  );
}

function QA({ question, answer }) {
  return (
    <div className="te-prep-qa">
      <div className="te-prep-qa-q">❓ {question}</div>
      <div className="te-prep-qa-a">{answer}</div>
    </div>
  );
}

function NotaProfesor({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 15px',
      fontSize: 13, color: 'var(--text)', lineHeight: 1.65,
      background: 'linear-gradient(180deg, rgba(46,139,87,0.08), rgba(46,139,87,0.03))',
      border: '1px solid rgba(46,139,87,0.18)',
      borderLeft: `4px solid ${GREEN}`,
      borderRadius: '0 13px 13px 0',
      marginBottom: 8,
    }}>
      <span style={{ flexShrink: 0, fontSize: 16 }}>⭐</span>
      <span>{children}</span>
    </div>
  );
}

function NoEntra({ items }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 15px',
      fontSize: 13, color: 'var(--text)', lineHeight: 1.65,
      background: 'linear-gradient(180deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))',
      border: '1px solid rgba(239,68,68,0.15)',
      borderLeft: '4px solid #ef4444',
      borderRadius: '0 13px 13px 0',
    }}>
      <span style={{ flexShrink: 0, fontSize: 16 }}>⛔</span>
      <span><strong>NO entra en el examen:</strong> {items.join(' · ')}</span>
    </div>
  );
}

/* ── Block 0: Esquema general ──────────────────────────────────────────── */

function BlockEsquema() {
  const bloques = [
    {
      label: 'Bloque 1 — Fundamentos',
      color: BLUE,
      bg: 'rgba(59,130,246,0.05)',
      border: 'rgba(59,130,246,0.2)',
      temas: [
        'T1: SGSI — Tríada CID, Reglas de Oro, activos, tipos de ataque',
        'T2: Planificación — Políticas, gestión del riesgo (amenaza/vulnerabilidad/activo), RGPD, LOPD, LSSICE, MDM',
      ],
    },
    {
      label: 'Bloque 2 — Protección de activos',
      color: PURPLE,
      bg: 'rgba(139,92,246,0.05)',
      border: 'rgba(139,92,246,0.2)',
      temas: [
        'T3: Mecanismos físicos y lógicos — Criptografía (simétrica/asimétrica/hash/firma digital), backups, control de acceso (DAC/MAC/RBAC), alta disponibilidad',
        'T4: Redes y comunicaciones — Modelo OSI/TCP-IP, cortafuegos (4 modelos), WiFi (WEP/WPA/WPA3), IDS/IPS, DMZ, MDM',
      ],
    },
    {
      label: 'Bloque 3 — Controles internos',
      color: ORANGE,
      bg: 'rgba(224,123,57,0.05)',
      border: 'rgba(224,123,57,0.2)',
      temas: [
        'T5: Controles de seguridad — Doble clasificación (nivel operativo: administrativo/técnico/físico · tipo de respuesta: preventivo/detectivo/correctivo/disuasorio)',
      ],
    },
    {
      label: 'Bloque 4 — Auditoría',
      color: EMERALD,
      bg: 'rgba(16,185,129,0.05)',
      border: 'rgba(16,185,129,0.2)',
      temas: [
        'T6: Tipos de auditoría — Interna vs. externa, tipos por objetivo, control interno vs. auditoría, ENS, obligatoriedad',
        'T7: Técnicas de recolección — Fingerprinting/footprinting (activo/pasivo), OSINT, pen testing, análisis de vulnerabilidades',
        'T8: Vulnerabilidades — XSS (reflejado/persistente), CSRF, inyección SQL, fuzzing, PTES, SAST/DAST',
        'T9: Proceso de auditoría — SDLC, herramientas CAT, evidencias, análisis forense, cadena de custodia, cuantitativo/cualitativo',
        'T10: Continuidad de negocio — BCP vs. DRP, BIA, RTO/RPO/MTPD, centros de respaldo (frío/templado/caliente)',
      ],
    },
    {
      label: 'Bloque 5 — Marco legal y gobernanza',
      color: GREEN,
      bg: 'rgba(46,139,87,0.05)',
      border: 'rgba(46,139,87,0.2)',
      temas: [
        'T11: Marco legal — Delitos informáticos, RGPD, LOPDGDD, LSSICE, análisis forense, principio de Locard, criterio de Daubert',
        'T12: Gobernanza y certificaciones — Gobernanza TIC vs. gestión TIC, ISO 38.500, CISA/CISSP, ISACA, estándares',
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {bloques.map((b) => (
        <div key={b.label} style={{
          padding: '12px 15px',
          borderRadius: 13,
          border: `1px solid ${b.border}`,
          borderLeft: `4px solid ${b.color}`,
          background: `linear-gradient(180deg, ${b.bg}, transparent)`,
        }}>
          <div style={{ fontWeight: 800, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.07em', color: b.color, marginBottom: 7 }}>
            {b.label}
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.8 }}>
            {b.temas.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── Block 1: T1 — SGSI ────────────────────────────────────────────────── */

function Block1() {
  return (
    <>
      <NotaProfesor>El profesor confirmó que <strong>SGSI, Tríada CID y Reglas de Oro</strong> entran seguro en el examen.</NotaProfesor>

      <Section title="Tríada CID — Los tres pilares de seguridad" color={BLUE}>
        <Table
          heads={['Principio', 'Significado']}
          rows={[
            ['Confidencialidad', 'La información solo es accesible para quienes están autorizados.'],
            ['Integridad', 'La información no ha sido modificada por partes no autorizadas.'],
            ['Disponibilidad', 'La información está accesible cuando se necesita.'],
          ]}
        />
      </Section>

      <Section title="Reglas de Oro — Las tres «aes»" color={PURPLE}>
        <Table
          heads={['Regla', 'Significado', 'Mecanismo']}
          rows={[
            ['Autenticación', 'Verificar quién eres.', 'Contraseña, MFA, certificado'],
            ['Autorización', 'Verificar qué puedes hacer.', 'Permisos, roles, ACL'],
            ['Auditabilidad', 'Registrar qué has hecho.', 'Ficheros de log'],
          ]}
        />
        <Warning>
          Trampa frecuente: la opción <strong>"autenticación y autorización"</strong> es incompleta porque falta la <strong>auditabilidad</strong>. Los tres elementos son inseparables.
        </Warning>
      </Section>

      <Section title="Relación tipos de ataque ↔ Tríada CID" color={ORANGE}>
        <Table
          heads={['Tipo de ataque', 'Principio vulnerado']}
          rows={[
            ['Interceptación', 'Confidencialidad'],
            ['Interrupción', 'Disponibilidad'],
            ['Modificación', 'Integridad'],
            ['Generación / inyección', 'Integridad (+ Autenticidad)'],
          ]}
        />
      </Section>

      <Section title="Conceptos clave" color={EMERALD}>
        <Checklist items={[
          'Un SGSI son procesos, no productos. El antivirus y el firewall son recursos del SGSI, no el SGSI en sí.',
          'Los activos no son solo bases de datos o equipos: las personas también son activos.',
          'ISO vigente: 27001:2022 (la versión 2013 está derogada — el PDF del temario está desactualizado).',
          '"La seguridad es un proceso, no un producto." (Bruce Schneier)',
        ]} />
      </Section>

      <NoEntra items={['Magerit']} />
    </>
  );
}

/* ── Block 2: T2 — Planificación de la seguridad ──────────────────────── */

function Block2() {
  return (
    <>
      <NotaProfesor>Probable en el examen: <strong>triángulo del riesgo, principio de mínimo privilegio, análisis cuantitativo y MDM</strong>.</NotaProfesor>

      <Section title="Triángulo del riesgo" color={BLUE}>
        <Info>
          Para que exista riesgo deben concurrir los tres: <strong>activo</strong> (algo con valor) + <strong>amenaza</strong> (agente externo que no podemos controlar) + <strong>vulnerabilidad</strong> (debilidad interna que sí podemos controlar). Si falta cualquiera de los tres, <strong>no hay riesgo</strong>.
        </Info>
      </Section>

      <Section title="Principio de mínimo privilegio" color={PURPLE}>
        <Frase>
          &ldquo;Cada usuario o componente debe tener acceso <strong>solo a los recursos estrictamente necesarios</strong> para su función.&rdquo;
        </Frase>
        <Info style={{ marginTop: 8 }}>El profesor lo señaló expresamente como posible <strong>pregunta de desarrollo</strong>.</Info>
      </Section>

      <Section title="Orden de pasos ISO 27001 (a efectos de examen)" color={ORANGE}>
        <Warning>
          En el examen, seguir la norma: <strong>alcance primero, política después</strong>. El profesor aclaró que en la práctica real es al revés, pero para el examen manda la norma.
        </Warning>
      </Section>

      <Section title="Análisis cuantitativo de riesgos" color={EMERALD}>
        <Rule label="Fórmulas">
          {`SLE = Valor del activo × Factor de exposición
ALE = SLE × ARO (tasa anual de ocurrencia)
→ Si coste contramedida < ALE, la contramedida es rentable.`}
        </Rule>
        <Info style={{ marginTop: 8 }}>El profesor advirtió que si caen cálculos, serán sencillos.</Info>
      </Section>

      <Section title="MDM — Mobile Device Management" color={BLUE}>
        <NotaProfesor>El profesor lo señaló textualmente como «pregunta de examen». Aparece en T2 y en T4.</NotaProfesor>
        <Checklist items={[
          'Instalar y desinstalar aplicaciones de forma remota.',
          'Bloquear el dispositivo a distancia.',
          'Localizar el dispositivo.',
          'Realizar borrado remoto (wipe) del dispositivo.',
        ]} />
      </Section>

      <Section title="Marco normativo" color={PURPLE}>
        <Table
          heads={['Norma', 'Clave para el examen']}
          rows={[
            ['RGPD (Reg. UE 2016/679)', 'Norma fundamental. Prevalece sobre legislación nacional. Vigente desde mayo de 2016 (no 2018, ese fue el fin del periodo de adaptación).'],
            ['LOPDGDD (LO 3/2018)', 'Adapta el RGPD en España. Fija en 14 años la edad mínima de consentimiento digital.'],
            ['LSSICE', 'Se aplica a todos los negocios que usen medios TIC para su actividad o promoción.'],
          ]}
        />
        <Info style={{ marginTop: 8 }}>
          <strong>Sanciones RGPD:</strong> infracciones graves → hasta 10M€ o 2% facturación.
          Infracciones muy graves → hasta <strong>20M€ o 4%</strong> de la facturación global (lo que sea mayor).
          Los delitos informáticos están en el <strong>Código Penal</strong>, no en la LOPD.
        </Info>
      </Section>

      <NoEntra items={[
        'Tablas de niveles de protección de la LOPD 15/1999 derogada (págs. 18-19 del temario)',
        'Reglamento de IA (AIAT)',
        'Directiva NIS-2',
      ]} />
    </>
  );
}

/* ── Block 3: T3 — Protección de activos I (mecanismos) ───────────────── */

function Block3() {
  return (
    <>
      <NotaProfesor>El profesor dijo textualmente: «<strong>Firma digital, importante, PREGUNTA DE EXAMEN.</strong>»</NotaProfesor>

      <Section title="Firma digital — proceso paso a paso" color={BLUE}>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li>El emisor calcula el <strong style={{ color: 'var(--text)' }}>hash</strong> del mensaje.</li>
          <li>Cifra ese hash con su <strong style={{ color: 'var(--text)' }}>clave privada</strong> → eso es la firma digital.</li>
          <li>El receptor descifra la firma con la <strong style={{ color: 'var(--text)' }}>clave pública del emisor</strong>.</li>
          <li>Compara el hash obtenido con el hash calculado del mensaje recibido.</li>
        </ol>
        <Table
          heads={['Qué garantiza', 'Por qué']}
          rows={[
            ['Integridad', 'El hash detecta cualquier modificación en el mensaje.'],
            ['Autenticidad y no repudio', 'Solo el propietario de la clave privada pudo firmar.'],
          ]}
        />
      </Section>

      <Section title="Criptografía" color={PURPLE}>
        <Table
          heads={['Tipo', 'Características', 'Uso principal']}
          rows={[
            ['Simétrica', 'Misma clave para cifrar y descifrar. Más rápida. Problema: distribución de la clave.', 'Cifrar grandes volúmenes de datos'],
            ['Asimétrica', 'Par de claves pública/privada. Más lenta.', 'Intercambio de claves, firma digital'],
            ['Hash', 'Función unidireccional y resistente a colisiones. No reversible.', 'Verificar integridad, contraseñas'],
          ]}
        />
        <Warning>
          <strong>Computación cuántica:</strong> vulnerable el cifrado asimétrico (RSA). AES y funciones hash (SHA-2/3) <strong>NO son vulnerables</strong>.
        </Warning>
      </Section>

      <Section title="Alta disponibilidad de servidores" color={ORANGE}>
        <NotaProfesor>Señalado como pregunta de examen.</NotaProfesor>
        <Table
          heads={['Modo', 'Descripción', 'Arranque']}
          rows={[
            ['Cold standby (frío)', 'Servidor secundario apagado. Arranca manualmente cuando falla el principal.', 'Manual, lento'],
            ['Hot standby (caliente)', 'Servidor secundario activo en paralelo. Asume la carga automáticamente.', 'Automático, rápido'],
            ['Balanceo de carga (cluster)', 'Varios servidores activos que distribuyen la carga.', 'Continuo — el cluster real'],
          ]}
        />
        <Info>El profesor aclaró que el cluster real es el balanceo de carga, no los otros dos.</Info>
      </Section>

      <Section title="Backups" color={EMERALD}>
        <Table
          heads={['Tipo', 'Qué guarda', 'Para restaurar']}
          rows={[
            ['Incremental', 'Solo cambios desde el último backup (de cualquier tipo).', 'Más cintas, más lento'],
            ['Diferencial', 'Cambios desde el último backup completo.', 'Dos conjuntos: completo + diferencial'],
            ['Completo (total)', 'Todo el sistema.', 'Más sencillo · ideal para offsite (almacenamiento externo)'],
          ]}
        />
      </Section>

      <Section title="Modelos de control de acceso" color={BLUE}>
        <NotaProfesor>Señalado como posible pregunta de examen.</NotaProfesor>
        <Table
          heads={['Modelo', 'Significado', 'Quién gestiona permisos']}
          rows={[
            ['DAC (Discretionary)', 'Control discrecional.', 'El propietario del recurso.'],
            ['MAC (Mandatory)', 'Control obligatorio basado en etiquetas de seguridad.', 'El sistema — el usuario no puede cambiarlo.'],
            ['RBAC (Role-Based)', 'Los permisos se asignan a roles (cargos/funciones), no a usuarios individuales.', 'El administrador del sistema.'],
          ]}
        />
      </Section>

      <NoEntra items={['Integridad de bases de datos (ACID)', 'Control de versiones de software']} />
    </>
  );
}

/* ── Block 4: T4 — Redes y comunicaciones ──────────────────────────────── */

function Block4() {
  return (
    <>
      <NotaProfesor>El profesor dijo: «<strong>El número de capas y cuáles son en los dos modelos hay que saberse. Esto es básico.</strong>»</NotaProfesor>

      <Section title="Modelos OSI y TCP/IP" color={BLUE}>
        <Table
          heads={['Capa OSI (nº)', 'Nombre', 'Relevancia para el examen']}
          rows={[
            ['7', 'Aplicación', 'Nivel de los WAF y proxies.'],
            ['6', 'Presentación', 'Cifrado y compresión — importante.'],
            ['5', 'Sesión', '—'],
            ['4', 'Transporte', 'Cortafuegos stateful.'],
            ['3', 'Red', 'Cortafuegos de filtrado de paquetes.'],
            ['2', 'Enlace de datos', '—'],
            ['1', 'Física', '—'],
          ]}
        />
        <Info>
          <strong>TCP/IP — 4 capas:</strong> Acceso a la red · Internet · Transporte · Aplicación.
        </Info>
      </Section>

      <Section title="Cuatro modelos de cortafuegos" color={PURPLE}>
        <Info>El temario clasifica en 4 modelos (otros libros usan 3 — en el examen se usa esta clasificación).</Info>
        <Table
          heads={['Modelo', 'Capa OSI', 'Cómo funciona', 'Para quién']}
          rows={[
            ['Filtrado de paquetes', 'Capa 3', 'Inspecciona cabeceras IP (IP de origen/destino, puerto, protocolo).', 'Empresas pequeñas con bajo riesgo — el más económico.'],
            ['Inspección de estado (stateful)', 'Capas 3-4', 'Mantiene tabla dinámica de conexiones; recuerda el estado de cada sesión.', 'Uso general.'],
            ['Proxy de aplicación (proxy gateway)', 'Capa 7', 'Actúa como intermediario completo. Mayor seguridad pero más latencia.', 'Entornos de alta seguridad.'],
            ['Screened host / Screened subnet', 'Múltiple', 'Combina router de filtrado con host bastión (DMZ).', 'Arquitecturas con zona desmilitarizada.'],
          ]}
        />
        <Info>
          <strong>WAF</strong> (Web Application Firewall): tipo de proxy en capa 7. Previene XSS, inyección SQL y CSRF.
        </Info>
      </Section>

      <Section title="Protocolos WiFi" color={ORANGE}>
        <Table
          heads={['Protocolo', 'Estado', 'Nota de examen']}
          rows={[
            ['WEP', 'Completamente obsoleto e inseguro.', 'Puede aparecer en el examen aunque ya no se use.'],
            ['WPA', 'Mejoró la seguridad respecto a WEP.', '—'],
            ['WPA2', 'Más seguro que WPA.', '—'],
            ['WPA3', 'El más seguro actualmente.', '—'],
          ]}
        />
      </Section>

      <Section title="IDS vs IPS" color={EMERALD}>
        <Table
          heads={['Sistema', 'Qué hace', 'Tipo de control', 'Variantes']}
          rows={[
            ['IDS (Intrusion Detection System)', 'Detecta y alerta. No bloquea.', 'Detectivo', 'HIDS (monitoriza un host) · NIDS (monitoriza red)'],
            ['IPS (Intrusion Prevention System)', 'Detecta y bloquea activamente.', 'Preventivo + Detectivo', '—'],
          ]}
        />
      </Section>

      <Section title="Preguntas de desarrollo señaladas" color={BLUE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            question="¿Qué controles debe comprobar un auditor si la empresa tiene teletrabajo?"
            answer="VPN (túnel cifrado hacia la red corporativa) + MFA (segundo factor de autenticación) + MDM (gestión y control de dispositivos remotos) + política de contraseñas robusta. El auditor verificará que estos cuatro elementos están implementados y actualizados."
          />
          <QA
            question="Describe los 4 modelos de cortafuegos y recomienda uno para una empresa pequeña con bajo riesgo."
            answer="→ Filtrado de paquetes: capa 3, inspecciona cabeceras IP, más sencillo y económico. → Stateful: capa 3-4, mantiene tabla de conexiones. → Proxy de aplicación: capa 7, máxima seguridad. → Screened subnet: combina router + bastión (DMZ). Recomendación para empresa pequeña con bajo riesgo: filtrado de paquetes, por su coste reducido y facilidad de gestión."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 5: T5 — Controles internos del SGSI ─────────────────────────── */

function Block5() {
  return (
    <>
      <NotaProfesor>El profesor dijo: «<strong>Importante, muy, muy importante: la clasificación de los controles.</strong>» Hay que saber clasificar cualquier control en ambas dimensiones.</NotaProfesor>

      <Section title="Dimensión 1 — Por nivel operativo" color={BLUE}>
        <Table
          heads={['Tipo', 'Qué protege / incluye', 'Ejemplos']}
          rows={[
            ['Administrativo', 'Políticas, procedimientos, formación, concienciación.', 'Política de contraseñas, separación de funciones, rotación de tareas, mínimo privilegio.'],
            ['Técnico / lógico', 'Hardware y software de seguridad.', 'Cortafuegos, IDS, cifrado, ACL. ATENCIÓN: el hardware de seguridad es control técnico, no físico.'],
            ['Físico', 'Protege equipos e instalaciones.', 'Cámaras, barreras, control de acceso físico. Las cuatro normas: evitar, retrasar, detectar, defender.'],
          ]}
        />
        <Warning>
          Trampa frecuente: se puede pensar que el <strong>hardware</strong> es un control «físico» — en realidad, el hardware de seguridad (como un dispositivo cortafuegos o un HSM) es un control <strong>técnico</strong>.
        </Warning>
      </Section>

      <Section title="Dimensión 2 — Por cómo abordan la amenaza" color={PURPLE}>
        <Table
          heads={['Tipo', 'Cuándo actúa', 'Ejemplo']}
          rows={[
            ['Preventivo', 'Antes del incidente — reduce la probabilidad de que ocurra.', 'Cortafuegos, formación en seguridad.'],
            ['Detectivo', 'Durante o después — identifica incidentes en curso o pasados.', 'IDS, logs, cámaras de vigilancia.'],
            ['Correctivo', 'Después — reduce el impacto una vez ocurrido el incidente.', 'Backups, antivirus que elimina malware, DRP.'],
            ['Disuasorio', 'Antes — hace desistir al atacante antes de actuar.', 'Carteles de «zona videovigilada», advertencias legales.'],
          ]}
        />
      </Section>

      <Section title="Ejercicio de clasificación dual" color={ORANGE}>
        <Table
          heads={['Control', 'Nivel operativo', 'Tipo de respuesta']}
          rows={[
            ['Cortafuegos', 'Técnico', 'Preventivo'],
            ['IDS (Intrusion Detection System)', 'Técnico', 'Detectivo'],
            ['Backup de datos', 'Técnico', 'Correctivo'],
            ['Cámara de seguridad', 'Físico', 'Detectivo (+ Disuasorio)'],
            ['Cartel "Zona videovigilada"', 'Físico', 'Disuasorio'],
            ['Política de contraseñas', 'Administrativo', 'Preventivo'],
            ['Antivirus que elimina malware', 'Técnico', 'Correctivo'],
          ]}
        />
      </Section>

      <Section title="ISO 27001:2022" color={EMERALD}>
        <Info>
          El Anexo A de ISO 27001:2022 tiene <strong>93 controles</strong>. La versión 2013 del temario tiene 114. Usar siempre el dato de 2022.
        </Info>
      </Section>
    </>
  );
}

/* ── Block 6: T6 — Tipos de auditoría ──────────────────────────────────── */

function Block6() {
  return (
    <>
      <NotaProfesor>El profesor dijo: «<strong>Lo más importante y la mayor diferencia: la auditoría estudia un momento concreto de la actividad.</strong>»</NotaProfesor>

      <Section title="Control interno vs. Auditoría — Diferencia fundamental" color={BLUE}>
        <Table
          heads={['', 'Control interno / Auditoría interna', 'Auditoría externa']}
          rows={[
            ['Temporalidad', 'Continuo y permanente.', 'Puntual — estudia un momento concreto.'],
            ['Quién la realiza', 'La propia organización.', 'Entidad ajena e independiente.'],
            ['Resultado', 'Lo controla la organización.', 'No lo controla la organización auditada. La más temida.'],
          ]}
        />
        <Warning>
          Si una empresa contrata a un auditor externo pero lo incluye bajo <strong>dependencia interna</strong>, sigue siendo auditoría <strong>interna</strong>. Lo que determina el tipo es la independencia real, no el origen del profesional.
        </Warning>
      </Section>

      <Section title="Tipos de auditoría por objetivo" color={PURPLE}>
        <Table
          heads={['Tipo', 'Qué evalúa']}
          rows={[
            ['Auditoría del sistema', 'Espectro más global. Evalúa toda la gestión del sistema.'],
            ['Auditoría de proceso', 'Evalúa rendimiento y eficiencia de procesos.'],
            ['Auditoría de producto', 'Valida software específico.'],
            ['Auditoría forense', 'Analiza evidencias en casos de fraude o conflictos legales.'],
            ['Auditoría normativa / verificación', 'Obligatoria por ley.'],
            ['Auditoría de certificación', 'Voluntaria.'],
          ]}
        />
      </Section>

      <Section title="ENS — Esquema Nacional de Seguridad" color={ORANGE}>
        <Table
          heads={['Nivel del sistema', 'Tipo de auditoría requerida']}
          rows={[
            ['Nivel medio o alto', 'Auditoría externa obligatoria cada 2 años.'],
            ['Nivel básico', 'Autoevaluación o auditoría interna.'],
          ]}
        />
      </Section>

      <Section title="Sanciones RGPD (aplicadas por la AEPD en España)" color={EMERALD}>
        <Info>
          Infracciones muy graves → hasta <strong>20 millones de euros o el 4%</strong> de la facturación global anual (lo que sea mayor).
          El auditor informa a los <strong>órganos de alta dirección</strong> (consejo de administración, comité de auditoría).
        </Info>
      </Section>

      <NoEntra items={['Auditoría financiera', 'Auditoría operacional', 'Auditoría integral (descartadas expresamente por el profesor)']} />
    </>
  );
}

/* ── Block 7: T7 — Técnicas para la recolección de información ─────────── */

function Block7() {
  return (
    <>
      <NotaProfesor>El profesor: «<strong>Lo más importante del tema es fingerprinting y footprinting.</strong>»</NotaProfesor>

      <Section title="Fingerprinting — Técnica centrada en un dispositivo concreto" color={BLUE}>
        <Table
          heads={['Variante', 'Cómo funciona', 'Detectabilidad', 'Herramientas']}
          rows={[
            ['Activo', 'Genera tráfico hacia el objetivo para obtener respuestas.', 'Detectable.', 'Nmap'],
            ['Pasivo', 'Solo intercepta tráfico existente. No genera paquetes propios.', 'Indetectable.', 'p0f, Wireshark'],
          ]}
        />
        <Info>Objetivo: extraer sistema operativo, versión de servicios y puertos abiertos de un dispositivo específico.</Info>
      </Section>

      <Section title="Footprinting — Mapa completo de la red de la organización" color={PURPLE}>
        <Table
          heads={['Variante', 'Desde dónde', 'Fuentes', 'Peligrosidad']}
          rows={[
            ['Externo', 'Desde fuera del perímetro.', 'OSINT, DNS, WHOIS, redes sociales.', 'Menor — no accede a la red interna.'],
            ['Interno', 'Desde dentro de la red.', 'Escaneo de red interna, servidores, sistemas.', 'Mayor — el atacante ya ha superado el perímetro.'],
          ]}
        />
      </Section>

      <Section title="Análisis de vulnerabilidades vs. Pen testing" color={ORANGE}>
        <Table
          heads={['', 'Análisis de vulnerabilidades', 'Pen testing (pentesting)']}
          rows={[
            ['Qué hace', 'Identifica y documenta debilidades.', 'Explota las vulnerabilidades para demostrar que son reales.'],
            ['¿Explota?', 'No.', 'Sí. Es activo.'],
            ['Autorización', 'Recomendable.', 'Obligatoria. Hacerlo sin autorización es ilegal.'],
          ]}
        />
      </Section>

      <Section title="Otros conceptos" color={EMERALD}>
        <Checklist items={[
          'Rainbow tables: tablas precalculadas de pares hash→contraseña. El método más eficiente para crackear hashes sin salt.',
          'Transferencia de zona DNS (AXFR): si está mal configurada, permite obtener un volcado completo de registros DNS con toda la infraestructura.',
          'Coste relativo: análisis forense > auditoría de seguridad > pentesting.',
        ]} />
      </Section>

      <Section title="Preguntas de desarrollo señaladas" color={BLUE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            question="¿En qué consiste el fingerprinting? Diferencia activo/pasivo con ejemplos."
            answer="El fingerprinting es una técnica de recolección que analiza un dispositivo concreto para obtener su sistema operativo, versión de servicios y puertos abiertos. Activo: genera tráfico hacia el objetivo (herramienta: Nmap) — es detectable porque deja rastro en los logs. Pasivo: solo intercepta el tráfico existente sin generar paquetes propios (herramientas: p0f, Wireshark) — es indetectable."
          />
          <QA
            question="Distinga footprinting externo e interno. ¿Cuál es más peligroso y por qué?"
            answer="El footprinting obtiene un mapa completo de la infraestructura de red como paso previo al pentesting. Externo: se realiza desde fuera del perímetro de la organización usando fuentes públicas (OSINT, DNS, WHOIS). Interno: se realiza desde dentro de la red, aportando mayor detalle. El footprinting interno es más peligroso porque implica que el atacante ya ha superado el perímetro de seguridad."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 8: T8 — Vulnerabilidades y auditoría de aplicaciones ────────── */

function Block8() {
  return (
    <>
      <NotaProfesor>El profesor sobre fuzzing: «<strong>Sí, sí va a caer.</strong>» SAST/DAST también repetidos expresamente.</NotaProfesor>

      <Section title="Fuzzing" color={BLUE}>
        <Frase>
          &ldquo;Técnica de análisis de vulnerabilidades que consiste en enviar <strong>entradas inesperadas, inválidas o aleatorias</strong> a una aplicación para encontrar errores o vulnerabilidades.&rdquo;
        </Frase>
      </Section>

      <Section title="Tres etapas PTES del análisis de vulnerabilidades" color={PURPLE}>
        <NotaProfesor>El profesor las señaló como pregunta de examen.</NotaProfesor>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li><strong style={{ color: 'var(--text)' }}>Pruebas</strong> — Identificar debilidades.</li>
          <li><strong style={{ color: 'var(--text)' }}>Validación</strong> — Confirmar que existen y son explotables.</li>
          <li><strong style={{ color: 'var(--text)' }}>Investigación</strong> — Evaluar el impacto.</li>
        </ol>
      </Section>

      <Section title="Tipos de XSS (Cross-Site Scripting)" color={ORANGE}>
        <Table
          heads={['Tipo', 'Cómo funciona', 'A quién afecta', 'Distinguirlo']}
          rows={[
            ['XSS reflejado', 'El script viaja en la URL. No se almacena en el servidor.', 'Solo a la víctima que hace clic en el enlace malicioso.', 'No modifica el código fuente del servidor.'],
            ['XSS persistente (almacenado)', 'El código se guarda en la base de datos del servidor.', 'A todos los usuarios que visiten la página.', 'Modifica el código fuente del servidor.'],
          ]}
        />
      </Section>

      <Section title="CSRF y SQL Injection" color={EMERALD}>
        <Table
          heads={['Vulnerabilidad', 'Qué aprovecha', 'Causa principal']}
          rows={[
            ['CSRF (Cross-Site Request Forgery)', 'Una sesión activa autenticada del usuario para ejecutar peticiones no autorizadas en su nombre.', 'Deficiente gestión de sesiones.'],
            ['Inyección SQL', 'La falta de validación/saneamiento de entradas del usuario para inyectar comandos SQL.', 'Ausencia de parametrización de consultas.'],
          ]}
        />
        <Info>
          <strong>WAF para SQL Injection:</strong> el cortafuegos a usar es el <strong>WAF (Web Application Firewall, capa 7)</strong> porque puede inspeccionar el contenido de las peticiones HTTP.
        </Info>
      </Section>

      <Section title="SAST vs. DAST" color={BLUE}>
        <Table
          heads={['', 'SAST (análisis estático)', 'DAST (análisis dinámico)']}
          rows={[
            ['Qué analiza', 'El código fuente sin ejecutar la aplicación.', 'La aplicación en ejecución.'],
            ['Cuándo detecta', 'En desarrollo — antes del despliegue.', 'En tiempo real — tras el despliegue.'],
            ['Ventaja principal', 'Detecta errores de programación pronto.', 'Detecta vulnerabilidades que solo aparecen en tiempo real (lo que SAST no puede ver).'],
          ]}
        />
      </Section>
    </>
  );
}

/* ── Block 9: T9 — Proceso de auditoría informática ───────────────────── */

function Block9() {
  return (
    <>
      <NotaProfesor>El profesor sobre CAAT: «<strong>Esto sí hay que saberse los diferentes tipos.</strong>» Sobre SAST/DAST: «<strong>Por favor, si caen en el examen, por eso lo estoy repitiendo.</strong>»</NotaProfesor>

      <Section title="Herramientas CAT (CAAT) — 5 tipos" color={BLUE}>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li><strong style={{ color: 'var(--text)' }}>Análisis de datos</strong> — ACL, IDEA.</li>
          <li><strong style={{ color: 'var(--text)' }}>Monitoreo y test continuo</strong>.</li>
          <li><strong style={{ color: 'var(--text)' }}>Auditoría de sistemas de información</strong>.</li>
          <li><strong style={{ color: 'var(--text)' }}>Auditoría forense</strong>.</li>
          <li><strong style={{ color: 'var(--text)' }}>Gestión de pruebas</strong>.</li>
        </ol>
      </Section>

      <Section title="Análisis cuantitativo vs. cualitativo de riesgos" color={PURPLE}>
        <Table
          heads={['', 'Cualitativo', 'Cuantitativo']}
          rows={[
            ['Escala', 'Descriptiva: alto / medio / bajo.', 'Valores económicos (€).'],
            ['Velocidad', 'Más rápido y económico.', 'Más costoso pero más preciso.'],
            ['Resultado', 'No da valor económico al riesgo.', 'Calcula SLE, ARO, ALE.'],
            ['Uso', 'Primera aproximación al análisis de riesgos.', 'Cuando se necesita justificar inversiones.'],
          ]}
        />
      </Section>

      <Section title="Tipos de evidencias (dos tipos legales)" color={ORANGE}>
        <Table
          heads={['Tipo', 'Definición']}
          rows={[
            ['Directas', 'Prueban el hecho por sí solas. Imprescindibles para que la auditoría tenga valor probatorio.'],
            ['Indirectas (circunstanciales)', 'Requieren inferencia para llegar al hecho.'],
          ]}
        />
      </Section>

      <Section title="Cadena de custodia" color={EMERALD}>
        <Checklist items={[
          'Garantiza que las evidencias no han sido alteradas.',
          'Requiere acta de recogida con: hora, identidad de quien descubrió, protegió y mantiene la evidencia.',
          'Se calcula un hash al recoger la evidencia y se verifica al presentar en el juzgado.',
          'Se hacen 2 copias: una de trabajo y otra de custodia (esta última se sella y se guarda).',
        ]} />
      </Section>

      <Section title="SDLC — Ciclo de vida del sistema (5 fases)" color={BLUE}>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li>Iniciación</li>
          <li>Desarrollo y adquisición</li>
          <li>Implementación</li>
          <li>Operación y mantenimiento</li>
          <li><strong style={{ color: 'var(--text)' }}>Terminación</strong> — eliminación segura de todos los datos (sanitización).</li>
        </ol>
      </Section>

      <Section title="Ciclo de vida de evidencias digitales — ISO 27037 (4 fases)" color={PURPLE}>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li>Identificación</li>
          <li>Adquisición</li>
          <li>Preservación</li>
          <li>Análisis</li>
        </ol>
      </Section>

      <Section title="Primer paso de una auditoría" color={ORANGE}>
        <Info>
          Redactar los puntos base y obtener la <strong>firma de aceptación</strong> de todos los agentes implicados (incluido el CEO).
        </Info>
      </Section>

      <Section title="Preguntas de desarrollo señaladas" color={EMERALD}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            question="¿Qué son las herramientas CAT y qué tipos hay?"
            answer="Las herramientas CAT (Computer Assisted Audit Techniques) son herramientas de asistencia al auditor informático para automatizar y estructurar el proceso de auditoría. Hay 5 tipos: (1) Análisis de datos (ACL, IDEA), (2) Monitoreo y test continuo, (3) Auditoría de sistemas de información, (4) Auditoría forense, (5) Gestión de pruebas."
          />
          <QA
            question="Diferencia entre análisis cuantitativo y cualitativo de riesgos (con ejemplo de cálculo ALE)."
            answer="El análisis cualitativo usa escalas descriptivas (alto/medio/bajo), es más rápido pero no asigna valor económico. El cuantitativo asigna valores económicos mediante fórmulas: SLE = Valor del activo × Factor de exposición; ALE = SLE × ARO. Ejemplo: activo de 100.000€, factor de exposición 0,3 → SLE = 30.000€; si el ataque ocurre 2 veces al año (ARO = 2) → ALE = 60.000€. Si una contramedida cuesta 40.000€ < ALE, es rentable implementarla."
          />
        </div>
      </Section>
    </>
  );
}

/* ── Block 10: T10 — Planes de continuidad de negocio ──────────────────── */

function Block10() {
  return (
    <>
      <NotaProfesor>El profesor: «<strong>Esto sí hay que sabérselo.</strong>» Tanto BCP/DRP como los centros de respaldo.</NotaProfesor>

      <Section title="BCP vs. DRP — Diferencia y relación" color={BLUE}>
        <Table
          heads={['', 'BCP', 'DRP']}
          rows={[
            ['Nombre', 'Business Continuity Plan', 'Disaster Recovery Plan'],
            ['Alcance', 'Toda la organización.', 'Solo los sistemas TIC.'],
            ['Se activa ante', 'Cualquier tipo de interrupción.', 'Desastre que afecte a la infraestructura TIC.'],
            ['Relación', 'Engloba al DRP.', 'Es un subconjunto del BCP.'],
          ]}
        />
      </Section>

      <Section title="BIA — Business Impact Analysis" color={PURPLE}>
        <Info>
          Análisis de impacto de negocio. Permite identificar los <strong>procesos críticos</strong> y sus parámetros de recuperación. Es la <strong>base</strong> tanto del BCP como del DRP.
        </Info>
      </Section>

      <Section title="Parámetros clave — Señalados por el profesor como importantes" color={ORANGE}>
        <Table
          heads={['Parámetro', 'Significado', 'Determina']}
          rows={[
            ['RTO (Recovery Time Objective)', 'Tiempo máximo tolerable de inactividad del servicio.', 'Cuánto tiempo puede estar caído el sistema.'],
            ['RPO (Recovery Point Objective)', 'Máxima pérdida de datos aceptable medida en tiempo.', 'La frecuencia del backup (si RPO = 4h, backup cada 4h).'],
            ['MTPD (Maximum Tolerable Period of Disruption)', 'Tiempo máximo antes de que el impacto sea irreversible.', 'El límite absoluto — más allá la empresa no se recupera.'],
          ]}
        />
      </Section>

      <Section title="Tres tipos de centros de respaldo" color={EMERALD}>
        <NotaProfesor>El profesor: «<strong>Esto sí hay que sabérselo.</strong>»</NotaProfesor>
        <Table
          heads={['Centro', 'Qué ofrece', 'Velocidad de activación', 'Coste']}
          rows={[
            ['Arranque en frío (cold site)', 'Solo espacio físico, suministro eléctrico y climatización. Sin equipamiento.', 'Lenta (hay que instalar equipos).', 'El más barato.'],
            ['Arranque templado (warm site)', 'Local con equipamiento instalado pero sin datos actualizados.', 'Media (hay que cargar datos).', 'Intermedio.'],
            ['Arranque en caliente (hot site)', 'Réplica en tiempo real. Lista para operar en minutos.', 'Rápida — minutos.', 'El más caro.'],
          ]}
        />
      </Section>

      <Section title="Regla 3-2-1 y NIST" color={BLUE}>
        <Rule label="Regla 3-2-1">
          {`3 copias de seguridad
en 2 medios diferentes
con 1 copia fuera de las instalaciones (offsite)`}
        </Rule>
        <Info style={{ marginTop: 8 }}>
          <strong>Fases del BCP según el NIST:</strong> 4 fases — iniciación, evaluación/BIA, desarrollo, aprobación e implementación.
        </Info>
      </Section>

      <Section title="Preguntas de desarrollo señaladas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            question="Diferencia entre BCP y DRP. ¿Cómo están relacionados?"
            answer="El BCP (Business Continuity Plan) es el plan global que cubre toda la organización ante cualquier tipo de interrupción. El DRP (Disaster Recovery Plan) se centra específicamente en la recuperación de los sistemas TIC tras un desastre. La relación es de inclusión: el BCP engloba al DRP como uno de sus componentes. Ambos se basan en el BIA (Business Impact Analysis) para identificar procesos críticos y sus parámetros de recuperación (RTO, RPO, MTPD)."
          />
          <QA
            question="¿En qué consiste un BIA dentro de un DRP?"
            answer="El BIA (Business Impact Analysis) es el análisis previo que identifica qué procesos de negocio son críticos, qué impacto tendría su interrupción y en qué plazo debe recuperarse cada uno. Dentro del DRP, el BIA determina los valores de RTO (cuánto puede estar caído un sistema), RPO (cuántos datos se pueden perder) y MTPD (tiempo máximo tolerable antes de daño irreversible). Es el punto de partida imprescindible antes de diseñar cualquier estrategia de recuperación."
          />
        </div>
      </Section>

      <NoEntra items={['Fases del DRP según el INCIBE (el profesor dijo expresamente que no las preguntará)']} />
    </>
  );
}

/* ── Block 11: T11 — Marco legal y normativo ───────────────────────────── */

function Block11() {
  return (
    <>
      <NotaProfesor>El profesor: «<strong>Ya lo digo directamente, esto es materia de preguntas de examen.</strong>» Locard y Daubert confirmados explícitamente.</NotaProfesor>

      <Section title="Delitos informáticos — Dos categorías" color={BLUE}>
        <Table
          heads={['Categoría', 'Descripción', 'Ejemplos']}
          rows={[
            ['Como instrumento', 'El sistema se usa para delinquir.', 'Phishing, amenazas online, fraude, estafa informática.'],
            ['Como fin', 'El ataque va dirigido contra el propio sistema.', 'Sabotaje, destrucción de datos, acceso no autorizado.'],
          ]}
        />
        <Checklist items={[
          'El acceso no autorizado a un sistema ajeno ya es delito, aunque no haya intención de robar ni dañar.',
          'El lucro en la estafa informática (Art. 248) debe ser económico — no se amplía a otros tipos de beneficio.',
          'Ciberterrorismo: ransomware, ataques DDoS mediante botnets. Objetivo preferente: administraciones públicas.',
        ]} />
        <Warning>
          Sobre los artículos del Código Penal: <strong>no hay que memorizarlos</strong>. La pregunta ya incluirá el número si es necesario.
        </Warning>
      </Section>

      <Section title="Marco normativo de protección de datos" color={PURPLE}>
        <Table
          heads={['Norma', 'Clave']}
          rows={[
            ['RGPD Art. 5 — Principios', 'Licitud, finalidad, minimización, exactitud, integridad, conservación limitada, responsabilidad proactiva (la carga de probar el cumplimiento recae sobre el responsable del tratamiento).'],
            ['LOPDGDD (LO 3/2018)', 'Adapta el RGPD en España. Edad de consentimiento digital: 14 años.'],
            ['Sanciones', 'Graves → hasta 10M€ o 2%. Muy graves → hasta 20M€ o 4% de facturación global.'],
          ]}
        />
      </Section>

      <Section title="Principio de Locard — Confirmado como examen" color={ORANGE}>
        <Frase>
          &ldquo;<strong>Cada contacto deja un rastro.</strong>&rdquo;
        </Frase>
        <Checklist items={[
          'En digital: logs, metadatos, tráfico de red, contenido de RAM.',
          'La ausencia de un log también es una traza (alguien los borró).',
          'El investigador también deja rastros al trabajar — por eso se hacen 2 copias: trabajo + custodia.',
          'Se calcula un hash de la copia de custodia que se verifica al presentar en el juzgado.',
        ]} />
      </Section>

      <Section title="Criterio de Daubert — 4 criterios de admisibilidad de evidencias" color={EMERALD}>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li><strong style={{ color: 'var(--text)' }}>Verificabilidad</strong> — puede ser contrastada o refutada.</li>
          <li><strong style={{ color: 'var(--text)' }}>Revisión por pares</strong> — publicada y revisada por la comunidad científica.</li>
          <li><strong style={{ color: 'var(--text)' }}>Tasa de error</strong> — conocida y aceptable.</li>
          <li><strong style={{ color: 'var(--text)' }}>Aceptación científica</strong> — reconocida en la comunidad especializada.</li>
        </ol>
      </Section>

      <Section title="Auditoría informática vs. Análisis forense" color={BLUE}>
        <Table
          heads={['', 'Auditoría informática', 'Análisis forense']}
          rows={[
            ['Cuándo', 'Preventiva, periódica.', 'Reactiva, puntual (tras el incidente).'],
            ['Objetivo', 'Conformidad con estándares.', 'Probatorio — recopilar evidencias.'],
            ['Cadena de custodia', 'No requerida.', 'Obligatoria.'],
          ]}
        />
      </Section>

      <Section title="Preguntas de desarrollo señaladas" color={PURPLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            question="Principio de Locard e implicaciones en la cadena de custodia."
            answer="El principio de Locard establece que 'cada contacto deja un rastro'. En el ámbito digital, esto significa que cualquier actividad en un sistema genera trazas: logs, metadatos, tráfico de red, datos en RAM. Incluso la ausencia de un log es una traza (indica que alguien los eliminó). La implicación en la cadena de custodia es que el propio investigador también deja rastros al trabajar, por lo que se trabaja siempre sobre una copia y se conserva la original sellada con su hash verificado."
          />
          <QA
            question="Diferencia entre auditoría informática y análisis forense."
            answer="La auditoría informática es preventiva y periódica: evalúa el cumplimiento de estándares y la eficiencia de los sistemas. No requiere cadena de custodia. El análisis forense es reactivo y puntual: se activa tras un incidente y su objetivo es probatorio — recopilar y preservar evidencias para su presentación en un procedimiento legal. Requiere cadena de custodia estricta y se apoya en los controles detectivos (logs, IDS) del sistema auditado."
          />
        </div>
      </Section>

      <NoEntra items={['Reglamento de IA (AIAT)', 'Directiva NIS-2', 'Tablas de protección de la LOPD 15/1999 (derogada)']} />
    </>
  );
}

/* ── Block 12: T12 — Gobernanza y certificaciones ──────────────────────── */

function Block12() {
  return (
    <>
      <NotaProfesor>El profesor: «<strong>Esto podría caer en el examen.</strong>» Gobernanza vs. Gestión es el más probable de este tema.</NotaProfesor>

      <Section title="Gobernanza TIC vs. Gestión TIC — El más probable" color={BLUE}>
        <Table
          heads={['', 'Gobernanza TIC (ISO 38.500)', 'Gestión TIC']}
          rows={[
            ['Definición', '"Sistema por el que se dirigen y controlan los usos actuales y futuros de las TIC."', 'Centra el foco en activos internos y el presente operacional.'],
            ['Orientación', 'Futuro e influencias externas. Establece políticas y verifica.', 'Que los sistemas funcionen hoy. Ejecuta los procesos.'],
            ['Nivel', 'Directivo alto (consejo de administración).', 'Operativo y táctico.'],
            ['Analogía', '"Definir el rumbo y comprobar que se sigue."', '"Hacer que el barco funcione hoy."'],
          ]}
        />
      </Section>

      <Section title="Seis principios de ISO 38.500 — Solo en preguntas tipo test, no desarrollo" color={PURPLE}>
        <NotaProfesor>El profesor: «<strong>Hay que sabérselos, identificarlos y entenderlos para test.</strong>» No entran en preguntas de desarrollo.</NotaProfesor>
        <Table
          heads={['Nº', 'Principio', 'Significado']}
          rows={[
            ['1', 'Responsabilidad', 'Todos comprenden y aceptan sus responsabilidades TIC.'],
            ['2', 'Estrategia ⭐ más importante', 'Plan estratégico TIC con necesidades actuales y futuras.'],
            ['3', 'Adquisición', 'Toda compra tecnológica requiere análisis previo (inventario, alternativas, costes/riesgos).'],
            ['4', 'Rendimiento', 'Las TIC contribuyen eficientemente al negocio.'],
            ['5', 'Conformidad', 'Las TIC cumplen todas las leyes y normativas aplicables.'],
            ['6', 'Factor humano', 'Las políticas TIC respetan y contemplan al factor humano.'],
          ]}
        />
      </Section>

      <Section title="Gobernanza corporativa vs. De negocio" color={ORANGE}>
        <Table
          heads={['', 'Corporativa', 'De negocio']}
          rows={[
            ['Quién', 'Consejo de Administración.', 'Dirección operativa.'],
            ['Objetivo', 'Asegurar el logro de objetivos, proteger el patrimonio y ofrecer transparencia a los grupos de interés.', 'Gestionar el día a día operativo.'],
            ['Herramienta clave', 'Comité de auditoría.', 'Procesos operativos y KPIs.'],
          ]}
        />
      </Section>

      <Section title="Certificaciones clave" color={EMERALD}>
        <Table
          heads={['Certificación', 'Enfoque', 'Emitida por']}
          rows={[
            ['CISA (Certified Information Systems Auditor)', 'Auditoría de sistemas — la principal referencia en auditoría informática.', 'ISACA'],
            ['CISSP (Certified Information Systems Security Professional)', 'Seguridad de la información.', '(ISC)²'],
            ['CGEIT (Certified in Governance of Enterprise IT)', 'Gobernanza TIC.', 'ISACA — «No es importante» (profesor).'],
          ]}
        />
      </Section>

      <Section title="Estándares — Solo los señalados por el profesor" color={BLUE}>
        <NotaProfesor>El profesor: «<strong>La 38.500, la 27.001 y la 22.301. De lo demás, no hay importancia.</strong>»</NotaProfesor>
        <Table
          heads={['Estándar', 'Sobre qué']}
          rows={[
            ['ISO 38.500', 'Gobierno de TIC.'],
            ['ISO 27001', 'SGSI — Seguridad de la información.'],
            ['ISO 22.301', 'Continuidad de negocio.'],
            ['COBIT', 'Marco de gobierno y gestión TIC de ISACA (desde 1996).'],
            ['ITIL', 'Gestión de servicios TIC. El profesor: «Esto no cae en el examen.»'],
          ]}
        />
      </Section>
    </>
  );
}

/* ── Componente principal ──────────────────────────────────────────────── */

export default function CasiExamPrep() {
  return (
    <section className="te-prep" aria-label="Preparación examen CASI">

      {/* Cabecera */}
      <div className="te-prep-header">
        <div className="te-prep-icon" style={{
          background: `linear-gradient(180deg, #ffffff, rgba(46,139,87,0.1))`,
          border: `1px solid rgba(46,139,87,0.2)`,
        }} aria-hidden="true">✅</div>
        <div>
          <div className="te-prep-title">Preparación examen CASI</div>
          <div className="te-prep-subtitle">
            Guía de estudio orientada al examen final · 12 temas · Test + Desarrollo
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="te-prep-stats">
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Estructura examen</div>
          <div className="te-prep-stat-value">10 test + 4 desarrollo</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Puntuación</div>
          <div className="te-prep-stat-value accent">4 pts test · 6 pts desarrollo</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Más señalado</div>
          <div className="te-prep-stat-value">Firma digital + controles T5</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Clave del examen</div>
          <div className="te-prep-stat-value">Clasificar controles en 2 dimensiones</div>
        </div>
      </div>

      {/* Acordeones */}
      <div className="ptg-list">

        <AccordionBlock
          id="esquema"
          icon="🗺️"
          title="Esquema general de la asignatura"
          subtitle="Los 5 bloques y 12 temas de un vistazo"
        >
          <BlockEsquema />
        </AccordionBlock>

        <AccordionBlock
          id="t1"
          icon="🔐"
          title="Tema 1 — Introducción a los SGSI"
          subtitle="Tríada CID · Reglas de Oro · Tipos de ataque · Activos"
        >
          <Block1 />
        </AccordionBlock>

        <AccordionBlock
          id="t2"
          icon="📋"
          title="Tema 2 — Planificación de la seguridad"
          subtitle="Triángulo del riesgo · Mínimo privilegio · SLE/ALE · MDM · RGPD · LOPDGDD"
        >
          <Block2 />
        </AccordionBlock>

        <AccordionBlock
          id="t3"
          icon="🔑"
          title="Tema 3 — Protección de activos I (mecanismos)"
          subtitle="Firma digital ⭐ · Criptografía · Alta disponibilidad · Backups · DAC/MAC/RBAC"
        >
          <Block3 />
        </AccordionBlock>

        <AccordionBlock
          id="t4"
          icon="🌐"
          title="Tema 4 — Redes y comunicaciones"
          subtitle="OSI/TCP-IP · 4 modelos cortafuegos · WiFi WEP/WPA · IDS/IPS · MDM"
        >
          <Block4 />
        </AccordionBlock>

        <AccordionBlock
          id="t5"
          icon="🛡️"
          title="Tema 5 — Controles internos del SGSI"
          subtitle="Doble clasificación ⭐ · Administrativo/Técnico/Físico · Preventivo/Detectivo/Correctivo/Disuasorio"
        >
          <Block5 />
        </AccordionBlock>

        <AccordionBlock
          id="t6"
          icon="🔍"
          title="Tema 6 — Tipos de auditoría"
          subtitle="Interna vs. externa · Tipos por objetivo · ENS · Sanciones RGPD"
        >
          <Block6 />
        </AccordionBlock>

        <AccordionBlock
          id="t7"
          icon="🕵️"
          title="Tema 7 — Técnicas de recolección de información"
          subtitle="Fingerprinting ⭐ · Footprinting · OSINT · Análisis vuln. vs. pentesting · Rainbow tables"
        >
          <Block7 />
        </AccordionBlock>

        <AccordionBlock
          id="t8"
          icon="🐛"
          title="Tema 8 — Vulnerabilidades y auditoría de aplicaciones"
          subtitle="Fuzzing ⭐ · PTES · XSS reflejado/persistente · CSRF · SQL Injection · SAST/DAST"
        >
          <Block8 />
        </AccordionBlock>

        <AccordionBlock
          id="t9"
          icon="📊"
          title="Tema 9 — Proceso de auditoría informática"
          subtitle="Herramientas CAT ⭐ · SDLC · Evidencias · Forense · Cadena de custodia · ISO 27037"
        >
          <Block9 />
        </AccordionBlock>

        <AccordionBlock
          id="t10"
          icon="♻️"
          title="Tema 10 — Planes de continuidad de negocio"
          subtitle="BCP vs. DRP ⭐ · BIA · RTO/RPO/MTPD · Centros frío/templado/caliente · Regla 3-2-1"
        >
          <Block10 />
        </AccordionBlock>

        <AccordionBlock
          id="t11"
          icon="⚖️"
          title="Tema 11 — Marco legal y normativo"
          subtitle="Delitos informáticos · RGPD · Principio de Locard ⭐ · Criterio de Daubert · Auditoría vs. forense"
        >
          <Block11 />
        </AccordionBlock>

        <AccordionBlock
          id="t12"
          icon="🏛️"
          title="Tema 12 — Gobernanza y certificaciones"
          subtitle="Gobernanza vs. Gestión TIC · ISO 38.500 (6 principios) · CISA/CISSP · ISACA · Estándares"
        >
          <Block12 />
        </AccordionBlock>

      </div>
    </section>
  );
}
