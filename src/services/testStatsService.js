// testStatsService.js
// Estadísticas locales de aciertos/fallos en preguntas tipo test (smpc, casi, te).
// Clave: studyhub_test_question_stats_v1
// Solo localStorage, no backend, no se modifica ningún JSON del banco de preguntas.

const KEY = 'studyhub_test_question_stats_v1';

export const TRACKED_SUBJECTS = ['smpc', 'casi', 'te'];

export const STATS_UPDATED_EVENT = 'studyhub:test-stats-updated';

const getAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const computeFailRate = (attempts, wrong) =>
  attempts > 0 ? Math.round((wrong / attempts) * 100) : 0;

export const testStatsService = {
  getAllStats() {
    return getAll();
  },

  getSubjectStats(subjectId) {
    return getAll()[subjectId] || {};
  },

  getQuestionStats(subjectId, questionId) {
    const stats = this.getSubjectStats(subjectId)[questionId];
    if (!stats) return null;

    return {
      ...stats,
      failRate: computeFailRate(stats.attempts, stats.wrong),
    };
  },

  recordQuestionResult(subjectId, questionId, isCorrect) {
    const data = getAll();
    if (!data[subjectId]) data[subjectId] = {};

    const current = data[subjectId][questionId] || { attempts: 0, correct: 0, wrong: 0 };

    current.attempts += 1;
    if (isCorrect) current.correct += 1;
    else current.wrong += 1;
    current.lastResult = isCorrect ? 'correct' : 'wrong';
    current.lastAnsweredAt = new Date().toISOString();

    data[subjectId][questionId] = current;
    save(data);

    return current;
  },

  resetQuestionStats(subjectId, questionId) {
    const data = getAll();
    if (data[subjectId]) {
      delete data[subjectId][questionId];
      save(data);
    }
  },

  resetSubjectStats(subjectId) {
    const data = getAll();
    data[subjectId] = {};
    save(data);
  },

  getSubjectSummary(subjectId, questions = []) {
    const stats = this.getSubjectStats(subjectId);

    let practicadas = 0;
    let intentos = 0;
    let aciertos = 0;
    let fallos = 0;

    questions.forEach(q => {
      const s = stats[q.id];
      if (s && s.attempts > 0) {
        practicadas += 1;
        intentos += s.attempts;
        aciertos += s.correct;
        fallos += s.wrong;
      }
    });

    return {
      practicadas,
      total: questions.length,
      intentos,
      aciertos,
      fallos,
      failRate: computeFailRate(intentos, fallos),
    };
  },

  getQuestionStatus(subjectId, questionId) {
    if (!subjectId || !questionId) return { attempts: 0, correct: 0, wrong: 0, ratio: null, status: 'unseen', label: 'Sin practicar' };
    const stats = this.getSubjectStats(subjectId)[questionId];
    if (!stats || stats.attempts === 0) return { attempts: 0, correct: 0, wrong: 0, ratio: null, status: 'unseen', label: 'Sin practicar' };

    const { attempts, correct, wrong } = stats;
    const ratio = correct / attempts;
    let status, label;

    if (ratio >= 0.85)       { status = 'excellent'; label = 'Dominio alto'; }
    else if (ratio >= 0.65)  { status = 'good';      label = 'Bastante bien'; }
    else if (ratio >= 0.45)  { status = 'medium';    label = 'Repaso recomendado'; }
    else if (ratio > 0)      { status = 'bad';       label = 'Necesita repaso'; }
    else                     { status = 'critical';  label = 'Muy fallada'; }

    return { attempts, correct, wrong, ratio, status, label };
  },

  matchesPracticeFilter(subjectId, questionId, filter) {
    if (!filter || filter === 'todos') return true;
    const stats = this.getSubjectStats(subjectId)[questionId];
    const attempts = stats?.attempts || 0;
    const wrong    = stats?.wrong    || 0;
    const correct  = stats?.correct  || 0;
    switch (filter) {
      case 'falladas':      return wrong > 0;
      case 'sin_practicar': return attempts === 0;
      case 'dominadas':     return attempts > 0 && (correct / attempts) >= 0.85;
      case 'mixtas':        return attempts > 0 && wrong > 0 && correct > 0;
      default: return true;
    }
  },

  getWorstQuestions(subjectId, questions = [], limit = 5) {
    const stats = this.getSubjectStats(subjectId);

    return questions
      .map(q => {
        const s = stats[q.id];
        if (!s || s.attempts <= 0) return null;

        return {
          question: q,
          attempts: s.attempts,
          correct: s.correct,
          wrong: s.wrong,
          failRate: computeFailRate(s.attempts, s.wrong),
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (b.failRate !== a.failRate) return b.failRate - a.failRate;
        if (b.attempts !== a.attempts) return b.attempts - a.attempts;
        return b.wrong - a.wrong;
      })
      .slice(0, limit);
  },
};
