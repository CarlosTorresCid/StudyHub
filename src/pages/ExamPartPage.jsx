import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import QuestionPracticeCard from '../components/QuestionPracticeCard';
import './SubjectPage.css';
import './ExamPartPage.css';

const EXAM_PARTS = [
  {
    id: 'parte-test',
    nombre: 'Tipo test',
    tipos: ['test', 'verdadero_falso'],
  },
  {
    id: 'parte-cortas',
    nombre: 'Preguntas cortas',
    tipos: ['corta', 'desarrollo'],
  },
];

export default function ExamPartPage() {
  const { asignaturaId, parteId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);
  const questions = publicLibrary.getQuestionBank(asignaturaId);
  const part = EXAM_PARTS.find(p => p.id === parteId);

  if (!subject) return <div className="page-error">Asignatura no encontrada</div>;
  if (!part) return <div className="page-error">Parte de examen no encontrada</div>;

  const filtered = questions.filter(q => part.tipos.includes(q.tipo));

  return (
    <div className="subject-page">
      <div className="subject-hero" style={{ '--subject-color': subject.color }}>
        <div className="subject-hero-icon">{subject.icono}</div>
        <div>
          <div className="subject-hero-abrev">{subject.abreviatura} · Examen</div>
          <h1 className="subject-hero-name">{part.nombre}</h1>
          <p className="subject-hero-desc">
            {filtered.length} {filtered.length === 1 ? 'pregunta' : 'preguntas'}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="subject-empty">
          <p>No hay preguntas de este tipo publicadas todavía.</p>
        </div>
      ) : (
        <div className="exam-part-list">
          {filtered.map((q, i) => (
            <QuestionPracticeCard key={q.id || i} question={q} />
          ))}
        </div>
      )}

      <div className="exam-part-footer">
        <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-ghost">
          ← Volver al examen
        </Link>
      </div>
    </div>
  );
}
