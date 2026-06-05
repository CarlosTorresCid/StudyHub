// simulationService.js
// Genera y gestiona simulacros de examen sobre el contenido público.
// Clave: studyhub_user_simulations
// Las preguntas se toman de publicLibrary, nunca de borradores.

import { publicLibrary } from '../lib/publicLibrary';
import { examService } from './examService';

const KEY = 'studyhub_user_simulations';

const getAll = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const saveAll = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const filterByFuente = (pool, fuentes) => {
  if (fuentes === 'reales') return pool.filter(q => q.origen === 'examen_real');
  if (fuentes === 'generadas') return pool.filter(q => q.origen === 'generada_ia');
  return pool;
};

export const simulationService = {
  getDisponibilidad(asignaturaId, fuentes = 'ambas') {
    const estructura = examService.getEstructura(asignaturaId);
    return estructura.map(parte => {
      const pool = filterByFuente(
        publicLibrary.getQuestionsByParte(asignaturaId, parte.id),
        fuentes
      );
      return {
        parteId: parte.id,
        nombre: parte.nombre,
        requeridas: parte.numeroPreguntasExamen,
        disponibles: pool.length,
        suficiente: pool.length >= parte.numeroPreguntasExamen,
      };
    });
  },

  canStartCompleto(asignaturaId, fuentes = 'ambas') {
    const disp = this.getDisponibilidad(asignaturaId, fuentes);
    return disp.length > 0 && disp.every(d => d.suficiente);
  },

  canStartParcial(asignaturaId, fuentes = 'ambas') {
    const disp = this.getDisponibilidad(asignaturaId, fuentes);
    return disp.some(d => d.disponibles > 0);
  },

  generate(asignaturaId, options = {}) {
    const { fuentes = 'ambas', duracionMinutos = null, mode = 'completo' } = options;
    const estructura = examService.getEstructura(asignaturaId);
    if (!estructura.length) return null;

    let partesAIncluir = mode === 'parcial'
      ? estructura.filter(parte => {
          const pool = filterByFuente(publicLibrary.getQuestionsByParte(asignaturaId, parte.id), fuentes);
          return pool.length > 0;
        })
      : estructura;

    if (!partesAIncluir.length) return null;

    const partes = partesAIncluir.map(parte => {
      const pool = filterByFuente(publicLibrary.getQuestionsByParte(asignaturaId, parte.id), fuentes);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const n = mode === 'parcial' ? Math.min(parte.numeroPreguntasExamen, pool.length) : parte.numeroPreguntasExamen;
      return { ...parte, preguntas: shuffled.slice(0, n), disponibles: pool.length };
    });

    return {
      id: `sim-${Date.now()}`,
      asignaturaId,
      mode,
      fecha: new Date().toISOString(),
      opciones: { fuentes, duracionMinutos },
      partes,
      completado: false,
      respuestas: {},
      manualGrades: {},
      resultado: null,
    };
  },

  save(simulacro) {
    const all = getAll();
    const idx = all.findIndex(s => s.id === simulacro.id);
    if (idx >= 0) all[idx] = simulacro;
    else all.push(simulacro);
    saveAll(all);
  },

  getById(id) { return getAll().find(s => s.id === id) || null; },

  getByAsignatura(asignaturaId) {
    return getAll()
      .filter(s => s.asignaturaId === asignaturaId)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  },

  getLastCompleted(asignaturaId) {
    const results = this.getByAsignatura(asignaturaId).filter(s => s.completado);
    return results.length ? results[0] : null;
  },

  calcularResultados(simulacro) {
    const { partes, respuestas = {}, manualGrades = {} } = simulacro;
    const MANUAL_TIPOS = ['desarrollo', 'practicas', 'sql', 'casos'];

    const porParte = partes.map(parte => {
      const autoQ = parte.preguntas.filter(q => q.tipo === 'test' || q.tipo === 'vf' || q.tipo === 'verdaderoFalso');
      const manualQ = parte.preguntas.filter(q => MANUAL_TIPOS.includes(q.tipo));
      let aciertos = 0;
      autoQ.forEach(q => { if (respuestas[q.id] === q.respuestaCorrecta) aciertos++; });
      const manualEval = { correcta: 0, parcial: 0, incorrecta: 0, sinEvaluar: 0 };
      manualQ.forEach(q => {
        const g = manualGrades[q.id];
        if (g === 'correcta') manualEval.correcta++;
        else if (g === 'parcial') manualEval.parcial++;
        else if (g === 'incorrecta') manualEval.incorrecta++;
        else manualEval.sinEvaluar++;
      });
      const pctAuto = autoQ.length ? Math.round((aciertos / autoQ.length) * 100) : null;
      const totalEval = manualQ.length - manualEval.sinEvaluar;
      const pctManual = totalEval > 0
        ? Math.round(((manualEval.correcta + manualEval.parcial * 0.5) / totalEval) * 100)
        : null;
      return {
        parteId: parte.id,
        nombre: parte.nombre,
        tipo: parte.tipo,
        puntuacionMax: parte.puntuacion || 0,
        auto: { total: autoQ.length, aciertos, pct: pctAuto },
        manual: { total: manualQ.length, ...manualEval, pct: pctManual },
      };
    });

    const totalAuto = porParte.reduce((s, p) => s + p.auto.total, 0);
    const totalAciertos = porParte.reduce((s, p) => s + p.auto.aciertos, 0);
    const globalAuto = totalAuto ? Math.round((totalAciertos / totalAuto) * 100) : null;
    const totalManualEval = porParte.reduce((s, p) => s + p.manual.total - p.manual.sinEvaluar, 0);
    let globalEstimado = null;
    if (totalManualEval > 0 && totalAuto > 0) {
      const ms = porParte.reduce((s, p) => s + p.manual.correcta + p.manual.parcial * 0.5, 0);
      globalEstimado = Math.round(((totalAciertos + ms) / (totalAuto + totalManualEval)) * 100);
    }
    return { porParte, globalAuto, globalEstimado };
  },

  delete(id) { saveAll(getAll().filter(s => s.id !== id)); },

  resetAll() { localStorage.removeItem(KEY); },
};
