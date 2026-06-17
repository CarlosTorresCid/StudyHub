import './IsaExamPrep.css';

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function IsaTable({ heads, rows }) {
  return (
    <div className="isa-table-wrap">
      <table className="isa-table">
        <thead>
          <tr>{heads.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={
                row._total ? 'isa-td-total' : row._subtotal ? 'isa-td-subtotal' : ''
              }
            >
              {row.cells.map((cell, j) => (
                <td
                  key={j}
                  className={row._right && j === row.cells.length - 1 ? 'isa-td-right' : ''}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Checklist({ items }) {
  return (
    <ul className="isa-checklist">
      {items.map((item, i) => (
        <li key={i}><span className="isa-check">✓</span>{item}</li>
      ))}
    </ul>
  );
}

function Diagram({ children }) {
  return <pre className="ptg-ejemplo-diagrama">{children}</pre>;
}

function Tip({ children }) {
  return (
    <div className="ptg-tip">
      <span className="ptg-tip-label">💡 Recuerda para el examen</span>
      {children}
    </div>
  );
}

function PatternCard({ icon, name, when, justify, components, diagram }) {
  return (
    <div className="isa-pattern-card">
      <div className="isa-pattern-header">
        <span className="isa-pattern-icon">{icon}</span>
        <span className="isa-pattern-name">{name}</span>
      </div>
      {when && (
        <div>
          <span className="isa-label">Cuándo utilizarlo</span>
          <p className="isa-when-text">{when}</p>
        </div>
      )}
      {justify && (
        <blockquote className="isa-justify">
          &ldquo;{justify}&rdquo;
        </blockquote>
      )}
      {components && (
        <div>
          <span className="isa-label">Componentes obligatorios en el diagrama</span>
          <ul className="isa-comp-list">
            {components.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
      {diagram && <Diagram>{diagram}</Diagram>}
    </div>
  );
}

function AccordionBlock({ id, icon, title, points, children }) {
  return (
    <details id={`isa-prep-${id}`} className="ptg-item">
      <summary className="ptg-summary">
        <span className="ptg-summary-icon" aria-hidden="true">{icon}</span>
        <span className="ptg-summary-main">
          <span className="ptg-summary-title">{title}</span>
          <span className="ptg-summary-sub">{points}</span>
        </span>
        <span className="ptg-summary-marker" aria-hidden="true">▾</span>
      </summary>
      <div className="ptg-body">
        {children}
      </div>
    </details>
  );
}

/* ── BLOQUE 1: Usuarios y pila de producto ───────────────────────────────── */

function Block1() {
  const tiposHU = {
    heads: ['Tipo de historia', 'Cuándo usarla', 'Ejemplos de acción'],
    rows: [
      { cells: ['Consulta / búsqueda', 'Cuando el usuario necesita encontrar información', 'buscar, filtrar, consultar'] },
      { cells: ['Creación / publicación', 'Cuando alguien añade contenido o registros', 'publicar, registrar, añadir'] },
      { cells: ['Gestión de estado', 'Cuando una entidad cambia de fase', 'aceptar, cancelar, marcar, validar'] },
      { cells: ['Notificación', 'Cuando el sistema avisa de un cambio', 'recibir alerta, ser notificado'] },
      { cells: ['Historial / seguimiento', 'Cuando importa consultar actividad pasada', 'ver historial, seguir evolución'] },
    ],
  };

  const plantillaBacklog = {
    heads: ['ID', 'Historia de usuario', 'Prioridad'],
    rows: [
      { cells: ['HU-01', 'Como [usuario], quiero buscar/filtrar [entidad del dominio] por [criterios], para [beneficio].', 'Alta'] },
      { cells: ['HU-02', 'Como [usuario], quiero consultar el detalle de [entidad], para [beneficio].', 'Alta'] },
      { cells: ['HU-03', 'Como [usuario gestor], quiero crear o publicar [entidad], para [beneficio].', 'Alta'] },
      { cells: ['HU-04', 'Como [usuario], quiero recibir notificaciones cuando [evento del dominio], para [beneficio].', 'Media'] },
      { cells: ['HU-05', 'Como [usuario], quiero consultar el historial de [entidad/actividad], para [beneficio].', 'Media'] },
    ],
  };

  const ejemploAparcamiento = {
    heads: ['ID', 'Historia de usuario'],
    rows: [
      { cells: ['HU-01', 'Como conductor, quiero buscar plazas de aparcamiento cercanas por ubicación y horario, para encontrar una plaza disponible antes de desplazarme.'] },
      { cells: ['HU-02', 'Como conductor, quiero reservar una plaza durante una franja horaria concreta, para asegurarme de que estará disponible al llegar.'] },
      { cells: ['HU-03', 'Como propietario de plaza, quiero publicar la disponibilidad de mi plaza por días y horas, para poder alquilarla cuando no la uso.'] },
      { cells: ['HU-04', 'Como conductor, quiero recibir una notificación cuando mi reserva esté próxima a finalizar, para ampliarla o retirar el vehículo a tiempo.'] },
      { cells: ['HU-05', 'Como propietario, quiero consultar el historial de reservas de mi plaza, para revisar ingresos y ocupación.'] },
    ],
  };

  const checklist = [
    'Hay al menos 2 tipos de usuario (principal + secundario o administrador).',
    'Las 5 historias tienen el formato "Como…, quiero…, para…".',
    'Las historias son específicas del dominio de la aplicación.',
    'No aparecen login, logout, crear usuario ni eliminar usuario.',
    'Las historias tienen IDs HU-01, HU-02, HU-03, HU-04 y HU-05.',
  ];

  return (
    <>
      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Qué pide este apartado</div>
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65 }}>
          Identificar los usuarios del producto y crear <strong style={{ color: 'var(--text)' }}>5 historias de usuario específicas del dominio</strong>. No sirven historias genéricas (iniciar sesión, cerrar sesión, crear usuario, recuperar contraseña…). El formato es obligatorio:
        </p>
        <div className="isa-hu-format" style={{ marginTop: 12 }}>
          <strong>&ldquo;Como</strong> [tipo de usuario]<strong>, quiero</strong> [funcionalidad específica]<strong>, para</strong> [beneficio concreto]<strong>.&rdquo;</strong>
        </div>
      </div>

      <div className="ptg-section" style={{ borderLeftColor: '#3b82f6' }}>
        <div className="ptg-section-title" style={{ color: '#1d4ed8' }}>Estrategia para identificar usuarios</div>
        <div className="isa-info">
          Primero identifica el dominio. Pregúntate: <strong>¿quién usa la app?</strong> · <strong>¿quién genera información?</strong> · <strong>¿quién consume información?</strong> · <strong>¿quién administra o supervisa?</strong>
          <br /><br />
          Nombra a los usuarios con su rol en el dominio: no «usuario registrado», sino <em>Conductor</em>, <em>Propietario de plaza</em>, <em>Óptico</em>, <em>Comprador</em>, <em>Vendedor</em>…
        </div>
      </div>

      <div className="ptg-section" style={{ borderLeftColor: '#8b5cf6' }}>
        <div className="ptg-section-title" style={{ color: '#7c3aed' }}>5 tipos de historia recomendados</div>
        <IsaTable heads={tiposHU.heads} rows={tiposHU.rows} />
      </div>

      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Plantilla de respuesta</div>
        <div className="isa-info" style={{ marginBottom: 10 }}>
          <strong>Usuarios identificados:</strong> Usuario principal · Usuario gestor/productor · Administrador · Usuario secundario (si procede)
        </div>
        <IsaTable heads={plantillaBacklog.heads} rows={plantillaBacklog.rows} />
      </div>

      <div className="ptg-section ptg-section-ejemplo">
        <div className="ptg-section-title">Ejemplo rápido · App de reservas de aparcamiento</div>
        <IsaTable heads={ejemploAparcamiento.heads} rows={ejemploAparcamiento.rows} />
      </div>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Checklist del apartado 1</div>
        <Checklist items={checklist} />
      </div>
    </>
  );
}

/* ── BLOQUE 2: Equipo Scrum y Sprint Backlog ─────────────────────────────── */

function Block2() {
  const sprintRows = [
    { cells: ['HU-01', 'Diseñar pantalla/formulario de búsqueda de [entidad]', '5 h'], _right: true },
    { cells: ['HU-01', 'Implementar filtros de búsqueda por [criterios]', '8 h'], _right: true },
    { cells: ['HU-01', 'Crear endpoint/API de consulta', '7 h'], _right: true },
    { cells: ['HU-01', 'Implementar lógica de filtrado en backend', '7 h'], _right: true },
    { cells: ['HU-01', 'Pruebas de búsqueda y validación de resultados', '5 h'], _right: true },
    { cells: ['', 'Subtotal HU-01', '32 h'], _subtotal: true, _right: true },
    { cells: ['HU-02', 'Diseñar pantalla de detalle/reserva/gestión', '4 h'], _right: true },
    { cells: ['HU-02', 'Implementar acción principal del usuario', '8 h'], _right: true },
    { cells: ['HU-02', 'Crear servicio de negocio asociado', '6 h'], _right: true },
    { cells: ['HU-02', 'Guardar cambios en base de datos', '4 h'], _right: true },
    { cells: ['HU-02', 'Pruebas funcionales', '2 h'], _right: true },
    { cells: ['', 'Subtotal HU-02', '24 h'], _subtotal: true, _right: true },
    { cells: ['HU-03', 'Diseñar formulario de alta/publicación de [entidad]', '4 h'], _right: true },
    { cells: ['HU-03', 'Implementar validaciones de datos', '5 h'], _right: true },
    { cells: ['HU-03', 'Crear endpoint de alta/publicación', '5 h'], _right: true },
    { cells: ['HU-03', 'Persistencia en base de datos', '4 h'], _right: true },
    { cells: ['HU-03', 'Pruebas unitarias e integración', '2 h'], _right: true },
    { cells: ['', 'Subtotal HU-03', '20 h'], _subtotal: true, _right: true },
    { cells: ['', 'TOTAL SPRINT', '76 h'], _total: true, _right: true },
  ];

  const checklist = [
    'Aparecen los 3 roles Scrum: Product Owner, Scrum Master y Development Team.',
    'Se calcula la capacidad: 2 × (40 − 2) = 76 horas.',
    'Se seleccionan exactamente 3 historias de las 5 del Product Backlog.',
    'Cada historia se divide en tareas concretas.',
    'Cada tarea tiene sus horas asignadas.',
    'El total suma exactamente 76 horas.',
  ];

  return (
    <>
      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Qué pide este apartado</div>
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65 }}>
          Definir el equipo de trabajo y planificar el primer sprint. Se eligen <strong style={{ color: 'var(--text)' }}>3 historias de las 5 anteriores</strong> y se descomponen en tareas con horas concretas. La carga total debe encajar en la capacidad real del equipo.
        </p>
        <div className="isa-formula" style={{ marginTop: 14 }}>
          <div className="isa-formula-eq">
            2 desarrolladores × (40&nbsp;h − 2&nbsp;h reuniones) = 2 × 38&nbsp;h = <strong>76&nbsp;h disponibles</strong>
          </div>
        </div>
      </div>

      <div className="ptg-section" style={{ borderLeftColor: '#3b82f6' }}>
        <div className="ptg-section-title" style={{ color: '#1d4ed8' }}>Definición del equipo</div>
        <div className="isa-info">
          <strong>Product Owner</strong> — representa al cliente y prioriza el Product Backlog.<br />
          <strong>Scrum Master</strong> — facilita la metodología y elimina impedimentos (puede ser uno de los desarrolladores).<br />
          <strong>Development Team</strong> — 2 desarrolladores full-stack encargados de implementar las historias.
        </div>
      </div>

      <div className="ptg-section" style={{ borderLeftColor: '#10b981' }}>
        <div className="ptg-section-title" style={{ color: '#059669' }}>Frase de justificación de capacidad</div>
        <p className="isa-frase">
          &ldquo;El sprint tiene una duración de una semana. El equipo cuenta con 2 desarrolladores a 40 horas semanales.
          Se descuentan 2 horas por desarrollador para reuniones Scrum, por lo que cada uno dispone de 38 horas efectivas.
          La capacidad total del sprint es de <strong>76 horas</strong>, y las tareas seleccionadas no superan dicha carga.&rdquo;
        </p>
      </div>

      <div className="ptg-section" style={{ borderLeftColor: '#8b5cf6' }}>
        <div className="ptg-section-title" style={{ color: '#7c3aed' }}>Cómo elegir las 3 historias</div>
        <div className="isa-info">
          Elige las 3 historias de <strong>mayor prioridad</strong>. Normalmente: <strong>HU-01</strong> (búsqueda o consulta principal) · <strong>HU-02</strong> (acción principal del usuario) · <strong>HU-03</strong> (creación o gestión de la entidad principal). Evita las accesorias (HU-04, HU-05) en el primer sprint.
        </div>
      </div>

      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Plantilla de Sprint Backlog · 76 horas</div>
        <IsaTable
          heads={['Historia', 'Tarea', 'Horas']}
          rows={sprintRows}
        />
        <p className="isa-frase" style={{ marginTop: 12 }}>
          &ldquo;Las tres historias seleccionadas suman exactamente <strong>76 horas</strong>, por lo que la carga de trabajo es asumible para el equipo durante un sprint de una semana.&rdquo;
        </p>
      </div>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Checklist del apartado 2</div>
        <Checklist items={checklist} />
      </div>
    </>
  );
}

/* ── BLOQUE 3: Diseño arquitectónico general ─────────────────────────────── */

function Block3() {
  const decisionTable = {
    heads: ['Si el enunciado habla de…', 'Usa este patrón', 'Justificación corta'],
    rows: [
      { cells: ['Web + móvil + escritorio', 'BFF', 'Adaptar respuestas a cada tipo de cliente'] },
      { cells: ['Consultas frecuentes, catálogos, listas', 'Cache Aside', 'Reducir latencia y carga en BD'] },
      { cells: ['Login externo o seguridad de acceso', 'Identidad Federada', 'Delegar autenticación en un IdP de confianza'] },
      { cells: ['Imágenes, vídeos, documentos, archivos', 'Hosting estático / CDN', 'Servir recursos estáticos sin cargar el servidor principal'] },
      { cells: ['APIs externas inestables, pagos, servicios de terceros', 'Reintento / Retry', 'Reintentar fallos temporales automáticamente'] },
      { cells: ['Tareas con distinta urgencia o criticidad', 'Cola de prioridad', 'Procesar antes lo crítico'] },
      { cells: ['Picos de demanda o procesamiento pesado', 'Equilibrado basado en colas', 'Desacoplar recepción de solicitudes del procesamiento'] },
      { cells: ['Gran volumen de datos o muchos usuarios', 'Sharding', 'Dividir la BD en fragmentos más manejables'] },
      { cells: ['Datos sensibles o servicios internos', 'Gatekeeper', 'Proteger el acceso a recursos internos'] },
      { cells: ['Monitorización y disponibilidad', 'Agente supervisor de estado', 'Detectar fallos y activar recuperación'] },
      { cells: ['Procesamiento por etapas, pipelines', 'Tuberías y filtros', 'Separar transformaciones en etapas independientes'] },
    ],
  };

  const checklist = [
    'Se usan 3 patrones arquitectónicos estudiados en la asignatura.',
    'Se priorizan patrones del tema 6 (cloud) como BFF, Cache Aside e Identidad Federada.',
    'No se basa la respuesta en capas, MVC o cliente-servidor como patrones principales.',
    'Cada patrón resuelve un problema concreto y específico del producto.',
    'El diagrama muestra los componentes de cada patrón (no solo su nombre).',
    'Identidad Federada incluye: usuario, aplicación, proveedor de identidad y token.',
    'Cache Aside muestra el flujo cache hit / cache miss explícitamente.',
    'BFF muestra los diferentes clientes y su BFF específico.',
  ];

  return (
    <>
      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Qué pide este apartado</div>
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65 }}>
          Diseño de alto nivel del sistema aplicando <strong style={{ color: 'var(--text)' }}>3 patrones arquitectónicos</strong> del temario. Se debe dibujar el diagrama y rellenar una tabla con el nombre de cada patrón y el problema concreto que resuelve en el producto.
        </p>
        <div className="isa-warning" style={{ marginTop: 12 }}>
          <span className="isa-warning-icon">⚠️</span>
          <span><strong>Importante:</strong> Prioriza patrones del <strong>tema 6</strong> (patrones cloud). Evita basar toda la respuesta en estilos generales del tema 5 como cliente-servidor, capas o MVC: úsalos solo como contexto, no como patrón principal.</span>
        </div>
        <div className="isa-info" style={{ marginTop: 10 }}>
          <strong>Estrategia principal recomendada:</strong> BFF · Cache Aside · Identidad Federada<br />
          <strong>Alternativas seguras del tema 6:</strong> CDN/Hosting estático · Reintento · Cola de prioridad · Equilibrado basado en colas · Sharding · Gatekeeper · Agente supervisor · Tuberías y filtros
        </div>
      </div>

      {/* Patrón 1: BFF */}
      <div className="ptg-section" style={{ borderLeftColor: 'var(--accent)' }}>
        <div className="ptg-section-title">Patrón 1 · Backend for Frontend (BFF)</div>
        <PatternCard
          icon="🔀"
          name="Backend for Frontend"
          when="Úsalo cuando el enunciado mencione: app web y móvil, distintos tipos de cliente, interfaz para navegador/móvil/escritorio, necesidad de adaptar información según dispositivo o diferentes vistas por plataforma."
          justify="Se utiliza Backend for Frontend porque la aplicación puede ser consumida desde distintos clientes como web y móvil. Cada cliente necesita datos con distinto formato o nivel de detalle. El BFF actúa como una fachada específica para cada frontend, adaptando las respuestas del backend y reduciendo el acoplamiento entre la interfaz y los servicios internos."
          components={[
            'Cliente web / móvil / escritorio',
            'BFF específico por tipo de cliente (BFF-Web, BFF-Mobile…)',
            'Servicios de negocio / API REST',
            'Base de datos o almacenamiento',
          ]}
          diagram={
`[Cliente Web]    ──→  [BFF-Web]  ──┐
[Cliente Móvil]  ──→  [BFF-Mobile] ─┤──→ [Servicios de negocio] ──→ [Base de datos]
[Cliente Desktop]──→  [BFF-Desktop]─┘`
          }
        />
      </div>

      {/* Patrón 2: Cache Aside */}
      <div className="ptg-section" style={{ borderLeftColor: '#10b981' }}>
        <div className="ptg-section-title">Patrón 2 · Cache Aside</div>
        <PatternCard
          icon="⚡"
          name="Cache Aside"
          when="Úsalo cuando el enunciado mencione: búsquedas frecuentes, catálogos, listados, precios, resultados, productos, reservas disponibles o cualquier dato que se consulte mucho y cambie poco."
          justify="Se utiliza Cache Aside para reducir la carga sobre la base de datos y mejorar el tiempo de respuesta en consultas frecuentes. Cuando el usuario solicita datos habituales, el servicio consulta primero la caché. Si el dato está disponible (cache hit), se devuelve directamente. Si no (cache miss), se recupera de la base de datos, se guarda en caché y se devuelve al cliente."
          components={[
            'Cliente o servicio que solicita el dato',
            'Caché (Redis, Memcached o caché en memoria)',
            'Base de datos / almacenamiento persistente',
          ]}
          diagram={
`[Cliente] ──→ [Servicio/API]
                   │
              ┌────▼─────┐
              │  ¿En     │
              │  caché?  │
              └────┬─────┘
           hit ↙       ↘ miss
      [Caché]           [Base de datos]
          ↑_______________|
            (actualiza caché)`
          }
        />
      </div>

      {/* Patrón 3: Identidad Federada */}
      <div className="ptg-section" style={{ borderLeftColor: '#8b5cf6' }}>
        <div className="ptg-section-title">Patrón 3 · Identidad Federada</div>
        <PatternCard
          icon="🔐"
          name="Identidad Federada"
          when="Úsalo cuando el enunciado mencione: usuarios registrados, acceso con Google/Apple/Microsoft/Facebook, app corporativa, autenticación segura o necesidad de no gestionar contraseñas propias."
          justify="Se utiliza Identidad Federada para delegar la autenticación en un proveedor externo de confianza. De este modo, la aplicación no almacena directamente credenciales de usuario y recibe un token seguro que permite identificar al usuario autenticado."
          components={[
            'Usuario (quien inicia sesión)',
            'Aplicación (quien necesita identificar al usuario)',
            'Proveedor de identidad (Google, Apple, Microsoft, Keycloak…)',
            'Servicio de token / STS (emite el JWT o token de acceso)',
            'Token que llega a la aplicación',
          ]}
          diagram={
`[Usuario] ──→ [Aplicación]
                   │ (1) redirige
                   ▼
         [Proveedor de identidad]
                   │ (2) emite token
                   ▼
         [Servicio de token / STS]
                   │ (3) JWT
                   ▼
             [Aplicación] ──→ acceso concedido`
          }
        />
        <div className="isa-warning">
          <span className="isa-warning-icon">⚠️</span>
          <span>No basta con dibujar una caja llamada "Identidad Federada". <strong>Deben aparecer los 4 componentes</strong>: usuario, aplicación, proveedor de identidad y servicio de token.</span>
        </div>
      </div>

      {/* Alternativas */}
      <div className="ptg-section" style={{ borderLeftColor: '#f59e0b' }}>
        <div className="ptg-section-title" style={{ color: '#b45309' }}>Patrones alternativos seguros del tema 6</div>
        <IsaTable
          heads={['Patrón', 'Cuándo usarlo', 'Justificación corta']}
          rows={[
            { cells: ['CDN / Hosting estático', 'Imágenes, vídeos, documentos, recursos pesados', 'Sirve recursos estáticos sin sobrecargar el servidor principal'] },
            { cells: ['Reintento / Retry', 'APIs externas inestables, pagos, servicios de terceros', 'Reintentar operaciones fallidas por errores temporales'] },
            { cells: ['Cola de prioridad', 'Tareas con distinta urgencia o criticidad', 'Las tareas críticas se procesan antes que las ordinarias'] },
            { cells: ['Equilibrado basado en colas', 'Picos de demanda o procesamiento pesado en segundo plano', 'Desacopla recepción de peticiones del procesamiento'] },
            { cells: ['Sharding', 'Gran volumen de datos, muchos usuarios, datos por región', 'Divide la BD en fragmentos para escalar horizontalmente'] },
            { cells: ['Gatekeeper', 'Datos sensibles, acceso a servicios internos', 'Valida peticiones y bloquea accesos no autorizados'] },
            { cells: ['Agente supervisor de estado', 'Monitorización, disponibilidad, alertas de caída', 'Detecta componentes que fallan y activa recuperación'] },
            { cells: ['Tuberías y filtros', 'Procesamiento por etapas, pipelines, transformación de datos', 'Cada etapa realiza una transformación concreta e independiente'] },
          ]}
        />
      </div>

      {/* Tabla de decisión */}
      <div className="ptg-section" style={{ borderLeftColor: '#6366f1' }}>
        <div className="ptg-section-title" style={{ color: '#4f46e5' }}>Tabla de decisión rápida</div>
        <IsaTable heads={decisionTable.heads} rows={decisionTable.rows} />
      </div>

      {/* Respuesta tipo */}
      <Tip>
        Frase modelo de cierre: &ldquo;Para la arquitectura general se propone una solución basada en clientes web/móvil que acceden a un <strong>BFF</strong> que adapta las peticiones de cada cliente. Para mejorar el rendimiento de las consultas frecuentes se aplica <strong>Cache Aside</strong>. La autenticación se delega mediante <strong>Identidad Federada</strong> a un proveedor externo que emite tokens seguros.&rdquo;
      </Tip>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Checklist del apartado 3</div>
        <Checklist items={checklist} />
      </div>
    </>
  );
}

/* ── BLOQUE 4: Diseño detallado del software ─────────────────────────────── */

function Block4() {
  const observerDomains = {
    heads: ['Dominio', 'Sujeto observable', 'Observadores típicos'],
    rows: [
      { cells: ['Reservas', 'GestorReservas', 'NotificadorUsuario, ActualizadorUI, RegistradorLog'] },
      { cells: ['Pedidos', 'GestorPedidos', 'NotificadorCliente, SistemaFacturacion, ActualizadorPantalla'] },
      { cells: ['Stock / catálogo', 'GestorStock', 'PanelTienda, ServicioAlertas, ActualizadorWeb'] },
      { cells: ['Mensajería', 'GestorMensajes', 'NotificadorPush, NotificadorEmail, ActualizadorChat'] },
      { cells: ['Tareas', 'GestorTareas', 'UsuarioAsignado, PanelProyecto, ServicioNotificaciones'] },
    ],
  };

  const singletonDomains = {
    heads: ['Necesidad en la aplicación', 'Clase Singleton'],
    rows: [
      { cells: ['Configuración global de la app', 'ConfiguracionApp'] },
      { cells: ['Sesión del usuario autenticado', 'GestorSesion'] },
      { cells: ['Acceso centralizado a API externa', 'ClienteApi'] },
      { cells: ['Caché local compartida', 'GestorCache'] },
      { cells: ['Servicio de notificaciones', 'ServicioNotificaciones'] },
      { cells: ['Conexión/pool de base de datos', 'GestorConexionBD'] },
    ],
  };

  const alternativesTable = {
    heads: ['Si el enunciado habla de…', 'Usa este patrón', 'Justificación corta'],
    rows: [
      { cells: ['Cambios de estado y avisos a varios componentes', 'Observer', 'Notificar a varios objetos sin acoplarlos al emisor'] },
      { cells: ['Servicio único compartido en toda la app', 'Singleton', 'Garantizar una única instancia y evitar inconsistencias'] },
      { cells: ['Muchos servicios internos complejos', 'Fachada', 'Simplificar el acceso con un único punto de entrada'] },
      { cells: ['API externa con interfaz incompatible', 'Adaptador', 'Traducir la interfaz externa al formato interno'] },
      { cells: ['Estados claros con comportamiento diferente', 'State', 'Evitar grandes estructuras condicionales por estado'] },
      { cells: ['Objetos complejos con muchos parámetros', 'Builder', 'Construir el objeto paso a paso, sin constructor sobrecargado'] },
      { cells: ['Carga costosa o control de acceso', 'Proxy', 'Controlar o diferir el acceso al objeto real'] },
      { cells: ['Jerarquías parte-todo (carpetas, categorías)', 'Composite', 'Tratar igual elementos simples y compuestos'] },
      { cells: ['Muchos objetos que se comunican entre sí', 'Mediator', 'Centralizar la comunicación y reducir acoplamiento'] },
      { cells: ['Algoritmo con pasos fijos y algunos variables', 'Template Method', 'Reutilizar la estructura del proceso con variaciones'] },
      { cells: ['Validaciones o responsables en cadena', 'Chain of Responsibility', 'Pasar la petición por manejadores hasta que uno la procesa'] },
    ],
  };

  const checklist = [
    'Se usan 2 patrones del tema 7 (patrones de diseño de software).',
    'Cada patrón resuelve un problema concreto del dominio de la aplicación.',
    'Los nombres de las clases están adaptados al dominio (no son genéricos: Subject, Observer).',
    'Observer muestra: sujeto con lista de observadores, interfaz Observador y observadores concretos.',
    'Singleton muestra: instancia privada estática, constructor privado y método getInstance().',
    'No se usan patrones cloud del tema 6 en este apartado.',
    'No se copia un diagrama genérico sin adaptarlo al caso concreto del enunciado.',
  ];

  return (
    <>
      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Qué pide este apartado</div>
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65 }}>
          Aplicar <strong style={{ color: 'var(--text)' }}>2 patrones de diseño software</strong> del tema 7 a problemas concretos de la aplicación. Para cada uno se debe mostrar el diagrama y rellenar la tabla con el nombre y el problema que resuelve.
        </p>
        <div className="isa-warning" style={{ marginTop: 12 }}>
          <span className="isa-warning-icon">⚠️</span>
          <span><strong>Importante:</strong> En este apartado no se usan patrones cloud del tema 6. Se piden patrones de diseño detallado del software (tema 7).</span>
        </div>
        <div className="isa-info" style={{ marginTop: 10 }}>
          <strong>Estrategia principal:</strong> Observer + Singleton<br />
          <strong>Alternativas seguras del tema 7:</strong> Fachada · Adaptador · State · Builder · Proxy · Composite · Mediator · Template Method · Chain of Responsibility
        </div>
      </div>

      {/* Patrón 1: Observer */}
      <div className="ptg-section" style={{ borderLeftColor: 'var(--accent)' }}>
        <div className="ptg-section-title">Patrón 1 · Observer (Observador)</div>
        <PatternCard
          icon="👁️"
          name="Observer · Categoría: comportamiento"
          when="Úsalo cuando el enunciado incluya: cambios de estado, notificaciones, reservas que avanzan, pedidos que cambian de fase, mensajes nuevos, stock actualizado, progreso de una tarea o varios elementos que deben reaccionar al mismo cambio."
          justify="Se utiliza Observer porque cuando cambia el estado de una entidad principal, varios componentes deben ser informados. El sujeto mantiene una lista de observadores y los notifica automáticamente, reduciendo el acoplamiento entre quien produce el cambio y quienes reaccionan a él."
          components={[
            'Sujeto/Observable (con lista de observadores y métodos: suscribir, desuscribir, notificar)',
            'Interfaz Observador (con método: actualizar)',
            'Al menos 2 observadores concretos (NotificadorPush, NotificadorEmail, ActualizadorUI…)',
          ]}
          diagram={
`                    <<interface>>
                     Observador
                  + actualizar()
                        ▲
            ┌───────────┼───────────┐
            │           │           │
  [NotificadorPush] [NotificadorEmail] [ActualizadorUI]
  + actualizar()    + actualizar()     + actualizar()

[EntidadObservable]  ←──── notifica a todos los suscritos
  - observadores: List<Observador>
  + suscribir(o)
  + desuscribir(o)
  + notificar()
  + cambiarEstado()`
          }
        />
        <div style={{ marginTop: 12 }}>
          <span className="isa-label">Ejemplos por dominio</span>
          <IsaTable heads={observerDomains.heads} rows={observerDomains.rows} />
        </div>
        <blockquote className="isa-frase" style={{ marginTop: 12 }}>
          <strong>Frase tipo:</strong> &ldquo;El patrón Observer se aplica a [entidad principal]. Cuando [entidad] cambia de estado, el sistema notifica automáticamente a los observadores suscritos, como [observador 1] y [observador 2]. Así se evita que la entidad tenga que conocer directamente todos los componentes que reaccionan al cambio.&rdquo;
        </blockquote>
      </div>

      {/* Patrón 2: Singleton */}
      <div className="ptg-section" style={{ borderLeftColor: '#8b5cf6' }}>
        <div className="ptg-section-title">Patrón 2 · Singleton</div>
        <PatternCard
          icon="🔒"
          name="Singleton · Categoría: creacional"
          when="Úsalo cuando el enunciado incluya: configuración global, gestor de sesión, cliente de API, conexión compartida, caché común, servicio de notificaciones o cualquier recurso que deba ser único en toda la aplicación."
          justify="Se utiliza Singleton para garantizar que solo exista una instancia de un servicio compartido en toda la aplicación. Esto evita inconsistencias, duplicación de conexiones o configuraciones distintas entre módulos."
          components={[
            'Atributo estático privado: instancia (de la propia clase)',
            'Constructor privado (impide la creación externa)',
            'Método estático público: getInstance() que crea o devuelve la instancia',
            'Métodos de negocio propios del servicio',
          ]}
          diagram={
`[GestorSesion]
  - instancia: GestorSesion   ← estático, privado
  - usuario: String
  ────────────────────────────
  - GestorSesion()             ← constructor privado
  + getInstance(): GestorSesion ← estático, público
  + obtenerUsuarioActual(): String
  + cerrarSesion()`
          }
        />
        <div style={{ marginTop: 12 }}>
          <span className="isa-label">Ejemplos por dominio</span>
          <IsaTable heads={singletonDomains.heads} rows={singletonDomains.rows} />
        </div>
        <blockquote className="isa-frase" style={{ marginTop: 12 }}>
          <strong>Frase tipo:</strong> &ldquo;El patrón Singleton se aplica a [clase]. Esta clase gestiona [recurso compartido], por lo que debe existir una única instancia durante la ejecución. El acceso se realiza mediante getInstance(), evitando estados duplicados o inconsistentes en cualquier módulo de la aplicación.&rdquo;
        </blockquote>
      </div>

      {/* Tabla de alternativas */}
      <div className="ptg-section" style={{ borderLeftColor: '#f59e0b' }}>
        <div className="ptg-section-title" style={{ color: '#b45309' }}>Patrones alternativos del tema 7</div>
        <IsaTable heads={alternativesTable.heads} rows={alternativesTable.rows} />
      </div>

      {/* Respuesta tipo */}
      <Tip>
        Frase modelo de cierre: &ldquo;En el diseño detallado se aplican dos patrones. <strong>Observer</strong> sobre [entidad], ya que cuando cambia su estado deben reaccionar [observador 1] y [observador 2] de forma desacoplada. <strong>Singleton</strong> sobre [servicio], garantizando una única instancia para gestionar [recurso] desde cualquier módulo de la aplicación.&rdquo;
      </Tip>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Checklist del apartado 4</div>
        <Checklist items={checklist} />
      </div>
    </>
  );
}

/* ── Componente principal ─────────────────────────────────────────────────── */

export default function IsaExamPrep() {
  return (
    <section className="isa-prep" aria-label="Preparación examen ISA — desarrollo">
      <div className="isa-prep-header">
        <div className="isa-prep-icon" aria-hidden="true">📋</div>
        <div>
          <div className="isa-prep-title">Preparación examen</div>
          <div className="isa-prep-subtitle">
            Estrategia para los 4 apartados del ejercicio de desarrollo · 7 puntos en total
          </div>
        </div>
      </div>

      <div className="ptg-list">
        <AccordionBlock
          id="hu"
          icon="👥"
          title="Usuarios y pila de producto"
          points="Apartado 1 · 1 punto"
        >
          <Block1 />
        </AccordionBlock>

        <AccordionBlock
          id="scrum"
          icon="⚡"
          title="Equipo Scrum y Sprint Backlog"
          points="Apartado 2 · 2 puntos"
        >
          <Block2 />
        </AccordionBlock>

        <AccordionBlock
          id="arquitectura"
          icon="🏗️"
          title="Diseño arquitectónico general con patrones"
          points="Apartado 3 · 2 puntos"
        >
          <Block3 />
        </AccordionBlock>

        <AccordionBlock
          id="diseno"
          icon="🧩"
          title="Diseño detallado del software con patrones"
          points="Apartado 4 · 2 puntos"
        >
          <Block4 />
        </AccordionBlock>
      </div>
    </section>
  );
}
