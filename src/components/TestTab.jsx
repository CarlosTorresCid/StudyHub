import { useMemo, useState } from 'react';
import { progressService } from '../services/progressService';
import './TestTab.css';

function normalizeOption(opcion) {
  if (typeof opcion === 'string') return opcion;
  if (opcion?.texto) return opcion.texto;
  if (opcion?.label) return opcion.label;

  try {
    return JSON.stringify(opcion);
  } catch {
    return '';
  }
}

export default function TestTab({ preguntas, asignaturaId, temaId }) {
  const all = useMemo(() => [
    ...(preguntas?.test || []).map(p => ({ ...p, _tipo: 'test' })),
    ...(preguntas?.verdaderoFalso || []).map(p => ({ ...p, _tipo: 'vf' })),
    ...(preguntas?.desarrollo || []).map(p => ({ ...p, _tipo: 'desarrollo' })),
    ...(preguntas?.practicas || []).map(p => ({ ...p, _tipo: 'practica' })),
  ], [preguntas]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [devAnswer, setDevAnswer] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const [filter, setFilter] = useState('all');
  const [retryQuestions, setRetryQuestions] = useState(null);

  const filtered = useMemo(() => {
    const base = retryQuestions || all;
    return filter === 'all' ? base : base.filter(p => p._tipo === filter);
  }, [all, filter, retryQuestions]);

  const resetState = () => {
    setIdx(0);
    setSelected(null);
    setDevAnswer('');
    setConfirmed(false);
    setResults([]);
    setFinished(false);
  };

  const reset = () => {
    setRetryQuestions(null);
    setFilter('all');
    resetState();
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    setRetryQuestions(null);
    resetState();
  };

  const retryErrors = () => {
    const wrongIds = results
      .filter(r => r.correct === false)
      .map(r => r.id);

    const wrongQuestions = filtered.filter(q => wrongIds.includes(q.id));

    if (!wrongQuestions.length) return;

    setRetryQuestions(wrongQuestions);
    setFilter('all');
    resetState();
  };

  if (!filtered.length) {
    return <p className="empty-msg">No hay preguntas con el filtro seleccionado.</p>;
  }

  const q = filtered[idx];
  const isLast = idx === filtered.length - 1;

  const saveAutoResultIfNeeded = (finalResults) => {
    const auto = finalResults.filter(r => r.correct !== null);

    if (auto.length > 0) {
      progressService.guardarResultado(
        asignaturaId,
        temaId,
        'test',
        auto.filter(r => r.correct).length,
        auto.length
      );
    }
  };

  const confirm = () => {
    let result;

    if (q._tipo === 'test' || q._tipo === 'vf') {
      const correct = selected === q.respuestaCorrecta;

      result = { id: q.id, correct };

      if (correct) {
        progressService.registrarAcierto(q.id);
      } else {
        progressService.registrarFallo(q.id);
      }
    } else {
      result = {
        id: q.id,
        correct: null,
        answer: devAnswer,
      };
    }

    setResults(r => [...r, result]);
    setConfirmed(true);
  };

  const next = () => {
    if (isLast) {
      setResults(currentResults => {
        saveAutoResultIfNeeded(currentResults);
        return currentResults;
      });

      setFinished(true);
      return;
    }

    setIdx(i => i + 1);
    setSelected(null);
    setDevAnswer('');
    setConfirmed(false);
  };

  if (finished) {
    const auto = results.filter(r => r.correct !== null);
    const aciertos = auto.filter(r => r.correct).length;
    const fallos = auto.filter(r => r.correct === false).length;
    const pct = auto.length ? Math.round((aciertos / auto.length) * 100) : null;

    return (
      <div className="test-results">
        <div className="test-results-score">
          {pct !== null ? (
            <>
              <div
                className="test-score-circle"
                style={{
                  '--pct': pct,
                  color:
                    pct >= 70
                      ? 'var(--success)'
                      : pct >= 50
                      ? 'var(--warning)'
                      : 'var(--danger)',
                }}
              >
                {pct}%
              </div>
              <p>{aciertos} de {auto.length} preguntas automáticas correctas</p>
            </>
          ) : (
            <p>✍️ Preguntas de desarrollo completadas</p>
          )}
        </div>

        <div className="test-results-list">
          {results.map((r, i) => {
            const resultQuestion = filtered[i];

            if (!resultQuestion) return null;

            return (
              <div
                key={`${resultQuestion.id}-${i}`}
                className={`test-result-row ${
                  r.correct === true
                    ? 'correct'
                    : r.correct === false
                    ? 'wrong'
                    : 'dev'
                }`}
              >
                <div className="test-result-indicator">
                  {r.correct === true ? '✓' : r.correct === false ? '✗' : '✍'}
                </div>

                <div>
                  <div className="test-result-q">{resultQuestion.enunciado}</div>

                  {r.correct === false && (
                    <div className="test-result-exp">
                      <strong>Explicación:</strong>{' '}
                      {resultQuestion.explicacion || 'No hay explicación registrada.'}
                    </div>
                  )}

                  {r.correct === null && r.answer && (
                    <div className="test-result-exp">
                      <strong>Tu respuesta:</strong> {r.answer}
                      <br />
                      <strong>Respuesta modelo:</strong>{' '}
                      {resultQuestion.respuestaModelo ||
                        resultQuestion.solucionOrientativa ||
                        'No hay respuesta modelo registrada.'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="test-results-actions">
          <button className="btn btn-primary" onClick={reset}>
            🔄 Repetir todo
          </button>

          {fallos > 0 ? (
            <button className="btn btn-ghost" onClick={retryErrors}>
              Repasar errores ({fallos})
            </button>
          ) : auto.length > 0 ? (
            <span className="test-no-errors">No hay errores que repasar.</span>
          ) : null}
        </div>
      </div>
    );
  }

  const types = [...new Set(all.map(p => p._tipo))];

  return (
    <div className="test-tab">
      {retryQuestions && (
        <div className="test-retry-banner">
          Repasando solo las preguntas falladas del intento anterior.
        </div>
      )}

      {types.length > 1 && !retryQuestions && (
        <div className="test-filter">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => changeFilter('all')}
          >
            Todos
          </button>

          {types.includes('test') && (
            <button
              className={`btn btn-sm ${filter === 'test' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => changeFilter('test')}
            >
              Test
            </button>
          )}

          {types.includes('vf') && (
            <button
              className={`btn btn-sm ${filter === 'vf' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => changeFilter('vf')}
            >
              V/F
            </button>
          )}

          {types.includes('desarrollo') && (
            <button
              className={`btn btn-sm ${filter === 'desarrollo' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => changeFilter('desarrollo')}
            >
              Desarrollo
            </button>
          )}

          {types.includes('practica') && (
            <button
              className={`btn btn-sm ${filter === 'practica' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => changeFilter('practica')}
            >
              Práctica
            </button>
          )}
        </div>
      )}

      <div className="test-progress">
        <div className="test-progress-bar">
          <div
            className="test-progress-fill"
            style={{ width: `${(idx / filtered.length) * 100}%` }}
          />
        </div>
        <span>{idx + 1} / {filtered.length}</span>
      </div>

      <div className="test-question">
        <div className="test-question-meta">
          <span className={`badge badge-${q.dificultad || 'media'}`}>
            {q.dificultad || 'media'}
          </span>

          <span className="test-origen">
            {q.origen === 'examen_real'
              ? '📝 Examen real'
              : q.origen === 'material_original'
              ? '📚 Material'
              : q.origen === 'recopilada'
              ? '📚 Recopilada'
              : '🤖 Generada'}
          </span>
        </div>

        <p className="test-question-text">{q.enunciado}</p>

        {q._tipo === 'test' && (
          <div className="test-options">
            {q.opciones.map((op, i) => (
              <button
                key={i}
                type="button"
                className={`test-option ${
                  selected === i ? 'selected' : ''
                } ${
                  confirmed
                    ? i === q.respuestaCorrecta
                      ? 'correct'
                      : selected === i
                      ? 'wrong'
                      : ''
                    : ''
                }`}
                onClick={() => !confirmed && setSelected(i)}
                disabled={confirmed}
              >
                <span className="test-option-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                {normalizeOption(op)}
              </button>
            ))}
          </div>
        )}

        {q._tipo === 'vf' && (
          <div className="test-options test-vf">
            {[true, false].map(val => (
              <button
                key={String(val)}
                type="button"
                className={`test-option ${
                  selected === val ? 'selected' : ''
                } ${
                  confirmed
                    ? val === q.respuestaCorrecta
                      ? 'correct'
                      : selected === val
                      ? 'wrong'
                      : ''
                    : ''
                }`}
                onClick={() => !confirmed && setSelected(val)}
                disabled={confirmed}
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
                    <ul>
                      {q.criteriosCorreccion.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
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
            type="button"
            className="btn btn-primary"
            disabled={
              q._tipo === 'test' || q._tipo === 'vf'
                ? selected === null
                : !devAnswer.trim()
            }
            onClick={confirm}
          >
            Confirmar respuesta
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={next}>
            {isLast ? 'Ver resultados →' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  );
}