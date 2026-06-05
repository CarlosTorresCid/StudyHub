import { Link } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { progressService } from '../services/progressService';
import { simulationService } from '../services/simulationService';
import './DashboardPage.css';

// Los datos de asignaturas proceden del repositorio (publicLibrary).
// El progreso mostrado procede del localStorage del visitante.
export default function DashboardPage() {
  const subjects = publicLibrary.getSubjects();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Mis Asignaturas</h1>
          <p className="dashboard-subtitle">Grado en Ingeniería Informática · UNIR</p>
        </div>
      </header>

      <div className="dashboard-grid">
        {subjects.map(a => {
          const ultimoTest = progressService.getUltimoResultado(a.id);
          const ultimoSim = simulationService.getLastCompleted(a.id);
          const temasCount = a.temas?.length || 0;

          let scorePct = null, scoreLabel = null;
          if (ultimoSim?.resultado?.globalAuto !== null && ultimoSim?.resultado?.globalAuto !== undefined) {
            scorePct = ultimoSim.resultado.globalAuto;
            scoreLabel = 'Último simulacro';
          } else if (ultimoTest) {
            scorePct = Math.round((ultimoTest.aciertos / ultimoTest.total) * 100);
            scoreLabel = 'Último test';
          }

          return (
            <Link key={a.id} to={`/asignatura/${a.id}`} className="subject-card" style={{ '--subject-color': a.color }}>
              <div className="subject-card-top">
                <span className="subject-card-icon">{a.icono}</span>
                <span className="subject-card-abrev">{a.abreviatura}</span>
              </div>
              <h2 className="subject-card-name">{a.nombre}</h2>
              <div className="subject-card-bottom">
                {scorePct !== null ? (
                  <div className="subject-card-stat">
                    <span className="subject-card-stat-label">{scoreLabel}</span>
                    <span className="subject-card-stat-val" style={{
                      color: scorePct >= 70 ? 'var(--success)' : scorePct >= 50 ? 'var(--warning)' : 'var(--danger)'
                    }}>{scorePct}%</span>
                  </div>
                ) : (
                  <span className="subject-card-pending">
                    {temasCount > 0 ? `${temasCount} tema${temasCount > 1 ? 's' : ''}` : 'Sin temas publicados'}
                  </span>
                )}
                <span className="subject-card-arrow">→</span>
              </div>
              <div className="subject-card-bar" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
