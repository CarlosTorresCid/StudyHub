import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { simulationService } from '../services/simulationService';
import ExamSimulation from '../components/ExamSimulation';
import './ExamSimulationPage.css';

export default function ExamResolvePage() {
  const { asignaturaId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sid = searchParams.get('sid');
  const [simulacro, setSimulacro] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sid) { setError('ID de simulacro no encontrado'); return; }
    const s = simulationService.getById(sid);
    if (!s) { setError('Simulacro no encontrado'); return; }
    setSimulacro(s);
  }, [sid]);

  if (error) {
    return (
      <div className="sim-setup-page">
        <div className="page-error">{error}</div>
        <Link to={`/simulacro/${asignaturaId}`} className="btn btn-ghost" style={{ marginTop: 16 }}>
          ← Volver
        </Link>
      </div>
    );
  }

  if (!simulacro) return <div className="page-error">Cargando simulacro…</div>;

  return (
    <div className="sim-setup-page">
      <ExamSimulation
        simulacro={simulacro}
        onComplete={() => {}}
      />
      <div style={{ marginTop: 24 }}>
        <Link to={`/simulacro/${asignaturaId}`} className="btn btn-ghost">
          ← Volver al simulacro
        </Link>
      </div>
    </div>
  );
}
