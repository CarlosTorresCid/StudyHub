// questionService.js
// Para la vista pública: wraps publicLibrary (preguntas del repositorio).
// Para la gestión: valida JSON, delega en draftService.

import { publicLibrary } from '../lib/publicLibrary';
import { draftService } from './draftService';

const TIPO_COMPAT = {
  test: ['test'],
  vf: ['vf', 'verdaderoFalso'],
  desarrollo: ['desarrollo'],
  practicas: ['practicas'],
  sql: ['sql', 'practicas'],
  casos: ['casos', 'practicas'],
};

export const questionService = {
  // ── Vista pública ────────────────────────────────────────────────────────
  getByAsignatura(asignaturaId) {
    return publicLibrary.getQuestions(asignaturaId);
  },

  getByTema(asignaturaId, temaId) {
    return publicLibrary.getQuestionsByTema(asignaturaId, temaId);
  },

  getByParte(asignaturaId, parteId) {
    return publicLibrary.getQuestionsByParte(asignaturaId, parteId);
  },

  // Convierte array plano al formato agrupado que espera TestTab
  toTestTabFormat(questions) {
    return {
      test: questions.filter(q => q.tipo === 'test'),
      verdaderoFalso: questions.filter(q => q.tipo === 'vf' || q.tipo === 'verdaderoFalso'),
      desarrollo: questions.filter(q => q.tipo === 'desarrollo'),
      practicas: questions.filter(q => ['practicas', 'sql', 'casos'].includes(q.tipo)),
    };
  },

  getStats(asignaturaId) {
    const qs = this.getByAsignatura(asignaturaId);
    return {
      total: qs.length,
      reales: qs.filter(q => q.origen === 'examen_real').length,
      generadas: qs.filter(q => q.origen === 'generada_ia').length,
    };
  },

  // ── Gestión (borradores) ─────────────────────────────────────────────────
  importDraftFromJson(preguntas) {
    if (!Array.isArray(preguntas)) throw new Error('Se espera un array de preguntas');
    const ids = preguntas.map(q => q.id).filter(Boolean);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) throw new Error(`IDs duplicados: ${[...new Set(dupes)].join(', ')}`);

    const errors = [];
    preguntas.forEach((q, i) => {
      const e = this.validateQuestion(q);
      if (e.length) errors.push(`Pregunta ${i + 1} (id: ${q.id || '?'}): ${e.join('; ')}`);
    });
    if (errors.length) throw new Error(errors.join('\n'));

    draftService.saveDraftQuestions(preguntas);
    return { added: preguntas.length };
  },

  validateQuestion(q) {
    const errors = [];
    if (!q.id) errors.push('falta id');
    if (!q.asignaturaId) errors.push('falta asignaturaId');
    else if (!publicLibrary.getValidSubjectIds().includes(q.asignaturaId))
      errors.push(`asignaturaId "${q.asignaturaId}" no existe`);
    if (!q.tipo) errors.push('falta tipo');
    if (!q.enunciado) errors.push('falta enunciado');
    if (q.tipo === 'test') {
      if (!Array.isArray(q.opciones) || q.opciones.length < 2)
        errors.push('test: "opciones" necesita al menos 2 elementos');
      if (q.respuestaCorrecta === undefined || q.respuestaCorrecta === null)
        errors.push('test: falta "respuestaCorrecta"');
    }
    if (q.tipo === 'vf' || q.tipo === 'verdaderoFalso') {
      if (q.respuestaCorrecta !== true && q.respuestaCorrecta !== false)
        errors.push('vf: "respuestaCorrecta" debe ser true o false');
    }
    return errors;
  },
};
