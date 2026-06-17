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
        <li key={i}><span className="te-prep-check">✓</span>{item}</li>
      ))}
    </ul>
  );
}

function ErrorList({ items }) {
  return (
    <ul className="te-prep-checklist">
      {items.map((item, i) => (
        <li key={i}><span className="te-prep-xmark">✗</span>{item}</li>
      ))}
    </ul>
  );
}

function ModelChips({ models }) {
  return (
    <div className="te-prep-chips">
      {models.map((m, i) => <span key={i} className="te-prep-chip">{m}</span>)}
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

function Rule({ label, children }) {
  return (
    <div className="te-prep-rule">
      <div className="te-prep-rule-label">{label}</div>
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

/* ── BLOQUE 1: IoT + wearables terrestres ────────────────────────────────── */

function Block1() {
  return (
    <>
      <Section title="Cómo reconocerlo en el enunciado" color="#E07B39">
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Palabras clave que identifican este tipo:
        </p>
        <BadgeList badges={[
          'salud', 'fatiga', 'rendimiento', 'esfuerzo', 'actividad física',
          'biométrico', 'entrenamiento', 'pulsera', 'wearable', 'monitorizar',
          'jugadores', 'princesas', 'estilo de vida', 'parámetros físicos',
        ]} />
      </Section>

      <Section title="Casos detectados en el banco" color="#3b82f6">
        <div style={{ marginBottom: 6, fontSize: 12.5, color: 'var(--text-muted)' }}>
          Equipo de fútbol:
        </div>
        <ModelChips models={['2023 Modelo A', '2023 Modelo C', '2023 Modelo D']} />
        <div style={{ margin: '10px 0 6px', fontSize: 12.5, color: 'var(--text-muted)' }}>
          Princesas Disney (Ariel, Rapunzel…):
        </div>
        <ModelChips models={['2024 Modelo B']} />
        <Info style={{ marginTop: 10 }}>
          <strong>Qué pide el enunciado:</strong> Proponer una solución IoT que monitorice parámetros biométricos
          (frecuencia cardíaca, temperatura, esfuerzo, fatiga, actividad) de personas en entorno terrestre normal.
          Se pide describir dispositivos, tecnologías, funcionalidades y limitaciones.
        </Info>
      </Section>

      <Section title="Estructura de respuesta recomendada" color="#10b981">
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          <li><strong style={{ color: 'var(--text)' }}>Introducción contextualizada</strong> — adapta el inicio al dominio concreto del enunciado.</li>
          <li><strong style={{ color: 'var(--text)' }}>Dispositivos necesarios</strong> — lista con función de cada uno.</li>
          <li><strong style={{ color: 'var(--text)' }}>Tecnologías de comunicación</strong> — qué protocolo usa cada enlace.</li>
          <li><strong style={{ color: 'var(--text)' }}>Funcionalidades por dispositivo</strong> — qué mide o hace cada uno.</li>
          <li><strong style={{ color: 'var(--text)' }}>Funcionamiento general</strong> — flujo completo del dato.</li>
          <li><strong style={{ color: 'var(--text)' }}>Datos obtenidos</strong> — qué información recoge el sistema.</li>
          <li><strong style={{ color: 'var(--text)' }}>Seguridad y privacidad</strong> — datos biométricos = datos sensibles.</li>
          <li><strong style={{ color: 'var(--text)' }}>Limitaciones y problemas</strong> — batería, precisión, coste…</li>
          <li><strong style={{ color: 'var(--text)' }}>Cierre</strong> — resume el valor de la solución.</li>
        </ol>
      </Section>

      <Section title="Dispositivos recomendados" color="#8b5cf6">
        <Table
          heads={['Dispositivo', 'Función principal']}
          rows={[
            ['Pulsera / reloj inteligente', 'Wearable principal; recoge señales biométricas de forma continua'],
            ['Sensor de frec. cardíaca', 'Monitoriza el ritmo cardíaco en tiempo real'],
            ['Sensor de temperatura corporal', 'Detecta fiebre o sobrecalentamiento'],
            ['Oxímetro (SpO₂)', 'Mide saturación de oxígeno en sangre'],
            ['Acelerómetro', 'Detecta movimiento, pasos, impactos y caídas'],
            ['Giroscopio', 'Mide orientación y rotación del cuerpo'],
            ['Smartphone del usuario', 'Pasarela entre wearable y servidor; muestra alertas'],
            ['Hub/tablet local (staff técnico)', 'Agrega datos de varios wearables; panel en tiempo real'],
            ['Servidor / cloud', 'Almacena histórico, ejecuta análisis y envía alertas'],
          ]}
        />
      </Section>

      <Section title="Tecnologías de comunicación" color="#E07B39">
        <Table
          heads={['Enlace', 'Tecnología', 'Por qué']}
          rows={[
            ['Wearable → Smartphone', 'BLE (Bluetooth Low Energy)', 'Bajo consumo, corto alcance, ideal para wearables'],
            ['Smartphone → Servidor', 'WiFi / 4G / 5G', 'Conectividad de área amplia, alta capacidad de datos'],
            ['Hub → Servidor', 'WiFi / Ethernet', 'Conexión estable en instalación fija'],
            ['Localización exterior', 'GNSS (GPS, Galileo…)', 'Solo si el enunciado pide geolocalización'],
            ['Baja latencia / sin cloud', 'Edge Computing', 'Procesar en hub local si se requiere respuesta inmediata'],
          ]}
        />
      </Section>

      <Section title="Limitaciones a mencionar siempre" color="#ef4444">
        <BadgeList badges={[
          'Batería limitada', 'Privacidad de datos biométricos', 'Falsos positivos',
          'Conectividad variable', 'Coste de dispositivos', 'Mantenimiento',
          'Precisión de sensores', 'Confort y adherencia del usuario',
        ]} variant="red" />
      </Section>

      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Frase modelo de apertura</div>
        <Frase>
          &ldquo;Para abordar este reto se propone una solución IoT basada en dispositivos wearables que permiten
          monitorizar de forma <strong>continua y no intrusiva</strong> los parámetros biométricos y de actividad
          de cada usuario, transmitiendo los datos en tiempo real al sistema de análisis para generar alertas
          y registrar el histórico de rendimiento.&rdquo;
        </Frase>
      </div>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Errores a evitar</div>
        <ErrorList items={[
          'Listar dispositivos sin explicar cómo se comunican entre sí.',
          'No mencionar BLE para el enlace wearable → smartphone.',
          'Olvidar la privacidad y protección de datos biométricos.',
          'No mencionar la batería como limitación.',
          'Copiar la misma introducción genérica sin adaptarla al dominio (fútbol, salud, Disney…).',
          'Proponer GNSS sin que el enunciado pida localización exterior.',
        ]} />
      </div>
    </>
  );
}

/* ── BLOQUE 2: IoT + entorno acuático ───────────────────────────────────── */

function Block2() {
  return (
    <>
      <Section title="Cómo reconocerlo en el enunciado" color="#E07B39">
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Palabras clave que identifican este tipo:
        </p>
        <BadgeList badges={[
          'agua', 'mar', 'océano', 'submarino', 'fondo del mar',
          'Fondo de Bikini', 'Ariel', 'Atlántica', 'medusas',
          'crustáceo', 'profundidad', 'marina', 'acuático', 'buceo',
        ]} />
      </Section>

      <Section title="Casos detectados en el banco" color="#3b82f6">
        <div style={{ marginBottom: 6, fontSize: 12.5, color: 'var(--text-muted)' }}>
          Crustáceo Crujiente (Fondo de Bikini):
        </div>
        <ModelChips models={['2024 Modelo A', '2024 Modelo D']} />
        <div style={{ margin: '10px 0 6px', fontSize: 12.5, color: 'var(--text-muted)' }}>
          Caza de medusas (Fondo de Bikini):
        </div>
        <ModelChips models={['2025 Modelo A']} />
        <div style={{ margin: '10px 0 6px', fontSize: 12.5, color: 'var(--text-muted)' }}>
          Ariel en el reino de Atlántica:
        </div>
        <ModelChips models={['2025 Modelo B', '2025 Modelo F']} />
      </Section>

      <Section title="Diferencia clave respecto al Tipo 1" color="#ef4444">
        <Warning>
          <strong>GNSS no funciona bajo el agua.</strong> Las señales GPS/Galileo/GLONASS no penetran en el agua
          de forma útil. Solo puede usarse GNSS en superficie. Bajo el agua hay que recurrir a sensores de profundidad,
          balizas acústicas o comunicación por ultrasonidos.
        </Warning>
        <div style={{ marginTop: 10 }}>
          <Warning>
            <strong>BLE y WiFi se atenúan gravemente en agua</strong>, especialmente en agua salada.
            No proponer BLE ni WiFi como comunicación principal bajo el agua.
          </Warning>
        </div>
      </Section>

      <Section title="Tecnologías: válidas vs. problemáticas" color="#8b5cf6">
        <div className="te-prep-tech-grid">
          <div className="te-prep-tech-ok">
            <div className="te-prep-tech-label">Válidas bajo el agua</div>
            <ul className="te-prep-tech-items">
              <li>Ultrasonidos / comunicación acústica</li>
              <li>Balizas acústicas</li>
              <li>Sensores de presión y profundidad</li>
              <li>Almacenamiento local + sincronización posterior</li>
              <li>GNSS en superficie únicamente</li>
              <li>Edge computing en dispositivo o hub</li>
            </ul>
          </div>
          <div className="te-prep-tech-no">
            <div className="te-prep-tech-label">Problemáticas / evitar sin matizar</div>
            <ul className="te-prep-tech-items">
              <li>GNSS bajo el agua</li>
              <li>BLE bajo el agua (alta atenuación)</li>
              <li>WiFi bajo el agua (alta atenuación)</li>
              <li>4G/5G bajo el agua</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Dispositivos recomendados" color="#10b981">
        <Table
          heads={['Dispositivo', 'Requisito especial', 'Función']}
          rows={[
            ['Brazalete / reloj estanco', 'IP68 o equivalente', 'Wearable principal; biométrica acuática'],
            ['Sensor de presión / profundidad', 'Resistente a la presión', 'Mide profundidad y alerta por buceo excesivo'],
            ['Sensores biométricos protegidos', 'Sellado hermético', 'FC, temperatura, SpO₂'],
            ['Aletas / plantillas inteligentes', 'Materiales resistentes', 'Detectar esfuerzo, patada, propulsión'],
            ['Baliza acústica', 'Diseñada para agua', 'Comunicación de posición submarina'],
            ['Hub / boya en superficie', 'Zona segura con cobertura', 'Centraliza datos; relay hacia la nube'],
            ['Smartphone / consola', 'Cuando hay cobertura (superficie)', 'Visualizar datos tras sincronización'],
          ]}
        />
      </Section>

      <Section title="Limitaciones específicas del entorno acuático" color="#ef4444">
        <BadgeList badges={[
          'Corrosión por agua salada', 'Presión hidrostática', 'Estanqueidad IP68',
          'Batería limitada', 'Pérdida de señal inalámbrica', 'Mantenimiento difícil',
          'Coste de dispositivos específicos', 'Falsos positivos por corrientes o golpes',
        ]} variant="red" />
      </Section>

      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Frase modelo de apertura</div>
        <Frase>
          &ldquo;En un entorno submarino, la arquitectura IoT debe adaptarse a las <strong>limitaciones de
          propagación de las señales inalámbricas</strong>. El GNSS solo se usará en superficie; bajo el agua
          se recurrirá a sensores de profundidad, balizas acústicas o comunicación por ultrasonidos,
          y los datos biométricos se almacenarán localmente hasta que haya cobertura para sincronizarlos.&rdquo;
        </Frase>
      </div>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Errores a evitar</div>
        <ErrorList items={[
          'Decir que GPS/GNSS funciona perfectamente bajo el agua (error crítico).',
          'Proponer BLE o WiFi como comunicación principal bajo el agua sin matizar.',
          'No mencionar estanqueidad (IP68 o equivalente) en los dispositivos.',
          'Olvidar el problema de la corrosión en entorno marino.',
          'No explicar cómo se sincronizan los datos cuando hay cobertura.',
        ]} />
      </div>
    </>
  );
}

/* ── BLOQUE 3: IoT + entorno espacial/extremo ────────────────────────────── */

function Block3() {
  return (
    <>
      <Section title="Cómo reconocerlo en el enunciado" color="#E07B39">
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Palabras clave que identifican este tipo:
        </p>
        <BadgeList badges={[
          'espacio', 'galaxia', 'misión', 'armadura', 'casco', 'traje',
          'mandalorianos', 'entorno extremo', 'sin infraestructura',
          'largo alcance', 'campo de batalla', 'nave', 'hostil',
        ]} />
      </Section>

      <Section title="Casos detectados en el banco" color="#3b82f6">
        <div style={{ marginBottom: 6, fontSize: 12.5, color: 'var(--text-muted)' }}>
          Mandalorianos (cazarrecompensas, armadura beskar):
        </div>
        <ModelChips models={['2025 Modelo C', '2025 Modelo D']} />
        <Info>
          <strong>Qué pide el enunciado:</strong> Proponer solución IoT integrada en equipamiento (armadura, casco, traje)
          que funcione en entorno con conectividad limitada o inexistente, con condiciones ambientales extremas
          (radiación, temperatura, interferencias).
        </Info>
      </Section>

      <Section title="Clave diferencial: Edge Computing obligatorio" color="#ef4444">
        <Warning>
          En un entorno sin infraestructura de red, <strong>no hay cloud disponible en tiempo real</strong>.
          El procesamiento debe hacerse en local (en la armadura, en el casco o en un hub de la nave).
          Es el caso de uso perfecto para Edge Computing.
        </Warning>
      </Section>

      <Section title="Dispositivos recomendados" color="#10b981">
        <Table
          heads={['Dispositivo', 'Función']}
          rows={[
            ['Sensores integrados en armadura', 'Temperatura, impacto, esfuerzo, integridad estructural'],
            ['Guantelete / brazalete biométrico', 'FC, SpO₂, temperatura corporal del combatiente'],
            ['Casco con HUD (Heads-Up Display)', 'Mostrar alertas, mapas y estado vital en tiempo real'],
            ['Botas con sensores de presión/impacto', 'Detectar caídas, terreno o esfuerzo de desplazamiento'],
            ['IMU (unidad de medición inercial)', 'Acelerómetro + giroscopio integrado en armadura'],
            ['Hub en nave / base de operaciones', 'Agrega datos locales; comunica con unidades cercanas'],
            ['Sistema de com. local (radio / mesh)', 'Enlace entre unidades del grupo sin necesidad de red externa'],
          ]}
        />
      </Section>

      <Section title="Tecnologías de comunicación" color="#8b5cf6">
        <Table
          heads={['Enlace', 'Tecnología', 'Por qué']}
          rows={[
            ['Sensores → casco/hub', 'BLE / radio de corto alcance', 'Bajo consumo; dentro de la armadura'],
            ['Unidad → nave/base', 'Radio táctica o mesh', 'Funciona sin infraestructura; alcance medio'],
            ['Unidad → unidades vecinas', 'Red mesh local', 'Comunicación directa sin central'],
            ['Base → mando remoto', 'Comunicación satelital', 'Solo si existe infraestructura disponible'],
            ['Procesamiento en local', 'Edge computing (CPU en casco o hub)', 'Baja latencia; sin dependencia de cloud'],
          ]}
        />
      </Section>

      <Section title="Limitaciones específicas del entorno extremo" color="#ef4444">
        <BadgeList badges={[
          'GNSS no garantizado', 'Radiación', 'Temperaturas extremas',
          'Pérdida de señal (jamming)', 'Energía muy limitada', 'Mantenimiento difícil en campo',
          'Seguridad de la información crítica', 'Coste de componentes resistentes',
        ]} variant="red" />
      </Section>

      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Frase modelo de apertura</div>
        <Frase>
          &ldquo;En un entorno extremo o espacial, la solución debe ser capaz de funcionar incluso
          <strong> sin conectividad permanente</strong>, por lo que parte del procesamiento se realiza
          mediante edge computing en la propia armadura o equipo del usuario. Los datos biométricos y
          de actividad se procesan localmente para generar alertas inmediatas y se sincronizan con la
          nave o base cuando se establece conexión.&rdquo;
        </Frase>
      </div>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Errores a evitar</div>
        <ErrorList items={[
          'Proponer cloud en tiempo real sin considerar la falta de conectividad.',
          'Asumir que GNSS funciona en cualquier entorno espacial o subterráneo.',
          'No mencionar Edge Computing como solución a la falta de infraestructura.',
          'Olvidar la radiación y las temperaturas extremas como limitación de los sensores.',
          'Proponer una arquitectura idéntica a la del Tipo 1 sin adaptarla al contexto hostil.',
        ]} />
      </div>
    </>
  );
}

/* ── BLOQUE 4: LBS + flota de vehículos ─────────────────────────────────── */

function Block4() {
  return (
    <>
      <Section title="Cómo reconocerlo en el enunciado" color="#E07B39">
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Palabras clave que identifican este tipo:
        </p>
        <BadgeList badges={[
          'flota', 'vehículos', 'vigilantes', 'ubicación en tiempo real',
          'incidencia', 'ruta', 'más cercano', 'mapa', 'seguridad',
          'ACME', 'desierto', 'personal', 'rondas', 'asignar',
        ]} />
      </Section>

      <Section title="Casos detectados en el banco" color="#3b82f6">
        <div style={{ marginBottom: 6, fontSize: 12.5, color: 'var(--text-muted)' }}>
          Empresa de seguridad, 15 vehículos:
        </div>
        <ModelChips models={['2023 Modelo B']} />
        <div style={{ margin: '10px 0 6px', fontSize: 12.5, color: 'var(--text-muted)' }}>
          Desierto de ACME (Coyote / Correcaminos):
        </div>
        <ModelChips models={['2024 Modelo C Ext']} />
        <Info>
          <strong>Qué pide el enunciado:</strong> Diseñar una solución LBS con app móvil que permita
          visualizar en tiempo real la posición de vehículos y personal, y asignar el recurso más cercano
          ante una incidencia.
        </Info>
      </Section>

      <Section title="Servicios LBS a incluir" color="#10b981">
        <Table
          heads={['Servicio', 'Para qué sirve en este caso']}
          rows={[
            ['LBS (Location-Based Services)', 'Núcleo de la solución; todo el sistema orbita alrededor de la localización'],
            ['GNSS (GPS, Galileo, GLONASS, BeiDou)', 'Posición de vehículos y smartphones en exterior'],
            ['Geofencing', 'Zonas de seguridad; alerta cuando un recurso entra/sale de un área'],
            ['Mapas en tiempo real', 'Visualizar posiciones en panel central y en app'],
            ['Cálculo del recurso más cercano', 'Asignación inteligente del vehículo/vigilante más próximo a la incidencia'],
            ['Histórico de rutas', 'Auditoría, rondas realizadas, tiempos de respuesta'],
          ]}
        />
      </Section>

      <Section title="Dispositivos recomendados" color="#8b5cf6">
        <Table
          heads={['Dispositivo', 'Función']}
          rows={[
            ['Smartphone del vigilante (con app)', 'Reportar posición; recibir asignaciones; enviar incidencias'],
            ['GPS/GNSS embarcado en vehículo', 'Posición precisa del vehículo en tiempo real'],
            ['Tablet / terminal embarcado', 'Panel de información en el vehículo; navegación'],
            ['Servidor central', 'Agrega posiciones; calcula asignaciones; almacena histórico'],
            ['Dashboard de operaciones', 'Panel visual para el centro de control; mapa con todo en tiempo real'],
          ]}
        />
      </Section>

      <Section title="Tipo de app recomendado" color="#E07B39">
        <div className="te-prep-info">
          <strong>App nativa</strong> cuando se necesite:
          <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 12.5, lineHeight: 1.8, color: 'var(--text-muted)' }}>
            <li>GPS continuo y uso en segundo plano</li>
            <li>Notificaciones push de incidencias</li>
            <li>Acceso a sensores del dispositivo</li>
            <li>Mapas integrados con alta fluidez</li>
            <li>Alto rendimiento y fiabilidad en campo</li>
          </ul>
        </div>
        <Frase style={{ marginTop: 10 }}>
          &ldquo;Se recomienda una <strong>app nativa</strong> porque la aplicación necesita acceso continuo al GPS en
          segundo plano, integración con notificaciones push y un rendimiento óptimo para mostrar mapas en tiempo real
          con la posición de todos los recursos de la flota.&rdquo;
        </Frase>
      </Section>

      <Section title="Funcionalidades de la app" color="#10b981">
        <Checklist items={[
          'Ver en mapa la posición de todos los vehículos y vigilantes en tiempo real.',
          'Asignar incidencia al recurso más cercano disponible.',
          'Crear y gestionar zonas de seguridad (geofencing).',
          'Recibir alertas cuando un recurso entra o sale de una zona.',
          'Consultar el histórico de rutas y rondas realizadas.',
          'Enviar y recibir partes de incidencia.',
          'Navegación GPS hasta el punto de la incidencia.',
          'Panel web de operaciones para el centro de control.',
        ]} />
      </Section>

      <Section title="Privacidad y limitaciones" color="#ef4444">
        <BadgeList badges={[
          'Consentimiento de los trabajadores', 'Uso limitado a horario laboral',
          'Cifrado de las comunicaciones', 'Control de acceso al panel',
          'Precisión GNSS variable', 'Batería del smartphone',
          'Cobertura móvil en zonas remotas',
        ]} variant="red" />
        <Warning style={{ marginTop: 10 }}>
          Los datos de localización de empleados son datos personales. Es obligatorio el consentimiento,
          informar del uso y limitar la recogida al horario laboral.
        </Warning>
      </Section>

      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">Frase modelo de apertura</div>
        <Frase>
          &ldquo;Se propone una <strong>aplicación móvil nativa basada en servicios de localización (LBS)</strong>
          que permita visualizar en tiempo real la posición de vehículos y personal de vigilancia, facilitando
          la asignación automática del recurso más cercano ante una incidencia y el control de las rondas
          desde un panel central de operaciones.&rdquo;
        </Frase>
      </div>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Errores a evitar</div>
        <ErrorList items={[
          'No justificar por qué se elige app nativa frente a híbrida o web.',
          'Olvidar el GPS embarcado en el vehículo (no solo el smartphone).',
          'No mencionar geofencing ni cálculo del recurso más cercano.',
          'Ignorar la privacidad laboral y el consentimiento de los trabajadores.',
          'Proponer IoT o wearables biométricos si el enunciado solo pide localización de vehículos.',
        ]} />
      </div>
    </>
  );
}

/* ── BLOQUE 5: Preguntas teóricas cortas ─────────────────────────────────── */

function Block5() {
  const estructura = [
    '1. Definición clara y concisa.',
    '2. Explicación técnica (cómo funciona, de qué se trata).',
    '3. Ejemplo concreto y relacionado.',
    '4. Ventaja / inconveniente si el enunciado lo pide explícitamente.',
    '5. Cierre en una frase.',
  ];

  return (
    <>
      <Section title="Cómo reconocerlo en el enunciado" color="#E07B39">
        <BadgeList badges={[
          '"¿Qué se entiende por…?"',
          '"Indica una ventaja…"',
          '"Indica un inconveniente…"',
          '"Define…"',
          '"Explica…"',
          '"¿Qué impacto tiene…?"',
        ]} />
        <Info style={{ marginTop: 10 }}>
          Estas preguntas suelen ser de <strong>15 líneas</strong> orientativas. Se puntúan con 1-1,5 puntos
          sobre el total del caso práctico. No es necesario extenderse; lo importante es ser preciso.
        </Info>
      </Section>

      <Section title="Estructura de respuesta" color="#10b981">
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
          {estructura.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </Section>

      <Section title="Minirespuestas preparadas" color="#8b5cf6">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QA
            question="¿Qué se entiende por beacon o baliza?"
            answer='Un beacon o baliza es un pequeño dispositivo que emite periódicamente una señal inalámbrica, habitualmente mediante BLE (Bluetooth Low Energy), para que una aplicación móvil pueda detectar su proximidad. Se utiliza especialmente en interiores, donde GNSS no ofrece buena precisión, y permite activar servicios contextuales: información de una zona, guiado en edificios o control de presencia. Su principal ventaja es el bajo consumo energético; su principal limitación es el alcance reducido (unos 10-30 m).'
          />
          <QA
            question="Indica una ventaja y un inconveniente de las aplicaciones híbridas."
            answer='Una aplicación híbrida se desarrolla con tecnologías web (HTML, CSS, JS) empaquetadas dentro de una capa nativa que permite distribuirla en las tiendas de aplicaciones. Ventaja: permite reutilizar el mismo código para iOS, Android y web, reduciendo el coste y el tiempo de desarrollo. Inconveniente: el rendimiento es inferior al de una app nativa, especialmente en operaciones intensivas como gráficos, acceso continuo al GPS o uso de sensores en segundo plano.'
          />
          <QA
            question="¿Qué se entiende por realidad virtual? Indica un ejemplo."
            answer='La realidad virtual (VR) es una tecnología que genera un entorno digital tridimensional e inmersivo con el que el usuario puede interactuar en tiempo real, sustituyendo completamente su percepción del entorno físico. Requiere un dispositivo de visualización específico, como un casco o visor VR. Ejemplo: simuladores de entrenamiento militar o quirúrgico, en los que el usuario practica procedimientos en un entorno seguro antes de realizarlos en la realidad.'
          />
          <QA
            question="¿Qué se entiende por Edge Computing? Indica una ventaja."
            answer='Edge Computing es una arquitectura en la que el procesamiento de datos se realiza cerca del lugar donde se generan — en el propio dispositivo, wearable, hub local o pasarela — en lugar de enviarlos siempre a un servidor centralizado en la nube. Su principal ventaja es la reducción de la latencia, lo que lo hace especialmente útil en aplicaciones IoT que requieren alertas en tiempo real o que operan con conectividad limitada o intermitente.'
          />
          <QA
            question="¿Qué se entiende por servicios basados en localización (LBS)?"
            answer='Los servicios basados en localización (LBS, Location-Based Services) son servicios digitales que utilizan la posición geográfica del usuario o del dispositivo para ofrecer información o funcionalidades adaptadas a dicha ubicación. Se apoyan en tecnologías como GNSS (GPS, Galileo), redes móviles, WiFi o beacons. Ejemplos de uso: navegación GPS, búsqueda de negocios cercanos, seguimiento de flotas o geofencing.'
          />
          <QA
            question="Indica dos inconvenientes de los sistemas GNSS."
            answer='1. No funcionan correctamente en interiores ni bajo el agua: las señales de satélite son bloqueadas por techos, muros o el agua, lo que limita su uso a exteriores con buena visibilidad del cielo. 2. Precisión variable y dependencia de condiciones atmosféricas: la ionosfera, la troposfera y la presencia de obstáculos (edificios altos, vegetación densa) pueden degradar la precisión de la posición hasta varios metros.'
          />
          <QA
            question="¿Qué se entiende por CPU de un dispositivo móvil? ¿Qué impacto tiene?"
            answer='La CPU (Unidad Central de Procesamiento) de un dispositivo móvil es el componente encargado de ejecutar las instrucciones del sistema operativo y las aplicaciones. En dispositivos móviles actuales se implementa como un SoC (System on a Chip) que integra también GPU, memoria, módem y otros controladores. Su impacto sobre el funcionamiento general es determinante: una CPU más potente permite mayor fluidez en la interfaz, mejor rendimiento en aplicaciones intensivas (mapas, realidad aumentada, IA local) y mayor velocidad de respuesta; sin embargo, también supone mayor consumo de batería si no se gestiona correctamente la eficiencia energética.'
          />
        </div>
      </Section>

      <div className="ptg-section ptg-section-errores">
        <div className="ptg-section-title">Errores a evitar</div>
        <ErrorList items={[
          'Dar solo la definición sin ejemplo ni explicación técnica.',
          'Extenderse más de 15-20 líneas: concisión es clave.',
          'Copiar definiciones de manual sin adaptarlas al lenguaje propio.',
          'No responder el elemento que pide el enunciado (p. ej., pide inconveniente y das ventaja).',
        ]} />
      </div>
    </>
  );
}

/* ── BLOQUE 6: Estructura universal IoT ──────────────────────────────────── */

function Block6() {
  const pasos = [
    { n: 1, titulo: 'Introducción contextualizada', desc: 'No empieces con "la solución IoT propuesta...". Empieza adaptando el contexto: "En el entorno de [caso], los principales retos son..."' },
    { n: 2, titulo: 'Dispositivos', desc: 'Lista los dispositivos. Para cada uno: nombre + función específica en el caso. No listas genéricas.' },
    { n: 3, titulo: 'Tecnologías de comunicación', desc: 'Para cada enlace del sistema especifica el protocolo: BLE, WiFi, 4G, GNSS, ultrasonidos… y justifica brevemente la elección.' },
    { n: 4, titulo: 'Funcionalidades', desc: 'Qué puede hacer el sistema: alertas, histórico, dashboard, geofencing, asignación, notificaciones…' },
    { n: 5, titulo: 'Funcionamiento general', desc: 'Flujo del dato de principio a fin: sensor → pasarela → servidor → usuario. 3-4 líneas.' },
    { n: 6, titulo: 'Datos obtenidos', desc: 'Qué información recoge el sistema: FC, temperatura, posición, SpO₂, profundidad, impacto…' },
    { n: 7, titulo: 'Seguridad y privacidad', desc: 'Datos biométricos y de localización son sensibles. Menciona: cifrado, consentimiento, control de acceso, cumplimiento RGPD.' },
    { n: 8, titulo: 'Limitaciones y problemas', desc: 'Batería, conectividad, coste, mantenimiento, precisión, estanqueidad (si aplica), falsos positivos.' },
    { n: 9, titulo: 'Cierre', desc: 'Frase de valor: qué aporta la solución al problema planteado en el enunciado.' },
  ];

  return (
    <>
      <div className="ptg-section ptg-section-plantilla">
        <div className="ptg-section-title">La plantilla de los 9 pasos</div>
        <div className="te-prep-info">
          <strong>La clave es no responder de forma genérica:</strong> hay que adaptar la arquitectura IoT
          al contexto concreto del enunciado. La estructura es siempre la misma; el contenido cambia según el tipo.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pasos.map(p => (
          <div key={p.n} style={{
            display: 'flex', gap: 12, padding: '11px 14px',
            border: '1px solid rgba(214,196,164,0.6)', borderRadius: 13,
            background: 'rgba(255,255,255,0.7)',
          }}>
            <div style={{
              flexShrink: 0, width: 28, height: 28,
              borderRadius: 8, background: 'linear-gradient(180deg,#fff,rgba(224,123,57,0.1))',
              border: '1px solid rgba(224,123,57,0.22)', display: 'grid',
              placeItems: 'center', fontWeight: 800, fontSize: 13, color: '#b85a1a',
            }}>
              {p.n}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 750, fontSize: 13, color: 'var(--text)', marginBottom: 3 }}>
                {p.titulo}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {p.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ptg-section ptg-section-plantilla" style={{ marginTop: 4 }}>
        <div className="ptg-section-title">Arquitectura IoT básica memorizable</div>
        <pre className="ptg-ejemplo-diagrama">
          {`Wearable/Sensor → [BLE] → Smartphone/Hub → [WiFi / 4G / 5G] → Cloud/Servidor → Dashboard/Alertas
                                    ↑                       ↑
                              (Edge local)          (Histórico y análisis)`}
        </pre>
      </div>
    </>
  );
}

/* ── BLOQUE 7: Errores que más penalizan ─────────────────────────────────── */

function Block7() {
  const errores = [
    { e: 'Usar GNSS bajo el agua sin matizar.', d: 'Las señales GPS/Galileo no penetran en el agua. Error técnico grave.' },
    { e: 'Usar BLE o WiFi bajo el agua sin explicar sus limitaciones.', d: 'Ambos se atenúan drásticamente en agua, especialmente salada.' },
    { e: 'No explicar cómo se comunican los dispositivos.', d: 'Sin protocolo de comunicación no hay arquitectura IoT real.' },
    { e: 'Listar dispositivos sin relacionarlos con una funcionalidad.', d: 'Cada dispositivo debe justificarse con su función concreta.' },
    { e: 'Olvidar privacidad y protección de datos.', d: 'Datos biométricos y de localización son datos sensibles (RGPD).' },
    { e: 'No mencionar la batería como limitación.', d: 'Todos los wearables tienen batería limitada. Es una limitación ineludible.' },
    { e: 'No adaptar la respuesta al contexto del enunciado.', d: 'La misma respuesta copiada para fútbol y para Mandalorianos no vale.' },
    { e: 'Proponer blockchain, ADAS u otros temas sin que el enunciado los pida.', d: 'Incluir tecnologías no pedidas puede interpretarse como relleno y penalizar.' },
    { e: 'No justificar el tipo de app cuando el enunciado lo solicita.', d: 'Si pide app, hay que decir si es nativa, híbrida o web y por qué.' },
    { e: 'Hacer una lista sin explicar el funcionamiento global del sistema.', d: 'El examinador quiere ver que entiendes el flujo completo del dato.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {errores.map((item, i) => (
        <div key={i} className="te-prep-warning" style={{ flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span className="te-prep-warning-icon">✗</span>
            <strong style={{ fontSize: 13 }}>{item.e}</strong>
          </div>
          <div style={{ paddingLeft: 26, fontSize: 12.5, color: 'var(--text-muted)' }}>
            {item.d}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── BLOQUE 8: Lo que tengo que saber escribir sin pensar ────────────────── */

function Block8() {
  return (
    <>
      <Rule label="Arquitectura IoT básica">
        {`Wearable → [BLE] → Smartphone/Hub → [WiFi / 4G / 5G] → Cloud → Dashboard/Alertas`}
      </Rule>

      <Rule label="Regla acuática">
        {`GNSS: solo en superficie.
BLE / WiFi / 4G: no funcionan bien bajo el agua.
Alternativas: sensores de presión · balizas acústicas · ultrasonidos · almacenamiento local + sync posterior.`}
      </Rule>

      <Rule label="Regla espacial / extremo">
        {`Conectividad no garantizada → Edge Computing local.
Sensores integrados en armadura / traje / casco.
Batería crítica, radiación, seguridad de la información.
Comunicación: radio táctica / mesh / satelital si disponible.`}
      </Rule>

      <Rule label="Regla flota LBS">
        {`GNSS + app nativa + mapa en tiempo real + geofencing + asignación del recurso más cercano.
GPS en vehículo + smartphone en vigilante → servidor central → panel de operaciones.`}
      </Rule>

      <Rule label="Regla privacidad (siempre)">
        {`Datos biométricos y de localización = datos sensibles.
→ Consentimiento del usuario / trabajador.
→ Cifrado en tránsito y en reposo.
→ Control de acceso.
→ Uso limitado al fin declarado (solo horario laboral si son empleados).`}
      </Rule>

      <div className="ptg-section ptg-section-plantilla" style={{ marginTop: 4 }}>
        <div className="ptg-section-title">Frase clave para cualquier apertura IoT</div>
        <Frase>
          &ldquo;La solución propuesta se basa en una arquitectura IoT que permite monitorizar de forma
          <strong> continua, no intrusiva y en tiempo real</strong> los parámetros de interés,
          adaptando los dispositivos, protocolos y procesamiento al <strong>contexto específico</strong>
          descrito en el enunciado.&rdquo;
        </Frase>
      </div>
    </>
  );
}

/* ── Componente principal ─────────────────────────────────────────────────── */

export default function TeExamPrep() {
  return (
    <section className="te-prep" aria-label="Preparación examen TE — caso práctico">

      {/* Cabecera */}
      <div className="te-prep-header">
        <div className="te-prep-icon" aria-hidden="true">🚀</div>
        <div>
          <div className="te-prep-title">Preparación examen</div>
          <div className="te-prep-subtitle">
            Guía organizada por los 5 tipos reales de preguntas · Parte práctica (6 puntos)
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="te-prep-stats">
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Banco analizado</div>
          <div className="te-prep-stat-value">113 preguntas</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Desarrollo detectadas</div>
          <div className="te-prep-stat-value accent">8 preguntas</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Patrón dominante</div>
          <div className="te-prep-stat-value">IoT + wearables biométricos</div>
        </div>
        <div className="te-prep-stat-card">
          <div className="te-prep-stat-label">Idea clave</div>
          <div className="te-prep-stat-value">El contexto cambia, la estructura se repite</div>
        </div>
      </div>

      {/* Acordeones */}
      <div className="ptg-list">

        <AccordionBlock
          id="tipo1"
          icon="🏃"
          title="Tipo 1 — IoT + wearables + monitorización biométrica terrestre"
          subtitle="Equipo de fútbol · Princesas Disney · Salud y rendimiento · 2 casos del banco"
        >
          <Block1 />
        </AccordionBlock>

        <AccordionBlock
          id="tipo2"
          icon="🌊"
          title="Tipo 2 — IoT + wearables en entorno acuático o submarino"
          subtitle="Crustáceo Crujiente · Medusas · Ariel / Atlántica · 3 casos del banco"
        >
          <Block2 />
        </AccordionBlock>

        <AccordionBlock
          id="tipo3"
          icon="🚀"
          title="Tipo 3 — IoT + wearables en entorno espacial o extremo"
          subtitle="Mandalorianos · Armadura beskar · Sin infraestructura · 1 caso del banco"
        >
          <Block3 />
        </AccordionBlock>

        <AccordionBlock
          id="tipo4"
          icon="🗺️"
          title="Tipo 4 — LBS + flota de vehículos + app móvil"
          subtitle="Empresa de seguridad · Desierto ACME · 2 casos del banco"
        >
          <Block4 />
        </AccordionBlock>

        <AccordionBlock
          id="tipo5"
          icon="📖"
          title="Tipo 5 — Preguntas teóricas cortas"
          subtitle="Beacon · Realidad virtual · Edge Computing · GNSS · CPU móvil · Apps híbridas"
        >
          <Block5 />
        </AccordionBlock>

        <AccordionBlock
          id="estructura"
          icon="📋"
          title="Estructura universal para cualquier caso práctico IoT"
          subtitle="Los 9 pasos que funcionan para cualquier tipo"
        >
          <Block6 />
        </AccordionBlock>

        <AccordionBlock
          id="errores"
          icon="❌"
          title="Errores que más penalizan"
          subtitle="Los 10 fallos más frecuentes y por qué cuestan puntos"
        >
          <Block7 />
        </AccordionBlock>

        <AccordionBlock
          id="reglas"
          icon="⚡"
          title="Lo que tengo que saber escribir sin pensar"
          subtitle="Reglas y frases memorizables para el día del examen"
        >
          <Block8 />
        </AccordionBlock>

      </div>
    </section>
  );
}
