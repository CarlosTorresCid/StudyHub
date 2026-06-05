// storageService.js
// Claves de localStorage de la versión pública de StudyHub.
// studyhub_admin_draft_* → borradores locales del administrador
// studyhub_user_*         → progreso personal del visitante
// studyhub_public_*       → flags de sistema

export const KEYS = {
  // Borradores de administración (solo en el navegador del admin)
  ADMIN_DRAFT_CONTENTS:  'studyhub_admin_draft_contents',
  ADMIN_DRAFT_QUESTIONS: 'studyhub_admin_draft_questions',

  // Progreso personal del visitante
  USER_PROGRESS:    'studyhub_user_progress',
  USER_SIMULATIONS: 'studyhub_user_simulations',

  // Flags de sistema
  RESET_DONE: 'studyhub_public_v1_reset_done',
};

const get = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const set = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const remove = (key) => localStorage.removeItem(key);

export const storageService = { KEYS, get, set, remove };
