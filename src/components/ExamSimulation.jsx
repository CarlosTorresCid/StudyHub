import { useState, useEffect, useRef } from 'react';
import ResultsPanel from './ResultsPanel';
import { simulationService } from '../services/simulationService';
import './ExamSimulation.css';

const OPEN_TYPES = ['desarrollo', 'practicas', 'sql', 'casos'];

export default function ExamSimulation({ simulacro }) {
  const flatQuestions = simulacro.partes.flatMap(p =>
    p.preguntas.map(q => ({ ...q, _parteNombre: p.nombre, _parteId: p.id }))
  );

  const [idx, setIdx] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [manualGrades, setManualGrades] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [devAnswer, setDevAnswer] = useState('');
  const [finished, setFinished] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [timeLeft, setTimeLeft] = useState(
    simulacro.opciones?.duracionMinutos ? simulacro.opciones.duracionMinutos * 60 : null
  );
  const timerRef = useRef(null);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { finish(); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const finish = () => {
    const completado = { ...simulacro, respuestas, manualGrades, completado: true };
    const res = simulationService.calcularResultados(completado);
    completado.resultado = res;
    simulationService.save(completado);
    setResultado(res);
    setFinished(true);
  };

  if (!flatQuestions.length) {
    return (
      <div className="sim-empty">
        <p>No hay preguntas disponibles para este simulacro.</p>
        <p>Importa preguntas desde el panel de administración.</p>
      </div>
    );
  }

  if (finished && resultado) {
    return (
      <ResultsPanel
        resultado={resultado}
        partes={simulacro.partes}
        mode={simulacro.mode}
        onRetry={() => {
          setIdx(0); setRespuestas({}); setManualGrades({}); setConfirmed({});
          setDevAnswer(''); setFinished(false); setResultado(null);
          if (simulacro.opciones?.duracionMinutos)
            setTimeLeft(simulacro.opciones.duracionMinutos * 60);
        }}
      />
    );
  }

  const q = flatQuestions[idx];
  const isLast = idx === flatQuestions.length - 1;
  const isConfirmed = !!confirmed[q.id];
  const selected = respuestas[q.id];
  const tipo = q.tipo === 'verdaderoFalso' ? 'vf' : q.tipo;
  const isOpen = OPEN_TYPES.includes(tipo);
  const isAutoGradable = tipo === 'test' || tipo === 'vf';
  const currentGrade = manualGrades[q.id];

  const confirm = () => {
    if (isOpen) setRespuestas(r => ({ ...r, [q.id]: devAnswer }));
    setConfirmed(c => ({ ...c, [q.id]: true }));
  };

  const grade = (val) => setManualGrades(g => ({ ...g, [q.id]: val }));

  const next = () => {
    if (isLast) finish();
    else { setIdx(i => i + 1); setDevAnswer(''); }
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const progress = Math.round(((idx) / flatQuestions.length) * 100);

  return (
    <div className="sim-wrapper">
      <div className="sim-header">
        <div className="sim-progress-bar">
          <div className="sim-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="sim-header-info">
          <span className="sim-counter">{idx + 1} / {flatQuestions.length}</span>
          <span className="sim-parte">{q._parteNombre}</span>
          {timeLeft !== null && (
            <span className={`sim-timer ${timeLeft < 120 ? 'warning' : ''}`}>
              ⏱ {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      <div className="sim-question">
        <div className="sim-question-meta">
          <span className="sim-tipo">{q.tipo}</span>
          {q.origen === 'examen_real' && <span className="sim-origen real">📝 Examen real</span>}
          {q.origen === 'generada_ia' && <span className="sim-origen ia">🤖 Generada</span>}
          {q.convocatoria && <span className="sim-conv">{q.convocatoria}</span>}
        </div>
        <p className="sim-enunciado">{q.enunciado}</p>

        {tipo === 'test' && (
          <div className="sim-options">
            {q.opciones.map((op, i) => {
              let cls = 'sim-option';
              if (selected === i) cls += ' selected';
              if (isConfirmed) {
                if (i === q.respuestaCorrecta) cls += ' correct';
                else if (selected === i) cls += ' wrong';
              }
              return (
                <button key={i} className={cls}
                  onClick={() => !isConfirmed && setRespuestas(r => ({ ...r, [q.id]: i }))}>
                  <span className="sim-option-letter">{String.fromCharCode(65 + i)}</span>
                  {op}
                </button>
              );
            })}
          </div>
        )}

        {tipo === 'vf' && (
          <div className="sim-options sim-vf">
            {[true, false].map(val => {
              let cls = 'sim-option';
              if (selected === val) cls += ' selected';
              if (isConfirmed) {
                if (val === q.respuestaCorrecta) cls += ' correct';
                else if (selected === val) cls += ' wrong';
              }
              return (
                <button key={String(val)} className={cls}
                  onClick={() => !isConfirmed && setRespuestas(r => ({ ...r, [q.id]: val }))}>
                  <span className="sim-option-letter">{val ? 'V' : 'F'}</span>
                  {val ? 'Verdadero' : 'Falso'}
                </button>
              );
            })}
          </div>
        )}

        {isOpen && (
          <div className="sim-dev">
            <textarea className="form-input" rows={6}
              placeholder="Escribe tu respuesta aquí..."
              value={devAnswer}
              onChange={e => setDevAnswer(e.target.value)}
              disabled={isConfirmed} />
            {isConfirmed && (
              <div className="sim-dev-model">
                <strong>Respuesta de referencia:</strong>
                <p>{q.respuestaModelo || q.solucionOrientativa || '—'}</p>
                {q.criteriosCorreccion?.length > 0 && (
                  <ul>{q.criteriosCorreccion.map((c, i) => <li key={i}>{c}</li>)}</ul>
                )}
              </div>
            )}
          </div>
        )}

        {isConfirmed && q.explicacion && !isOpen && (
          <div className="sim-explanation">💡 {q.explicacion}</div>
        )}

        {/* Manual evaluation for open questions */}
        {isConfirmed && isOpen && (
          <div className="sim-manual-grade">
            <span className="sim-manual-label">Tu autoevaluación:</span>
            <div className="sim-manual-btns">
              <button
                className={`sim-grade-btn correct ${currentGrade === 'correcta' ? 'active' : ''}`}
                onClick={() => grade('correcta')}>
                ✓ Correcta
              </button>
              <button
                className={`sim-grade-btn partial ${currentGrade === 'parcial' ? 'active' : ''}`}
                onClick={() => grade('parcial')}>
                ≈ Parcial
              </button>
              <button
                className={`sim-grade-btn wrong ${currentGrade === 'incorrecta' ? 'active' : ''}`}
                onClick={() => grade('incorrecta')}>
                ✗ Incorrecta
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sim-actions">
        {!isConfirmed ? (
          <button className="btn btn-primary"
            disabled={isAutoGradable ? selected === undefined : false}
            onClick={confirm}>
            Confirmar
          </button>
        ) : (
          <button className="btn btn-primary" onClick={next}>
            {isLast ? 'Ver resultados →' : 'Siguiente →'}
          </button>
        )}
        {!isConfirmed && (
          <button className="btn btn-ghost btn-sm"
            onClick={() => setConfirmed(c => ({ ...c, [q.id]: true }))}>
            Saltar
          </button>
        )}
      </div>
    </div>
  );
}
