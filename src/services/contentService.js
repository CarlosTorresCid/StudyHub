// contentService.js
// Para la vista pública: wraps publicLibrary.getTemaContent().
// Para la gestión: valida JSON y delega en draftService.

import { publicLibrary } from '../lib/publicLibrary';
import { draftService } from './draftService';

export const contentService = {
  // Vista pública: devuelve contenido publicado en el repositorio
  getTemaContent(asignaturaId, temaId) {
    return publicLibrary.getTemaContent(asignaturaId, temaId);
  },

  hasPublicContent(asignaturaId, temaId) {
    return !!publicLibrary.getTemaContent(asignaturaId, temaId);
  },

  // Gestión: valida un JSON y lo guarda como borrador local
  importDraft(json) {
    const errors = this.validate(json);
    if (errors.length) throw new Error(errors.join('\n'));
    draftService.saveDraftContent(json);
    return json;
  },

  // Valida la estructura del JSON de contenido.
  // No exige que temaId exista previamente en configuracion.json.
  validate(json) {
    const errors = [];

    // Campos de identificación
    if (!json?.asignaturaId) {
      errors.push('Falta campo: asignaturaId');
    } else if (!publicLibrary.getValidSubjectIds().includes(json.asignaturaId)) {
      errors.push(`asignaturaId "${json.asignaturaId}" no es válido. Opciones: ${publicLibrary.getValidSubjectIds().join(', ')}`);
    }
    if (!json?.temaId) errors.push('Falta campo: temaId');
    if (!json?.titulo) errors.push('Falta campo: titulo');

    // Presencia de los campos de contenido (pueden estar vacíos)
    if (json?.apuntes === undefined) {
      errors.push('Falta campo: apuntes (puede ser { "introduccion": "", "secciones": [] })');
    } else if (typeof json.apuntes !== 'object' || Array.isArray(json.apuntes)) {
      errors.push('apuntes debe ser un objeto { introduccion, secciones }');
    } else if (json.apuntes.secciones !== undefined && !Array.isArray(json.apuntes.secciones)) {
      errors.push('apuntes.secciones debe ser un array');
    }
    if (json?.resumen === undefined) {
      errors.push('Falta campo: resumen (puede ser [])');
    } else if (!Array.isArray(json.resumen)) {
      errors.push('resumen debe ser un array');
    }
    if (json?.conceptosClave === undefined) {
      errors.push('Falta campo: conceptosClave (puede ser [])');
    } else if (!Array.isArray(json.conceptosClave)) {
      errors.push('conceptosClave debe ser un array');
    } else {
      json.conceptosClave.forEach((c, i) => {
        if (!c.termino) errors.push(`conceptosClave[${i}]: falta "termino"`);
        if (!c.definicion) errors.push(`conceptosClave[${i}]: falta "definicion"`);
      });
    }
    if (json?.flashcards === undefined) {
      errors.push('Falta campo: flashcards (puede ser [])');
    } else if (!Array.isArray(json.flashcards)) {
      errors.push('flashcards debe ser un array');
    } else {
      json.flashcards.forEach((f, i) => {
        if (!f.id) errors.push(`flashcards[${i}]: falta "id"`);
        if (!f.pregunta) errors.push(`flashcards[${i}]: falta "pregunta"`);
        if (!f.respuesta) errors.push(`flashcards[${i}]: falta "respuesta"`);
      });
    }
    return errors;
  },
};
