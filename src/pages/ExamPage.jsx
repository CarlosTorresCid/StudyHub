import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import './SubjectPage.css';

const EXAM_PARTS = [
  {
    id: 'parte-test',
    nombre: 'Tipo test',
    tipos: ['test', 'verdadero_falso'],
    icono: '🔤',
    desc: 'Preguntas de opción múltiple y verdadero/falso',
  },
  {
    id: 'parte-cortas',
    nombre: 'Preguntas cortas',
    tipos: ['corta', 'desarrollo'],
    icono: '✍️',
    desc: 'Respuestas cortas y preguntas de desarrollo',
  },
];

export default function ExamPage() {
  const { asignaturaId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);
  const questions = publicLibrary.getQuestionBank(asignaturaId);

  if (!subject) return <div className="page-error">Asignatura no encontrada</div>;

  const totalQuestions = questions.length;

  return (
    <div className="subject-page">
      <div className="subject-hero" style={{ '--subject-color': subject.color }}>
        <div className="subject-hero-icon">{subject.icono}</div>
        <div>
          <div className="subject-hero-abrev">{subject.abreviatura}</div>
          <h1 className="subject-hero-name">Examen</h1>
          {subject.nombre && <p className="subject-hero-desc">{subject.nombre}</p>}
        </div>
      </div>

      {totalQuestions === 0 ? (
        <div className="subject-empty">
          <p>No hay preguntas publicadas para esta asignatura todavía.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            Importa un banco de preguntas desde{' '}
            <Link to="/gestion/importar/preguntas" style={{ color: 'var(--accent)' }}>
              Administración → Publicar banco de preguntas
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="topics-list" style={{ gap: 16 }}>
          {EXAM_PARTS.map(part => {
            const count = questions.filter(q => part.tipos.includes(q.tipo)).length;
            return (
              <div
                key={part.id}
                className="topic-row"
                style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                  <span style={{ fontSize: 32 }}>{part.icono}</span>
                  <div style={{ flex: 1 }}>
                    <div className="topic-row-title">{part.nombre}</div>
                    <div className="topic-row-meta">
                      <span>{part.desc}</span>
                    </div>
                    <div className="topic-row-meta" style={{ marginTop: 6 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {count} {count === 1 ? 'pregunta' : 'preguntas'}
                      </span>
                      <span>({part.tipos.join(', ')})</span>
                    </div>
                  </div>
                  {count > 0 ? (
                    <Link
                      to={`/asignatura/${asignaturaId}/examen/${part.id}`}
                      className="btn btn-primary"
                      style={{ flexShrink: 0 }}
                    >
                      Practicar
                    </Link>
                  ) : (
                    <span
                      className="btn btn-ghost"
                      style={{ flexShrink: 0, opacity: 0.5, cursor: 'default' }}
                    >
                      Sin preguntas
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <Link to={`/asignatura/${asignaturaId}`} className="btn btn-ghost">← Volver</Link>
      </div>
    </div>
  );
}
