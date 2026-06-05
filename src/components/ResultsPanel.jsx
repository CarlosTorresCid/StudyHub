import './ResultsPanel.css';

const colorFor = (pct) => {
  if (pct === null || pct === undefined) return 'var(--text-muted)';
  if (pct >= 70) return 'var(--success)';
  if (pct >= 50) return 'var(--warning)';
  return 'var(--danger)';
};

export default function ResultsPanel({ resultado, partes, mode, onRetry }) {
  const { porParte, globalAuto, globalEstimado } = resultado;
  const hasManual = porParte.some(p => p.manual.total > 0);
  const pendingManual = porParte.reduce((s, p) => s + p.manual.sinEvaluar, 0);

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>{mode === 'parcial' ? '📝 Práctica parcial — Resultados' : '🎯 Simulacro — Resultados'}</h2>
      </div>

      {/* Global score */}
      <div className="results-global-row">
        {globalAuto !== null && globalAuto !== undefined && (
          <div className="results-score-block">
            <div className="results-score-circle" style={{ color: colorFor(globalAuto) }}>
              <span className="results-score-value">{globalAuto}%</span>
            </div>
            <span className="results-score-lbl">Automático (test/vf)</span>
          </div>
        )}
        {globalEstimado !== null && globalEstimado !== undefined && (
          <div className="results-score-block">
            <div className="results-score-circle" style={{ color: colorFor(globalEstimado), borderStyle: 'dashed' }}>
              <span className="results-score-value">{globalEstimado}%</span>
            </div>
            <span className="results-score-lbl">Estimado combinado</span>
          </div>
        )}
        {globalAuto === null && globalAuto === undefined && !globalEstimado && (
          <p className="results-no-auto">Solo preguntas abiertas — evalúa manualmente</p>
        )}
      </div>

      {pendingManual > 0 && (
        <div className="results-pending">
          ⚠ Hay {pendingManual} pregunta{pendingManual > 1 ? 's' : ''} abierta{pendingManual > 1 ? 's' : ''} sin autoevaluar.
          La puntuación estimada no incluye las no evaluadas.
        </div>
      )}

      {/* Per-part breakdown */}
      <div className="results-parts">
        {porParte.map((parte) => (
          <div key={parte.parteId} className="results-part-card">
            <div className="results-part-nombre">{parte.nombre}</div>

            {parte.auto.total > 0 && (
              <div className="results-part-section">
                <span className="results-part-type-lbl">Automático</span>
                <span className="results-part-score" style={{ color: colorFor(parte.auto.pct) }}>
                  {parte.auto.aciertos}/{parte.auto.total}
                  {parte.auto.pct !== null && ` — ${parte.auto.pct}%`}
                </span>
              </div>
            )}

            {parte.manual.total > 0 && (
              <div className="results-part-section">
                <span className="results-part-type-lbl">Abierto</span>
                <div className="results-manual-summary">
                  {parte.manual.correcta > 0 && <span className="rm-correct">✓ {parte.manual.correcta}</span>}
                  {parte.manual.parcial > 0 && <span className="rm-partial">≈ {parte.manual.parcial}</span>}
                  {parte.manual.incorrecta > 0 && <span className="rm-wrong">✗ {parte.manual.incorrecta}</span>}
                  {parte.manual.sinEvaluar > 0 && <span className="rm-pending">? {parte.manual.sinEvaluar} sin evaluar</span>}
                  {parte.manual.pct !== null && (
                    <span className="rm-pct" style={{ color: colorFor(parte.manual.pct) }}>
                      {parte.manual.pct}%
                    </span>
                  )}
                </div>
              </div>
            )}

            {parte.puntuacionMax > 0 && (
              <div className="results-part-pts">Peso: {parte.puntuacionMax} pts</div>
            )}
          </div>
        ))}
      </div>

      {onRetry && (
        <div className="results-actions">
          <button className="btn btn-primary" onClick={onRetry}>🔄 Repetir</button>
        </div>
      )}
    </div>
  );
}
