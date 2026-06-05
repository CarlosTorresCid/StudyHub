import { useState } from 'react';
import { progressService } from '../services/progressService';
import './TestTab.css';

export default function TestTab({ preguntas, asignaturaId, temaId }) {
  const all = [
    ...(preguntas?.test || []).map(p => ({ ...p, _tipo: 'test' })),
    ...(preguntas?.verdaderoFalso || []).map(p => ({ ...p, _tipo: 'vf' })),
    ...(preguntas?.desarrollo || []).map(p => ({ ...p, _tipo: 'desarrollo' })),
    ...(preguntas?.practicas || []).map(p => ({ ...p, _tipo: 'practica' })),
  ];

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [devAnswer, setDevAnswer] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? all : all.filter(p => p._tipo === filter);

  if (!filtered.length) return <p className="empty-msg">No hay preguntas con el filtro seleccionado.</p>;

  const q = filtered[idx];
  const isLast = idx === filtered.length - 1;

  const confirm = () => {
    if (q._tipo === 'test' || q._tipo === 'vf') {
      const correct = selected === q.respuestaCorrecta;
      setResults(r => [...r, { id: q.id, correct }]);
      if (correct) progressService.registrarAcierto(q.id);
      else progressService.registrarFallo(q.id);
    } else {
      setResults(r => [...r, { id: q.id, correct: null, answer: devAnswer }]);
    }
    setConfirmed(true);
  };

  const next = () => {
    if (isLast) {
      const auto = results.filter(r => r.correct !== null);
      if (auto.length > 0) {
        progressService.guardarResultado(asignaturaId, temaId, 'test',
          auto.filter(r => r.correct).length, auto.length);
      }
      setFinished(true);
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setDevAnswer('');
      setConfirmed(false);
    }
  };

  const reset = () => {
    setIdx(0); setSelected(null); setDevAnswer('');
    setConfirmed(false); setResults([]); setFinished(false);
  };

  if (finished) {
    const auto = results.filter(r => r.correct !== null);
    const aciertos = auto.filter(r => r.correct).length;
    const pct = auto.length ? Math.round((aciertos / auto.length) * 100) : null;
    return (
      <div className="test-results">
        <div className="test-results-score">
          {pct !== null ? (
            <>
              <div className="test-score-circle" style={{ '--pct': pct, color: pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                {pct}%
              </div>
              <p>{aciertos} de {auto.length} preguntas automáticas correctas</p>
            </>
          ) : <p>✍️ Preguntas de desarrollo completadas</p>}
        </div>
        <div className="test-results-list">
          {results.map((r, i) => {
            const q = filtered[i];
            return (
              <div key={i} className={`test-result-row ${r.correct === true ? 'correct' : r.correct === false ? 'wrong' : 'dev'}`}>
                <div className="test-result-indicator">
                  {r.correct === true ? '✓' : r.correct === false ? '✗' : '✍'}
                </div>
                <div>
                  <div className="test-result-q">{q.enunciado}</div>
                  {r.correct === false && (
                    <div className="test-result-exp">
                      <strong>Explicación:</strong> {q.explicacion}
                    </div>
                  )}
                  {r.correct === null && r.answer && (
                    <div className="test-result-exp">
                      <strong>Tu respuesta:</strong> {r.answer}<br />
                      <strong>Respuesta modelo:</strong> {q.respuestaModelo}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn btn-primary" onClick={reset}>🔄 Repetir</button>
      </div>
    );
  }

  const types = [...new Set(all.map(p => p._tipo))];

  return (
    <div className="test-tab">
      {types.length > 1 && (
        <div className="test-filter">
          <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setFilter('all'); reset(); }}>Todos</button>
          {types.includes('test') && <button className={`btn btn-sm ${filter === 'test' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setFilter('test'); reset(); }}>Test</button>}
          {types.includes('vf') && <button className={`btn btn-sm ${filter === 'vf' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setFilter('vf'); reset(); }}>V/F</button>}
          {types.includes('desarrollo') && <button className={`btn btn-sm ${filter === 'desarrollo' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setFilter('desarrollo'); reset(); }}>Desarrollo</button>}
        </div>
      )}

      <div className="test-progress">
        <div className="test-progress-bar">
          <div className="test-progress-fill" style={{ width: `${((idx) / filtered.length) * 100}%` }} />
        </div>
        <span>{idx + 1} / {filtered.length}</span>
      </div>

      <div className="test-question">
        <div className="test-question-meta">
          <span className={`badge badge-${q.dificultad || 'media'}`}>{q.dificultad || 'media'}</span>
          <span className="test-origen">{q.origen === 'examen_real' ? '📝 Examen real' : q.origen === 'material_original' ? '📚 Material' : '🤖 Generada'}</span>
        </div>
        <p className="test-question-text">{q.enunciado}</p>

        {(q._tipo === 'test') && (
          <div className="test-options">
            {q.opciones.map((op, i) => (
              <button
                key={i}
                className={`test-option ${selected === i ? 'selected' : ''} ${confirmed ? (i === q.respuestaCorrecta ? 'correct' : selected === i ? 'wrong' : '') : ''}`}
                onClick={() => !confirmed && setSelected(i)}
              >
                <span className="test-option-letter">{String.fromCharCode(65 + i)}</span>
                {op}
              </button>
            ))}
          </div>
        )}

        {q._tipo === 'vf' && (
          <div className="test-options test-vf">
            {[true, false].map(val => (
              <button
                key={String(val)}
                className={`test-option ${selected === val ? 'selected' : ''} ${confirmed ? (val === q.respuestaCorrecta ? 'correct' : selected === val ? 'wrong' : '') : ''}`}
                onClick={() => !confirmed && setSelected(val)}
              >
                <span className="test-option-letter">{val ? 'V' : 'F'}</span>
                {val ? 'Verdadero' : 'Falso'}
              </button>
            ))}
          </div>
        )}

        {(q._tipo === 'desarrollo' || q._tipo === 'practica') && (
          <div className="test-dev">
            <textarea
              className="test-dev-textarea"
              placeholder="Escribe tu respuesta aquí..."
              value={devAnswer}
              onChange={e => setDevAnswer(e.target.value)}
              disabled={confirmed}
              rows={5}
            />
            {confirmed && (
              <div className="test-dev-model">
                <strong>Respuesta modelo:</strong>
                <p>{q.respuestaModelo || q.solucionOrientativa}</p>
                {q.criteriosCorreccion?.length > 0 && (
                  <div className="test-criterios">
                    <strong>Criterios:</strong>
                    <ul>{q.criteriosCorreccion.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {confirmed && q.explicacion && (
          <div className="test-explanation">{q.explicacion}</div>
        )}
      </div>

      <div className="test-actions">
        {!confirmed ? (
          <button
            className="btn btn-primary"
            disabled={(q._tipo === 'test' || q._tipo === 'vf') ? selected === null : !devAnswer.trim()}
            onClick={confirm}
          >
            Confirmar respuesta
          </button>
        ) : (
          <button className="btn btn-primary" onClick={next}>
            {isLast ? 'Ver resultados →' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  );
}
