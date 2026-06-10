import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { exportQuestionsByBlocksToWord } from '../utils/exportToWord';
import { usePageTitle } from '../hooks/usePageTitle';
import ExamInfoCard from '../components/ExamInfoCard';
import './SubjectPage.css';

const DEFAULT_EXAM_PARTS = [
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
    tipos: ['corta'],
    icono: '✍️',
    desc: 'Preguntas de respuesta breve',
  },
  {
    id: 'parte-desarrollo',
    nombre: 'Preguntas de desarrollo',
    tipos: ['desarrollo'],
    icono: '🧠',
    desc: 'Preguntas teóricas de desarrollo',
  },
  {
    id: 'parte-problemas',
    nombre: 'Problemas prácticos',
    tipos: ['practica', 'problema'],
    icono: '🧪',
    desc: 'Problemas y ejercicios prácticos',
  },
];

function getExamParts(subject, questions) {
  const configuredParts = subject?.estructuraExamen || [];

  if (configuredParts.length > 0) {
    return configuredParts;
  }

  return DEFAULT_EXAM_PARTS.filter(part =>
    questions.some(q => part.tipos.includes(q.tipo))
  );
}

export default function ExamPage() {
  const { asignaturaId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);
  const questions = publicLibrary.getQuestionBank(asignaturaId);

  usePageTitle(subject ? `Examen · ${subject.abreviatura}` : null);

  if (!subject) return <div className="page-error">Asignatura no encontrada</div>;

  const totalQuestions = questions.length;
  const examParts = getExamParts(subject, questions);

  return (
    <div className="subject-page">
      <nav className="breadcrumb" aria-label="Navegación">
        <Link to="/">Inicio</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to={`/asignatura/${asignaturaId}`} style={{ color: subject.color }}>
          {subject.abreviatura}
        </Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">Examen</span>
      </nav>

      <div className="subject-hero" style={{ '--subject-color': subject.color }}>
        <div className="subject-hero-icon">{subject.icono}</div>

        <div>
          <div className="subject-hero-abrev">{subject.abreviatura}</div>
          <h1 className="subject-hero-name">Examen</h1>

          {subject.nombre && (
            <p className="subject-hero-desc">{subject.nombre}</p>
          )}

          {totalQuestions > 0 && (
            <button
              type="button"
              className="btn btn-download"
              style={{ marginTop: 12 }}
              onClick={() =>
                exportQuestionsByBlocksToWord({
                  subject,
                  questions,
                  examParts,
                  title: 'Todas las preguntas de examen',
                  fileSuffix: 'todas-las-preguntas-examen',
                })
              }
            >
              ⬇ Descargar todas las preguntas
            </button>
          )}
        </div>
      </div>

      <ExamInfoCard info={subject.infoExamen} />

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
      ) : examParts.length === 0 ? (
        <div className="subject-empty">
          <p>Hay preguntas publicadas, pero no hay estructura de examen configurada.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            Revisa el archivo <code>configuracion.json</code> de esta asignatura.
          </p>
        </div>
      ) : (
        <div className="topics-list" style={{ gap: 16 }}>
          {examParts.map(part => {
            const count = questions.filter(q => part.tipos.includes(q.tipo)).length;

            return (
              <div key={part.id} className="topic-row exam-part-row">
                <div className="exam-part-row-inner">
                  <span className="exam-part-icon">{part.icono || '📝'}</span>

                  <div className="exam-part-info">
                    <div className="topic-row-title">{part.nombre}</div>

                    {part.desc && (
                      <div className="topic-row-meta">
                        <span>{part.desc}</span>
                      </div>
                    )}

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

      <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to={`/asignatura/${asignaturaId}`} className="btn btn-ghost">
          ← Volver
        </Link>
      </div>
    </div>
  );
}