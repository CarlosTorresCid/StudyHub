import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { usePageTitle } from '../hooks/usePageTitle';
import IsaExamPrep from '../components/IsaExamPrep';
import TeExamPrep from '../components/TeExamPrep';
import CasiExamPrep from '../components/CasiExamPrep';
import SmpcExamPrep from '../components/SmpcExamPrep';
import './SubjectPage.css';
import './IaicProblemTrainingPage.css';

const SUPPORTED = ['isa', 'te', 'casi', 'smpc'];

const CONFIG = {
  isa: {
    icon: '📋',
    heading: 'Preparación examen ISA',
    desc: 'Estrategia completa para los 4 apartados del ejercicio de desarrollo.',
  },
  te: {
    icon: '🚀',
    heading: 'Preparación examen TE',
    desc: 'Guía organizada por los 5 tipos reales de preguntas de la parte práctica.',
  },
  casi: {
    icon: '✅',
    heading: 'Preparación examen CASI',
    desc: 'Guía de estudio orientada al examen final: 12 temas, test + desarrollo.',
  },
  smpc: {
    icon: '🤖',
    heading: 'Preparación examen SMPC',
    desc: '7 patrones de desarrollo · 15 preguntas analizadas · Respuestas modelo incluidas.',
  },
};

export default function ExamPrepPage() {
  const { asignaturaId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);

  usePageTitle(subject ? `Preparación examen · ${subject.abreviatura}` : null);

  if (!subject || !SUPPORTED.includes(subject.id)) {
    return <div className="page-error">No disponible para esta asignatura</div>;
  }

  const cfg = CONFIG[subject.id];

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
        <span aria-current="page">Preparación examen</span>
      </nav>

      <div className="subject-hero training-hero" style={{ '--subject-color': subject.color }}>
        <div className="subject-hero-icon">{cfg.icon}</div>
        <div className="training-hero-main">
          <div className="subject-hero-abrev">{subject.abreviatura}</div>
          <h1 className="subject-hero-name">{cfg.heading}</h1>
          <p className="subject-hero-desc">{cfg.desc}</p>
          <Link
            to={`/asignatura/${asignaturaId}/examen`}
            className="btn btn-ghost"
            style={{ marginTop: 12 }}
          >
            ← Volver al examen
          </Link>
        </div>
      </div>

      {subject.id === 'isa' && <IsaExamPrep />}
      {subject.id === 'te' && <TeExamPrep />}
      {subject.id === 'casi' && <CasiExamPrep />}
      {subject.id === 'smpc' && <SmpcExamPrep />}

      <div style={{ marginTop: 32 }}>
        <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-ghost">
          ← Volver al examen
        </Link>
      </div>
    </div>
  );
}
