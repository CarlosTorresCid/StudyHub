import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { contentService } from '../services/contentService';
import { questionService } from '../services/questionService';
import { progressService } from '../services/progressService';
import './SubjectPage.css';

// Todo el contenido procede del repositorio (publicLibrary).
// El progreso (visto, última puntuación) viene del localStorage del visitante.
export default function SubjectPage() {
  const { asignaturaId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);

  if (!subject) return <div className="page-error">Asignatura no encontrada</div>;

  const temas = subject.temas || [];
  const preguntas = publicLibrary.getQuestionBank(asignaturaId);
  const tienePreguntas = preguntas.length > 0;

  return (
    <div className="subject-page">
      <div className="subject-hero" style={{ '--subject-color': subject.color }}>
        <div className="subject-hero-icon">{subject.icono}</div>
        <div>
          <div className="subject-hero-abrev">{subject.abreviatura}</div>
          <h1 className="subject-hero-name">{subject.nombre}</h1>
          {subject.descripcion && <p className="subject-hero-desc">{subject.descripcion}</p>}
        </div>
      </div>

      <div className="subject-actions">
        <div className="subject-actions-info">
          <span>
            {temas.length} tema{temas.length !== 1 ? 's' : ''} publicado
            {temas.length !== 1 ? 's' : ''}
          </span>

          {tienePreguntas && (
            <span>
              {preguntas.length} pregunta{preguntas.length !== 1 ? 's' : ''} de examen
            </span>
          )}
        </div>

        {tienePreguntas && (
          <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-primary">
            📝 Examen
          </Link>
        )}
      </div>

      {temas.length === 0 ? (
        <div className="subject-empty">
          <p>📭 Todavía no hay temas publicados para esta asignatura.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            El contenido se irá publicando a medida que se añada al repositorio.
          </p>

          {tienePreguntas && (
            <p className="subject-empty-extra">
              Ya hay preguntas de examen disponibles. Puedes acceder desde el botón superior.
            </p>
          )}
        </div>
      ) : (
        <div className="topics-list">
          {temas.map(tema => {
            const content = contentService.getTemaContent(asignaturaId, tema.id);
            const stats = progressService.getEstadisticasTema(asignaturaId, tema.id);
            const visto = progressService.getTemaVisto(asignaturaId, tema.id);
            const totalPreguntas = questionService.getByTema(asignaturaId, tema.id).length;
            const flashcardCount = content?.flashcards?.length || 0;

            return (
              <Link
                key={tema.id}
                to={`/asignatura/${asignaturaId}/tema/${tema.id}`}
                className="topic-row"
                style={{ '--subject-color': subject.color }}
              >
                <div className="topic-row-num">{tema.numero}</div>

                <div className="topic-row-info">
                  <div className="topic-row-title">
                    {tema.titulo}
                    {!content && <span className="topic-no-content">Sin contenido</span>}
                    {visto && <span className="topic-seen">✓ Repasado</span>}
                  </div>

                  <div className="topic-row-meta">
                    {flashcardCount > 0 && <span>🃏 {flashcardCount} flashcards</span>}
                    {totalPreguntas > 0 && <span>❓ {totalPreguntas} preguntas</span>}
                    {tema.importanciaExamen && (
                      <span className={`badge badge-${tema.importanciaExamen}`}>
                        {tema.importanciaExamen}
                      </span>
                    )}
                  </div>
                </div>

                {stats && (
                  <div
                    className="topic-row-score"
                    style={{
                      color:
                        stats.ultimo.aciertos / stats.ultimo.total >= 0.7
                          ? 'var(--success)'
                          : 'var(--warning)',
                    }}
                  >
                    {Math.round((stats.ultimo.aciertos / stats.ultimo.total) * 100)}%
                  </div>
                )}

                <div className="topic-row-arrow">→</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}