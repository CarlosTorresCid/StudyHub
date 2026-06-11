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
import { normalizeParteExamenId } from './examPartUtils';

// Configuraciones de cada asignatura (contiene estructuraExamen e infoExamen)
const configModules = import.meta.glob('../data/public/*/configuracion.json', { eager: true });

// Contenidos de temas — FUENTE de la lista de temas públicos
const contentModules = import.meta.glob('../data/public/*/temas/*.json', { eager: true });

// Preguntas públicas
const questionModules = import.meta.glob('../data/public/*/preguntas/*.json', { eager: true });

// ── Índice de configuraciones { smpc: { id, estructuraExamen, infoExamen }, ... } ──────
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

// ── Modelos de examen AAMD ──────────────────────────────────────────────────

const AAMD_EXAM_MODELS = [
  {
    id: '2025-modelo-a',
    nombre: '2025 Modelo A',
    orden: 1,
    target: 'injury',
    recursos: [
      {
        nombre: 'injury_liver.csv',
        path: 'recursos/aamd/modelo-a/injury_liver.csv',
      },
    ],
  },
  {
    id: '2025-modelo-b-ext',
    nombre: '2025 Modelo B ext',
    orden: 2,
    target: 'pollution_level',
    recursos: [
      {
        nombre: 'environmental_pollution.csv',
        path: 'recursos/aamd/modelo-b-ext/environmental_pollution.csv',
      },
    ],
  },
  {
    id: '2025-modelo-c',
    nombre: '2025 Modelo C',
    orden: 3,
    target: 'stress_level',
    recursos: [
      {
        nombre: 'workplace_stress_updated.csv',
        path: 'recursos/aamd/modelo-c/workplace_stress_updated.csv',
      },
    ],
  },
  {
    id: '2025-modelo-d-ext',
    nombre: '2025 Modelo D ext',
    orden: 4,
    target: 'stress_level',
    recursos: [
      {
        nombre: 'workplace_stress_updated.csv',
        path: 'recursos/aamd/modelo-d-ext/workplace_stress_updated.csv',
      },
    ],
  },
  {
    id: '2025-modelo-d',
    nombre: '2025 Modelo D',
    orden: 5,
    target: 'pollution_level',
    recursos: [
      {
        nombre: 'environmental_pollution.csv',
        path: 'recursos/aamd/modelo-d/environmental_pollution.csv',
      },
    ],
  },
  {
    id: 'simulacro',
    nombre: 'Simulacro',
    orden: 6,
    target: 'stress_level',
    recursos: [
      {
        nombre: 'workplace_stress_predictions.csv',
        path: 'recursos/aamd/simulacro/workplace_stress_predictions.csv',
      },
      {
        nombre: 'workplace_stress_updated.csv',
        path: 'recursos/aamd/simulacro/workplace_stress_updated.csv',
      },
    ],
  },
];

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

function getConfig(asignaturaId) {
  return configs[asignaturaId] || {};
}



function buildPublicResourceUrl(path) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${path}`;
}

function questionParteMatches(q, parteId) {
  return normalizeParteExamenId(q.parteExamenId) === parteId;
}

function normalizeExamModelId(value = '') {
  const v = String(value).toLowerCase();

  if (v.includes('simulacro')) return 'simulacro';

  if (v.includes('b') && (v.includes('ext') || v.includes('extra'))) {
    return '2025-modelo-b-ext';
  }

  if (v.includes('d') && (v.includes('ext') || v.includes('extra') || v.includes('d2'))) {
    return '2025-modelo-d-ext';
  }

  if (v.includes('modelo-a') || v.includes('ordinaria-a') || v.endsWith('-a')) {
    return '2025-modelo-a';
  }

  if (v.includes('modelo-c') || v.includes('ordinaria-c') || v.endsWith('-c')) {
    return '2025-modelo-c';
  }

  if (v.includes('modelo-d') || v.includes('ordinaria-d') || v.endsWith('-d')) {
    return '2025-modelo-d';
  }

  return v || null;
}

function getQuestionExamModelId(q) {
  return normalizeExamModelId(
    q.modeloExamenId ||
    q.carpetaPrincipalId ||
    q.seccionExamenId ||
    q.etiquetaVisible ||
    ''
  );
}

function isRealExamPracticeQuestion(q) {
  return q.esPreguntaTipo !== true;
}

// ── API pública ──────────────────────────────────────────────────────────────

export const publicLibrary = {
  // Todas las asignaturas con sus temas (autodescubiertos), estructura de examen e infoExamen
  getSubjects() {
    return asignaturasData.map(a => {
      const config = getConfig(a.id);

      return {
        ...a,
        temas: buildTemasFromContents(a.id),
        estructuraExamen: config.estructuraExamen || [],
        infoExamen: config.infoExamen || null,
        modelosExamen: config.modelosExamen || {},
      };
    });
  },

  // Una asignatura por ID
  getSubject(id) {
    const base = asignaturasData.find(a => a.id === id);
    if (!base) return null;

    const config = getConfig(id);

    return {
      ...base,
      temas: buildTemasFromContents(id),
      estructuraExamen: config.estructuraExamen || [],
      infoExamen: config.infoExamen || null,
      modelosExamen: config.modelosExamen || {},
    };
  },

  resolveResourceUrl(path) {
    return buildPublicResourceUrl(path);
  },

getExamModels(asignaturaId, parteId) {
  const subjectQuestions = this.getQuestionBank(asignaturaId);

  const modelIds = new Set(
    subjectQuestions
      .filter(q => questionParteMatches(q, parteId))
      .filter(isRealExamPracticeQuestion)
      .map(getQuestionExamModelId)
      .filter(Boolean)
  );

  return AAMD_EXAM_MODELS
    .filter(model => modelIds.has(model.id))
    .sort((a, b) => a.orden - b.orden)
    .map(model => {
      const count = subjectQuestions.filter(q =>
        questionParteMatches(q, parteId) &&
        getQuestionExamModelId(q) === model.id &&
        isRealExamPracticeQuestion(q)
      ).length;

      return {
        ...model,
        recursos: (model.recursos || []).map(r => ({
          ...r,
          url: buildPublicResourceUrl(r.path),
        })),
        count,
      };
    });
},

  getExamModel(asignaturaId, parteId, modeloId) {
    return this.getExamModels(asignaturaId, parteId)
      .find(m => m.id === modeloId) || null;
  },

getQuestionsByParteAndModel(asignaturaId, parteId, modeloId) {
  return this.getQuestionBank(asignaturaId)
    .filter(q => questionParteMatches(q, parteId))
    .filter(isRealExamPracticeQuestion)
    .filter(q => getQuestionExamModelId(q) === modeloId)
    .sort((a, b) => {
      const ordenA = a.ordenPregunta ?? a.convocatorias?.[0]?.numeroPregunta ?? 999;
      const ordenB = b.ordenPregunta ?? b.convocatorias?.[0]?.numeroPregunta ?? 999;
      return ordenA - ordenB;
    });
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
  return this.getQuestions(asignaturaId).filter(q => questionParteMatches(q, parteId));
},
  // Banco global de preguntas de una asignatura.
  // Devuelve [] si no existe.
  getQuestionBank(asignaturaId) {
    return questions[asignaturaId] || [];
  },

  // IDs de asignaturas válidos (para validación en servicios)
  getValidSubjectIds() {
    return asignaturasData.map(a => a.id);
  },
};