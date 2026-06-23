import { useEffect, useMemo, useState } from 'react';
import { testStatsService, STATS_UPDATED_EVENT } from '../services/testStatsService';
import './TestStatsSummary.css';

function getCellStatus(attempts, accuracy) {
  if (attempts === 0 || accuracy === null) return 'unseen';
  if (accuracy >= 90) return 'excellent';
  if (accuracy >= 75) return 'good';
  if (accuracy >= 60) return 'ok';
  if (accuracy >= 40) return 'medium';
  if (accuracy >= 20) return 'bad';
  return 'critical';
}

function getTrendInfo(attempts, correct, wrong, lastResult) {
  if (attempts === 0) return { icon: '—', label: 'Sin practicar' };
  if (correct > 0 && wrong === 0) return { icon: '✓', label: 'Dominada' };
  if (correct === 0 && wrong > 0) return { icon: '!', label: 'Crítica' };
  if (lastResult === 'correct') return { icon: '↑', label: 'Mejorando' };
  if (lastResult === 'wrong') return { icon: '↓', label: 'Empeorando' };
  return { icon: '~', label: 'Inestable' };
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
      const wrong = s?.wrong || 0;
      const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : null;
      const lastResult = s?.lastResult ?? null;
      const trend = getTrendInfo(attempts, correct, wrong, lastResult);

      return {
        id: q.id,
        number: index + 1,
        attempts,
        correct,
        wrong,
        accuracy,
        trend,
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
                {details.map(item => {
                  const tooltip = item.attempts === 0
                    ? `P${item.number} · Sin practicar`
                    : [
                        `P${item.number}`,
                        `${item.correct} acierto${item.correct !== 1 ? 's' : ''}`,
                        `${item.wrong} fallo${item.wrong !== 1 ? 's' : ''}`,
                        `${item.attempts} intento${item.attempts !== 1 ? 's' : ''}`,
                        `tendencia: ${item.trend.label.toLowerCase()}`,
                      ].join(' · ');

                  const handleScrollTo = () => {
                    const el = document.getElementById(`q-${item.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  };

                  return (
                    <div
                      key={item.id}
                      className={`test-stat-cell test-stat-cell--${item.status}`}
                      title={tooltip}
                      role="button"
                      tabIndex={0}
                      onClick={handleScrollTo}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleScrollTo();
                        }
                      }}
                    >
                      <span className="test-stat-cell-num">
                        P{item.number}
                        {item.attempts > 0 && (
                          <span className="test-stat-cell-trend" aria-hidden="true"> {item.trend.icon}</span>
                        )}
                      </span>
                      <span className="test-stat-cell-pct">
                        {item.accuracy !== null ? `${item.accuracy}%` : '—'}
                      </span>
                      {item.attempts > 0 && (
                        <span className="test-stat-cell-tries">{item.attempts}i</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
