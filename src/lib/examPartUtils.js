// examPartUtils.js
// Lógica común para resolver las partes de examen de una asignatura
// y comprobar a qué parte pertenece una pregunta.
// Centraliza lo que antes estaba duplicado en publicLibrary.js,
// ExamPage.jsx y ExamPartPage.jsx.

export const DEFAULT_EXAM_PARTS = [
  {
    id: 'parte-test',
    nombre: 'Tipo test',
    tipos: ['test', 'verdadero_falso'],
    icono: '📝',
    desc: 'Preguntas objetivas y verdadero/falso',
  },
  {
    id: 'parte-cortas',
    nombre: 'Preguntas cortas',
    tipos: ['corta'],
    icono: '✍️',
    desc: 'Preguntas de respuesta breve',
  },
  {
    id: 'parte-desarrollo',
    nombre: 'Preguntas de desarrollo',
    tipos: ['desarrollo', 'practica'],
    icono: '🧠',
    desc: 'Preguntas teóricas de desarrollo y casos prácticos',
  },
  {
    id: 'parte-problemas',
    nombre: 'Problemas prácticos',
    tipos: ['practica'],
    icono: '🧪',
    desc: 'Ejercicios prácticos y problemas',
  },
];

// Normaliza un parteExamenId libre (con espacios, mayúsculas, alias antiguos...)
// al ID canónico de parte (parte-test, parte-cortas, parte-desarrollo, parte-problemas).
export function normalizeParteExamenId(value) {
  const v = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

  if (!v) return null;

  const aliases = {
    // Tipo test
    test: 'parte-test',
    tipo_test: 'parte-test',
    parte_test: 'parte-test',
    parte_test_tipo: 'parte-test',
    preguntas_test: 'parte-test',
    verdadero_falso: 'parte-test',
    vf: 'parte-test',

    // Preguntas cortas
    corta: 'parte-cortas',
    cortas: 'parte-cortas',
    pregunta_corta: 'parte-cortas',
    preguntas_cortas: 'parte-cortas',
    parte_cortas: 'parte-cortas',
    respuesta_corta: 'parte-cortas',

    // Desarrollo
    desarrollo: 'parte-desarrollo',
    desarrollos: 'parte-desarrollo',
    pregunta_desarrollo: 'parte-desarrollo',
    preguntas_desarrollo: 'parte-desarrollo',
    parte_desarrollo: 'parte-desarrollo',
    teoria_desarrollo: 'parte-desarrollo',

    // Problemas prácticos
    practica: 'parte-problemas',
    practicas: 'parte-problemas',
    práctico: 'parte-problemas',
    prácticos: 'parte-problemas',
    problema: 'parte-problemas',
    problemas: 'parte-problemas',
    problema_practico: 'parte-problemas',
    problemas_practicos: 'parte-problemas',
    parte_problemas: 'parte-problemas',
  };

  return aliases[v] || value;
}

// Devuelve las partes de examen de una asignatura: las configuradas en
// configuracion.json (estructuraExamen) o, si no hay ninguna, las partes
// por defecto que tengan al menos una pregunta de los tipos indicados.
export function getExamParts(subject, questions = []) {
  const configuredParts = subject?.estructuraExamen || [];

  if (configuredParts.length > 0) {
    return configuredParts;
  }

  return DEFAULT_EXAM_PARTS.filter(part =>
    questions.some(q => part.tipos.includes(q.tipo))
  );
}

// Una pregunta pertenece a esta parte si su parteExamenId coincide,
// si su parteExamenId usa un alias conocido,
// o si no tiene parteExamenId pero su tipo encaja con los tipos de la parte
// (fallback para bancos importados sin parteExamenId asignado).
export function questionMatchesPart(q, part) {
  if (!part) return false;

  const normalizedParteId = normalizeParteExamenId(q.parteExamenId);

  if (normalizedParteId === part.id) return true;

  const sinParte =
    q.parteExamenId === null ||
    q.parteExamenId === undefined ||
    q.parteExamenId === '';

  return sinParte && Boolean(part.tipos?.includes(q.tipo));
}
