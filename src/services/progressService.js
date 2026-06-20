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

  if (existing) {
    existing.aciertos = (existing.aciertos || 0) + 1;
  } else {
    data.preguntasFalladas.push({ preguntaId, fallos: 0, aciertos: 1 });
  }

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

  getQuestionStats(questionId) {
    if (!questionId) return { attempts: 0, correct: 0, wrong: 0, ratio: null, status: 'unseen', label: 'Sin practicar' };
    const data = getAll();
    const record = data.preguntasFalladas.find(p => p.preguntaId === questionId);
    if (!record) return { attempts: 0, correct: 0, wrong: 0, ratio: null, status: 'unseen', label: 'Sin practicar' };

    const correct = record.aciertos || 0;
    const wrong = record.fallos || 0;
    const attempts = correct + wrong;

    if (attempts === 0) return { attempts: 0, correct: 0, wrong: 0, ratio: null, status: 'unseen', label: 'Sin practicar' };

    const ratio = correct / attempts;
    let status, label;

    if (ratio >= 0.85)       { status = 'excellent'; label = 'Dominio alto'; }
    else if (ratio >= 0.65)  { status = 'good';      label = 'Bastante bien'; }
    else if (ratio >= 0.45)  { status = 'medium';    label = 'Repaso recomendado'; }
    else if (ratio > 0)      { status = 'bad';       label = 'Necesita repaso'; }
    else                     { status = 'critical';  label = 'Muy fallada'; }

    return { attempts, correct, wrong, ratio, status, label };
  },

  matchesPracticeFilter(questionId, filter) {
    if (!filter || filter === 'todos' || filter === '') return true;
    const s = this.getQuestionStats(questionId);
    switch (filter) {
      case 'falladas':      return s.wrong > 0;
      case 'sin_practicar': return s.attempts === 0;
      case 'dominadas':     return s.attempts > 0 && s.ratio >= 0.85;
      case 'mixtas':        return s.attempts > 0 && s.wrong > 0 && s.correct > 0;
      default: return true;
    }
  },

  resetAll() {
    localStorage.removeItem(KEY);
  },
};
