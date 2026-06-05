// progressService.js
// Progreso personal del visitante: tests realizados, temas vistos, preguntas falladas.
// Clave: studyhub_user_progress
// Solo opera sobre contenido público. Comienza vacío para cada visitante.

const KEY = 'studyhub_user_progress';

const getAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { resultados: [], preguntasFalladas: [], temasVistos: [] };
  } catch {
    return { resultados: [], preguntasFalladas: [], temasVistos: [] };
  }
};
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const progressService = {
  guardarResultado(asignaturaId, temaId, tipo, aciertos, total) {
    const data = getAll();
    data.resultados.push({ asignaturaId, temaId, tipo, aciertos, total, fecha: new Date().toISOString() });
    save(data);
  },

  registrarFallo(preguntaId) {
    const data = getAll();
    const existing = data.preguntasFalladas.find(p => p.preguntaId === preguntaId);
    if (existing) existing.fallos++;
    else data.preguntasFalladas.push({ preguntaId, fallos: 1, aciertos: 0 });
    save(data);
  },

  registrarAcierto(preguntaId) {
    const data = getAll();
    const existing = data.preguntasFalladas.find(p => p.preguntaId === preguntaId);
    if (existing) existing.aciertos++;
    save(data);
  },

  marcarTemaVisto(asignaturaId, temaId) {
    const data = getAll();
    const key = `${asignaturaId}-${temaId}`;
    if (!data.temasVistos.includes(key)) data.temasVistos.push(key);
    save(data);
  },

  getTemaVisto(asignaturaId, temaId) {
    return getAll().temasVistos.includes(`${asignaturaId}-${temaId}`);
  },

  getUltimoResultado(asignaturaId) {
    const resultados = getAll().resultados.filter(r => r.asignaturaId === asignaturaId);
    return resultados.length ? resultados[resultados.length - 1] : null;
  },

  getEstadisticasTema(asignaturaId, temaId) {
    const resultados = getAll().resultados.filter(r => r.asignaturaId === asignaturaId && r.temaId === temaId);
    if (!resultados.length) return null;
    const ultimo = resultados[resultados.length - 1];
    const mejor = resultados.reduce((a, b) => (a.aciertos / a.total > b.aciertos / b.total ? a : b));
    return { ultimo, mejor, total: resultados.length };
  },

  resetAll() {
    localStorage.removeItem(KEY);
  },
};
