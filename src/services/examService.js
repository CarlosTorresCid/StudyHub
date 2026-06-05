// examService.js
// Lee la estructura del examen desde el JSON público de cada asignatura.
// La estructura se define manualmente en configuracion.json del repositorio.

import { publicLibrary } from '../lib/publicLibrary';

export const examService = {
  getEstructura(asignaturaId) {
    return publicLibrary.getSubject(asignaturaId)?.estructuraExamen || [];
  },
};
