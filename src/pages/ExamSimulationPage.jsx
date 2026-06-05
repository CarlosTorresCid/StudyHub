import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { subjectService } from '../services/subjectService';
import { simulationService } from '../services/simulationService';
import './ExamSimulationPage.css';

export default function ExamSimulationPage() {
  const { asignaturaId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [fuentes, setFuentes] = useState('ambas');
  const [duracion, setDuracion] = useState(0);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    setSubject(subjectService.getById(asignaturaId));
    setHistorial(simulationService.getByAsignatura(asignaturaId).filter(s => s.completado).slice(0, 5));
  }, [asignaturaId]);

  useEffect(() => {
    setDisponibilidad(simulationService.getDisponibilidad(asignaturaId, fuentes));
  }, [asignaturaId, fuentes]);

  const canCompleto = simulationService.canStartCompleto(asignaturaId, fuentes);
  const canParcial = simulationService.canStartParcial(asignaturaId, fuentes);

  const launch = (mode) => {
    const opts = { fuentes, duracionMinutos: duracion || null, mode };
    const sim = simulationService.generate(asignaturaId, opts);
    if (!sim) return;
    simulationService.save(sim);
    navigate(`/simulacro/${asignaturaId}/resolver?sid=${sim.id}`);
  };

  if (!subject) return <div className="page-error">Cargando...</div>;

  const colorFor = (pct) => pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="sim-setup-page">
      <div className="sim-setup-hero" style={{ '--subject-color': subject.color }}>
        <span className="sim-setup-icon">{subject.icono}</span>
        <div>
          <div className="sim-setup-abrev">{subject.abreviatura}</div>
          <h1>Simulacro de examen</h1>
          <p>{subject.nombre}</p>
        </div>
      </div>

      {disponibilidad.length === 0 ? (
        <div className="sim-no-structure">
          <p>Esta asignatura no tiene estructura de examen definida.</p>
          <Link to={`/gestion/asignatura/${asignaturaId}/examen`} className="btn btn-primary">
            ⚙ Definir estructura del examen
          </Link>
        </div>
      ) : (
        <>
          <div className="sim-setup-section">
            <h2>Partes del examen</h2>
            <div className="sim-structure-list">
              {disponibilidad.map(d => (
                <div key={d.parteId} className="sim-structure-row">
                  <div className="sim-structure-info">
                    <div className="sim-structure-nombre">{d.nombre}</div>
                    <div className="sim-structure-meta">
                      <span>Requiere: {d.requeridas} preguntas</span>
                    </div>
                  </div>
                  <div className={`sim-structure-avail ${d.disponibles === 0 ? 'none' : d.suficiente ? 'ok' : 'partial'}`}>
                    {d.disponibles} disponibles
                    {!d.suficiente && d.disponibles > 0 && (
                      <span className="sim-avail-gap"> (faltan {d.requeridas - d.disponibles})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sim-setup-section">
            <h2>Configuración</h2>
            <div className="sim-config-grid">
              <div className="sim-config-item">
                <label>Fuentes de preguntas</label>
                <div className="sim-config-pills">
                  {[
                    { v: 'ambas', l: 'Todas' },
                    { v: 'reales', l: '📝 Solo examen real' },
                    { v: 'generadas', l: '🤖 Solo generadas' },
                  ].map(opt => (
                    <button key={opt.v}
                      className={`q-filter-pill ${fuentes === opt.v ? 'active' : ''}`}
                      onClick={() => setFuentes(opt.v)}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sim-config-item">
                <label>Temporizador (minutos, 0 = sin límite)</label>
                <input className="form-input" type="number" min={0} max={300}
                  value={duracion} onChange={e => setDuracion(parseInt(e.target.value) || 0)}
                  style={{ maxWidth: 120 }} />
              </div>
            </div>
          </div>

          <div className="sim-launch-grid">
            <div className="sim-launch-card">
              <div className="sim-launch-card-header">
                <span className="sim-launch-icon">🎯</span>
                <div>
                  <div className="sim-launch-title">Simulacro completo</div>
                  <div className="sim-launch-desc">Reproduce exactamente la estructura del examen real</div>
                </div>
              </div>
              {!canCompleto && disponibilidad.length > 0 && (
                <div className="sim-launch-blockers">
                  {disponibilidad.filter(d => !d.suficiente).map(d => (
                    <span key={d.parteId} className="sim-launch-blocker">
                      {d.nombre}: {d.disponibles}/{d.requeridas}
                    </span>
                  ))}
                </div>
              )}
              <button className="btn btn-primary btn-lg" onClick={() => launch('completo')} disabled={!canCompleto}>
                Comenzar simulacro completo
              </button>
            </div>

            <div className="sim-launch-card sim-launch-card-parcial">
              <div className="sim-launch-card-header">
                <span className="sim-launch-icon">📝</span>
                <div>
                  <div className="sim-launch-title">Práctica parcial</div>
                  <div className="sim-launch-desc">Solo partes con preguntas disponibles</div>
                </div>
              </div>
              {canParcial && (
                <div className="sim-launch-blockers">
                  {disponibilidad.filter(d => d.disponibles === 0).map(d => (
                    <span key={d.parteId} className="sim-launch-blocker">
                      {d.nombre}: sin preguntas
                    </span>
                  ))}
                </div>
              )}
              <button className="btn btn-ghost btn-lg" onClick={() => launch('parcial')} disabled={!canParcial}>
                Iniciar práctica parcial
              </button>
            </div>
          </div>

          {!canParcial && (
            <div className="sim-no-questions">
              No hay preguntas disponibles. <Link to="/gestion/importar/preguntas">Importar preguntas →</Link>
            </div>
          )}

          {historial.length > 0 && (
            <div className="sim-setup-section">
              <h2>Historial reciente</h2>
              <div className="sim-historial">
                {historial.map(s => {
                  const pct = s.resultado?.globalAuto;
                  return (
                    <div key={s.id} className="sim-historial-row">
                      <span className="sim-historial-fecha">
                        {new Date(s.fecha).toLocaleDateString('es-ES')}
                      </span>
                      <span className="sim-historial-mode">{s.mode === 'parcial' ? 'Parcial' : 'Completo'}</span>
                      {pct !== null && pct !== undefined && (
                        <span className="sim-historial-pct" style={{ color: colorFor(pct) }}>{pct}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <Link to={`/asignatura/${asignaturaId}`} className="btn btn-ghost">← Volver</Link>
      </div>
    </div>
  );
}
