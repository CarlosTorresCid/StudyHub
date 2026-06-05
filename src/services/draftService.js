// draftService.js
// Almacena borradores locales de administración en localStorage.
// SOLO para probar contenido antes de publicarlo en el repositorio.
// Los borradores NUNCA aparecen en la navegación pública normal.
// Claves: studyhub_admin_draft_contents, studyhub_admin_draft_questions

const KEYS = {
  CONTENTS: 'studyhub_admin_draft_contents',
  QUESTIONS: 'studyhub_admin_draft_questions',
};

const load = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const draftService = {
  // ── Contenidos ──────────────────────────────────────────────────────────

  getAllDraftContents() {
    return load(KEYS.CONTENTS) || {};
  },

  getDraftContent(asignaturaId, temaId) {
    return this.getAllDraftContents()[`${asignaturaId}__${temaId}`] || null;
  },

  saveDraftContent(content) {
    if (!content?.asignaturaId || !content?.temaId) return;
    const all = this.getAllDraftContents();
    all[`${content.asignaturaId}__${content.temaId}`] = content;
    save(KEYS.CONTENTS, all);
  },

  deleteDraftContent(asignaturaId, temaId) {
    const all = this.getAllDraftContents();
    delete all[`${asignaturaId}__${temaId}`];
    save(KEYS.CONTENTS, all);
  },

  listDraftContents() {
    return Object.values(this.getAllDraftContents());
  },

  clearAllDraftContents() {
    save(KEYS.CONTENTS, {});
  },

  // ── Preguntas ────────────────────────────────────────────────────────────

  getAllDraftQuestions() {
    return load(KEYS.QUESTIONS) || [];
  },

  saveDraftQuestions(preguntas) {
    const all = this.getAllDraftQuestions();
    preguntas.forEach(q => {
      const idx = all.findIndex(e => e.id === q.id);
      if (idx >= 0) all[idx] = q;
      else all.push(q);
    });
    save(KEYS.QUESTIONS, all);
  },

  getDraftQuestionsByTema(asignaturaId, temaId) {
    return this.getAllDraftQuestions().filter(
      q => q.asignaturaId === asignaturaId && q.temaId === temaId
    );
  },

  getDraftQuestionsByAsignatura(asignaturaId) {
    return this.getAllDraftQuestions().filter(q => q.asignaturaId === asignaturaId);
  },

  deleteDraftQuestion(id) {
    save(KEYS.QUESTIONS, this.getAllDraftQuestions().filter(q => q.id !== id));
  },

  clearAllDraftQuestions() {
    save(KEYS.QUESTIONS, []);
  },

  // ── Exportar ─────────────────────────────────────────────────────────────

  exportContent(asignaturaId, temaId) {
    const content = this.getDraftContent(asignaturaId, temaId);
    if (!content) return false;
    downloadJson(content, `${temaId}-contenido.json`);
    return true;
  },

  exportQuestions(asignaturaId, temaId) {
    const qs = temaId
      ? this.getDraftQuestionsByTema(asignaturaId, temaId)
      : this.getDraftQuestionsByAsignatura(asignaturaId);
    if (!qs.length) return false;
    const filename = temaId ? `${temaId}-preguntas.json` : `${asignaturaId}-preguntas.json`;
    downloadJson(qs, filename);
    return true;
  },

  // ── Rutas de publicación ─────────────────────────────────────────────────

  getPublicationPaths(asignaturaId, temaId) {
    return {
      contenido: `src/data/public/${asignaturaId}/temas/${temaId}-contenido.json`,
      preguntas: `src/data/public/${asignaturaId}/preguntas/${temaId}-preguntas.json`,
      configuracion: `src/data/public/${asignaturaId}/configuracion.json`,
    };
  },
};

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
