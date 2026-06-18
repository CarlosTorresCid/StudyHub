import { Link } from 'react-router-dom';

const CONFIG = {
  isa: {
    icon: '📋',
    title: 'Preparación examen',
    text: 'Estrategia completa para los 4 apartados del ejercicio de desarrollo · 7 puntos en total.',
    cta: 'Abrir guía ISA',
  },
  te: {
    icon: '🚀',
    title: 'Preparación examen',
    text: 'Guía organizada por los 5 tipos reales de preguntas · Parte práctica (6 puntos).',
    cta: 'Abrir guía TE',
  },
  casi: {
    icon: '📋',
    title: 'Preparación examen',
    text: 'Guía de estudio orientada al examen final.',
    cta: 'Estudiar',
  },
  smpc: {
    icon: '🤖',
    title: 'Preparación examen',
    text: 'Guía de estudio orientada al examen final.',
    cta: 'Estudiar',
  },
};

export default function ExamPrepCard({ subjectId, asignaturaId }) {
  const cfg = CONFIG[subjectId];
  if (!cfg) return null;

  return (
    <section className="ptg-card">
      <div className="ptg-card-icon" aria-hidden="true">{cfg.icon}</div>
      <div className="ptg-card-body">
        <div className="ptg-card-title">{cfg.title}</div>
        <p className="ptg-card-text">{cfg.text}</p>
      </div>
      <Link
        to={`/asignatura/${asignaturaId}/examen/preparacion`}
        className="btn btn-primary ptg-card-cta"
      >
        {cfg.cta}
      </Link>
    </section>
  );
}
