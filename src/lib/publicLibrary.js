// publicLibrary.js
// Fuente única de verdad para el contenido público.
// Lee los archivos JSON del repositorio mediante import.meta.glob (eager).
//
// Para publicar un tema nuevo basta con añadir:
//   src/data/public/[asig]/temas/[temaId]-contenido.json
// y ejecutar npm run build. Los temas se detectan automáticamente
// sin necesidad de editar configuracion.json.
//
// La estructura del examen sigue leyéndose de configuracion.json porque
// no puede deducirse del contenido de los temas.
//
// NUNCA leer borradores de /gestion desde aquí.

import asignaturasData from '../data/public/asignaturas.json';

// Configuraciones de cada asignatura (contiene estructuraExamen)
const configModules = import.meta.glob('../data/public/*/configuracion.json', { eager: true });

// Contenidos de temas — FUENTE de la lista de temas públicos
const contentModules = import.meta.glob('../data/public/*/temas/*.json', { eager: true });

// Preguntas públicas
const questionModules = import.meta.glob('../data/public/*/preguntas/*.json', { eager: true });

// ── Índice de configuraciones { smpc: { id, estructuraExamen }, ... } ──────
const configs = {};
Object.entries(configModules).forEach(([path, mod]) => {
  const match = path.match(/\/public\/([^/]+)\/configuracion\.json/);
  if (match) configs[match[1]] = mod.default ?? mod;
});

// ── Índice de contenidos { smpc: { 'tema-1': { ...data } }, ... } ──────────
// Cualquier archivo en temas/*.json cuyo contenido tenga temaId se registra.
const contents = {};
Object.entries(contentModules).forEach(([path, mod]) => {
  const match = path.match(/\/public\/([^/]+)\/temas\/.+\.json$/);
  if (!match) return;
  const asigId = match[1];
  const data = mod.default ?? mod;
  if (data?.temaId) {
    if (!contents[asigId]) contents[asigId] = {};
    contents[asigId][data.temaId] = data;
  }
});

// ── Índice de preguntas { smpc: [...], ... } ────────────────────────────────
const questions = {};
Object.entries(questionModules).forEach(([path, mod]) => {
  const match = path.match(/\/public\/([^/]+)\/preguntas\/.+\.json$/);
  if (!match) return;
  const asigId = match[1];
  if (!questions[asigId]) questions[asigId] = [];
  const data = mod.default ?? mod;
  if (Array.isArray(data)) questions[asigId].push(...data);
  else if (data) questions[asigId].push(data);
});

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractNumero(temaId) {
  const match = temaId?.match(/^tema-(\d+)$/i);
  return match ? parseInt(match[1], 10) : null;
}

// Construye la lista de temas de una asignatura a partir de sus archivos de contenido.
// Ordena: primero los que tienen número (asc), luego el resto (alfa por título).
function buildTemasFromContents(asigId) {
  const subjectContents = contents[asigId] || {};
  const temas = Object.values(subjectContents).map(c => ({
    id: c.temaId,
    numero: extractNumero(c.temaId),
    titulo: c.titulo || c.temaId,
    importanciaExamen: c.importanciaExamen || null,
  }));

  return temas.sort((a, b) => {
    if (a.numero !== null && b.numero !== null) return a.numero - b.numero;
    if (a.numero !== null) return -1;
    if (b.numero !== null) return 1;
    return (a.titulo || '').localeCompare(b.titulo || '');
  });
}

// ── API pública ──────────────────────────────────────────────────────────────

export const publicLibrary = {
  // Todas las asignaturas con sus temas (autodescubiertos) y estructura de examen
  getSubjects() {
    return asignaturasData.map(a => ({
      ...a,
      temas: buildTemasFromContents(a.id),
      estructuraExamen: configs[a.id]?.estructuraExamen || [],
    }));
  },

  // Una asignatura por ID
  getSubject(id) {
    const base = asignaturasData.find(a => a.id === id);
    if (!base) return null;
    return {
      ...base,
      temas: buildTemasFromContents(id),
      estructuraExamen: configs[id]?.estructuraExamen || [],
    };
  },

  // Contenido público de un tema (null si no está publicado)
  getTemaContent(asignaturaId, temaId) {
    return contents[asignaturaId]?.[temaId] || null;
  },

  // Todas las preguntas públicas de una asignatura
  getQuestions(asignaturaId) {
    return questions[asignaturaId] || [];
  },

  getQuestionsByTema(asignaturaId, temaId) {
    return this.getQuestions(asignaturaId).filter(q => q.temaId === temaId);
  },

  getQuestionsByParte(asignaturaId, parteId) {
    return this.getQuestions(asignaturaId).filter(q => q.parteExamenId === parteId);
  },

  // IDs de asignaturas válidos (para validación en servicios)
  getValidSubjectIds() {
    return asignaturasData.map(a => a.id);
  },
};
