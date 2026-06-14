import { useEffect, useMemo, useState } from 'react';
import { testStatsService, STATS_UPDATED_EVENT } from '../services/testStatsService';
import './TestStatsSummary.css';

function attemptsLabel(attempts) {
  if (attempts === 1) return '1 intento';
  return `${attempts} intentos`;
}

function getCellStatus(attempts, accuracy) {
  if (attempts === 0) return 'sin-practicar';
  if (accuracy === 100) return 'dominada';
  if (accuracy === 0) return 'fallada';
  return 'mixta';
}

export default function TestStatsSummary({ subjectId, questions = [] }) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handler = () => setVersion(v => v + 1);
    window.addEventListener(STATS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(STATS_UPDATED_EVENT, handler);
  }, []);

  const summary = useMemo(
    () => testStatsService.getSubjectSummary(subjectId, questions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subjectId, questions, version]
  );

  const details = useMemo(() => {
    const stats = testStatsService.getSubjectStats(subjectId);

    return questions.map((q, index) => {
      const s = stats[q.id];
      const attempts = s?.attempts || 0;
      const correct = s?.correct || 0;
      const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : null;

      return {
        id: q.id,
        number: index + 1,
        enunciado: q.enunciado,
        attempts,
        accuracy,
        status: getCellStatus(attempts, accuracy),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, questions, version]);

  const hasData = summary.intentos > 0;

  const handleReset = () => {
    const confirmed = window.confirm(
      'Esto borrará tu estadística de fallos de tipo test para esta asignatura. ¿Continuar?'
    );
    if (!confirmed) return;

    testStatsService.resetSubjectStats(subjectId);
    setVersion(v => v + 1);
    window.dispatchEvent(new Event(STATS_UPDATED_EVENT));
  };

  return (
    <section className="test-stats-summary">
      <div className="test-stats-header">
        <h2 className="test-stats-title">📊 Rendimiento tipo test</h2>
        {hasData && (
          <button type="button" className="test-stats-reset" onClick={handleReset}>
            Reiniciar estadísticas
          </button>
        )}
      </div>

      {!hasData ? (
        <p className="test-stats-empty">
          Todavía no has practicado preguntas tipo test. Cuando pulses "Comprobar", aquí aparecerá tu rendimiento.
        </p>
      ) : (
        <>
          <div className="test-stats-grid">
            <div className="test-stats-stat">
              <span className="test-stats-value">{summary.practicadas} / {summary.total}</span>
              <span className="test-stats-label">Preguntas practicadas</span>
            </div>
            <div className="test-stats-stat">
              <span className="test-stats-value">{summary.intentos}</span>
              <span className="test-stats-label">Intentos totales</span>
            </div>
            <div className="test-stats-stat">
              <span className="test-stats-value">{summary.aciertos}</span>
              <span className="test-stats-label">Aciertos</span>
            </div>
            <div className="test-stats-stat">
              <span className="test-stats-value">{summary.fallos}</span>
              <span className="test-stats-label">Fallos</span>
            </div>
            <div className="test-stats-stat">
              <span className="test-stats-value">{summary.failRate}%</span>
              <span className="test-stats-label">% fallo medio</span>
            </div>
          </div>

          {details.length > 0 && (
            <div className="test-stats-detail">
              <span className="test-stats-detail-title">Detalle por pregunta</span>
              <div className="test-stats-detail-grid">
                {details.map(item => (
                  <div
                    key={item.id}
                    className={`test-stats-detail-cell test-stats-detail-cell--${item.status}`}
                    title={item.enunciado}
                  >
                    <span className="test-stats-detail-num">P{item.number}</span>
                    <span className="test-stats-detail-attempts">{attemptsLabel(item.attempts)}</span>
                    <span className="test-stats-detail-accuracy">
                      {item.accuracy !== null ? `${item.accuracy}% acierto` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
