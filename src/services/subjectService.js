// subjectService.js
// Wrapper fino sobre publicLibrary para acceso uniforme a asignaturas.
// La fuente es siempre el JSON público del repositorio, nunca localStorage.

import { publicLibrary } from '../lib/publicLibrary';

export const subjectService = {
  getAll() {
    return publicLibrary.getSubjects();
  },

  getById(id) {
    return publicLibrary.getSubject(id);
  },

  // Sugiere el próximo ID de tema legible (tema-1, tema-2, ...)
  nextTemaId(asignaturaId) {
    const subject = this.getById(asignaturaId);
    const n = (subject?.temas?.length || 0) + 1;
    return `tema-${n}`;
  },
};
