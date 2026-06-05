import { useState, useMemo } from 'react';
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

const ORIGEN_LABELS = {
  examen_real: 'Examen real',
  modelo_examen: 'Modelo de examen',
  autoevaluacion: 'Autoevaluación',
  indicada_clase: 'Indicada en clase',
  recopilada: 'Recopilada',
  generada_ia: 'Generada por IA',
};

export default function ExamPartPage() {
  const { asignaturaId, parteId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);
  const questions = publicLibrary.getQuestionBank(asignaturaId);
  const part = EXAM_PARTS.find(p => p.id === parteId);

  const [selectedTema, setSelectedTema] = useState('todos');
  const [selectedOrigen, setSelectedOrigen] = useState('todos');
  const [selectedRevision, setSelectedRevision] = useState('todas');

  if (!subject) return <div className="page-error">Asignatura no encontrada</div>;
  if (!part) return <div className="page-error">Parte de examen no encontrada</div>;

  // Preguntas base de la parte (filtradas solo por tipo)
  const baseQuestions = useMemo(
    () => questions.filter(q => part.tipos.includes(q.tipo)),
    [questions, part]
  );

  // Mapa id→tema para obtener títulos
  const temaMap = useMemo(
    () => Object.fromEntries(subject.temas.map(t => [t.id, t])),
    [subject.temas]
  );

  // Temas presentes en la parte, ordenados numéricamente
  const temasDisponibles = useMemo(() => {
    const ids = [...new Set(
      baseQuestions.flatMap(q =>
        q.temaIds?.length ? q.temaIds : (q.temaPrincipalId ? [q.temaPrincipalId] : [])
      )
    )];
    return ids.sort((a, b) => {
      const na = parseInt(a.match(/\d+/)?.[0] ?? '999', 10);
      const nb = parseInt(b.match(/\d+/)?.[0] ?? '999', 10);
      return na - nb;
    });
  }, [baseQuestions]);

  // Orígenes presentes en la parte
  const origenesDisponibles = useMemo(
    () => [...new Set(baseQuestions.map(q => q.origen).filter(Boolean))].sort(),
    [baseQuestions]
  );

  // Preguntas tras aplicar los tres filtros
  const filteredQuestions = useMemo(() => baseQuestions.filter(q => {
    if (selectedTema !== 'todos') {
      const temas = q.temaIds?.length ? q.temaIds : [q.temaPrincipalId];
      if (!temas?.includes(selectedTema)) return false;
    }
    if (selectedOrigen !== 'todos' && q.origen !== selectedOrigen) return false;
    if (selectedRevision === 'verificadas' && !q.verificada) return false;
    if (selectedRevision === 'pendientes' && q.verificada === true) return false;
    if (selectedRevision === 'revision' && !q.requiereRevision) return false;
    return true;
  }), [baseQuestions, selectedTema, selectedOrigen, selectedRevision]);

  const hasFilters =
    selectedTema !== 'todos' ||
    selectedOrigen !== 'todos' ||
    selectedRevision !== 'todas';

  const clearFilters = () => {
    setSelectedTema('todos');
    setSelectedOrigen('todos');
    setSelectedRevision('todas');
  };

  function temaLabel(id) {
    const t = temaMap[id];
    if (!t) return id;
    return t.titulo || id;
  }

  return (
    <div className="subject-page">
      <div className="subject-hero" style={{ '--subject-color': subject.color }}>
        <div className="subject-hero-icon">{subject.icono}</div>
        <div>
          <div className="subject-hero-abrev">{subject.abreviatura} · Examen</div>
          <h1 className="subject-hero-name">{part.nombre}</h1>
          <p className="subject-hero-desc">
            {baseQuestions.length} {baseQuestions.length === 1 ? 'pregunta' : 'preguntas'}
          </p>
        </div>
      </div>

      {/* Caso A: sin preguntas en la parte */}
      {baseQuestions.length === 0 ? (
        <div className="subject-empty">
          <p>Todavía no hay preguntas publicadas para esta parte.</p>
        </div>
      ) : (
        <>
          {/* ── Zona de filtros ──────────────────────────────── */}
          <div className="exam-filters">
            <div className="exam-filters-row">
              <select
                className="exam-filter-select"
                value={selectedTema}
                onChange={e => setSelectedTema(e.target.value)}
                aria-label="Filtrar por tema"
              >
                <option value="todos">Todos los temas</option>
                {temasDisponibles.map(id => (
                  <option key={id} value={id}>{temaLabel(id)}</option>
                ))}
              </select>

              <select
                className="exam-filter-select"
                value={selectedOrigen}
                onChange={e => setSelectedOrigen(e.target.value)}
                aria-label="Filtrar por origen"
              >
                <option value="todos">Todos los orígenes</option>
                {origenesDisponibles.map(o => (
                  <option key={o} value={o}>{ORIGEN_LABELS[o] || o}</option>
                ))}
              </select>

              <select
                className="exam-filter-select"
                value={selectedRevision}
                onChange={e => setSelectedRevision(e.target.value)}
                aria-label="Filtrar por estado de revisión"
              >
                <option value="todas">Todas</option>
                <option value="verificadas">Verificadas</option>
                <option value="pendientes">Pendientes de revisión</option>
                <option value="revision">Requieren revisión</option>
              </select>

              {hasFilters && (
                <button className="btn btn-ghost exam-filter-clear" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>

            <p className="exam-filter-count">
              {hasFilters
                ? `Mostrando ${filteredQuestions.length} de ${baseQuestions.length} preguntas`
                : `${baseQuestions.length} ${baseQuestions.length === 1 ? 'pregunta disponible' : 'preguntas disponibles'}`
              }
            </p>
          </div>

          {/* Caso B: filtros sin resultados */}
          {filteredQuestions.length === 0 ? (
            <div className="exam-filter-empty">
              <p>No hay preguntas que coincidan con los filtros seleccionados.</p>
              <button className="btn btn-ghost" onClick={clearFilters}>Limpiar filtros</button>
            </div>
          ) : (
            <div className="exam-part-list">
              {filteredQuestions.map((q, i) => (
                <QuestionPracticeCard key={q.id || i} question={q} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="exam-part-footer">
        <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-ghost">
          ← Volver al examen
        </Link>
      </div>
    </div>
  );
}
