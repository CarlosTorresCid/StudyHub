import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { usePageTitle } from '../hooks/usePageTitle';
import ProblemTrainingGuide from '../components/ProblemTrainingGuide';
import './SubjectPage.css';
import './IaicProblemTrainingPage.css';

export default function IaicProblemTrainingPage() {
  const { asignaturaId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);

  usePageTitle(subject ? `Entrenamiento · ${subject.abreviatura}` : null);

  if (!subject || subject.id !== 'iaic') {
    return <div className="page-error">Asignatura no encontrada</div>;
  }

  return (
    <div className="subject-page training-page">
      <nav className="breadcrumb" aria-label="Navegación">
        <Link to="/">Inicio</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to={`/asignatura/${asignaturaId}`} style={{ color: subject.color }}>
          {subject.abreviatura}
        </Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to={`/asignatura/${asignaturaId}/examen`}>Examen</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">Entrenamiento de problemas</span>
      </nav>

      <div className="subject-hero training-hero" style={{ '--subject-color': subject.color }}>
        <div className="subject-hero-icon">🧭</div>

        <div className="training-hero-main">
          <div className="subject-hero-abrev">{subject.abreviatura}</div>
          <h1 className="subject-hero-name">Entrenamiento de problemas IAIC</h1>
          <p className="subject-hero-desc">
            Manual práctico para aprender a resolver los ejercicios que más se repiten en el examen.
          </p>

          <Link
            to={`/asignatura/${asignaturaId}/examen`}
            className="btn btn-ghost"
            style={{ marginTop: 12 }}
          >
            ← Volver al examen
          </Link>
        </div>
      </div>

      <ProblemTrainingGuide />

      <div style={{ marginTop: 32 }}>
        <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-ghost">
          ← Volver al examen
        </Link>
      </div>
    </div>
  );
}
