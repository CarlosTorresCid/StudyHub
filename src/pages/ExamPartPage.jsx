import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import QuestionPracticeCard from '../components/QuestionPracticeCard';
import './SubjectPage.css';
import './ExamPartPage.css';

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
    tipos: ['corta', 'desarrollo'],
    icono: '✍️',
    desc: 'Preguntas P1-P4 de respuesta abierta',
  },
  {
    id: 'parte-problemas',
    nombre: 'Problemas prácticos',
    tipos: ['practica'],
    icono: '🧪',
    desc: 'Problemas PROB1-PROB2 del examen',
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

function getExamParts(subject, questions) {
  const configuredParts = subject?.estructuraExamen || [];

  if (configuredParts.length > 0) {
    return configuredParts;
  }

  return DEFAULT_EXAM_PARTS.filter(part =>
    questions.some(q => part.tipos.includes(q.tipo))
  );
}

function extractTemaNumber(temaId) {
  return parseInt(temaId?.match(/\d+/)?.[0] ?? '999', 10);
}

function getQuestionGroup(q) {
  return q.grupoTematico || q.patronRelacionado || q.temaPrincipalId || '';
}

function getAppearancesCount(q) {
  return q.numeroApariciones || q.apariciones?.length || q.etiquetasModelo?.length || q.fuentes?.length || 0;
}

function getFirstAppearanceSortValue(q) {
  const etiquetas = q.etiquetasModelo || q.fuentes || [];
  const first = etiquetas[0] || '';

  const year = parseInt(first.match(/20\d{2}/)?.[0] ?? '9999', 10);

  let modelValue = 999;
  const modelMatch = first.match(/Modelo\s+([A-Z0-9]+)/i);

  if (modelMatch) {
    const raw = modelMatch[1];
    modelValue = /^[0-9]+$/.test(raw)
      ? parseInt(raw, 10)
      : raw.toUpperCase().charCodeAt(0);
  }

  const questionValue = first.includes('PROB')
    ? parseInt(first.match(/PROB\s?(\d+)/i)?.[1] ?? '99', 10) + 100
    : parseInt(first.match(/P\s?(\d+)/i)?.[1] ?? '99', 10);

  return year * 10000 + modelValue * 100 + questionValue;
}

function sortQuestionsForStudy(questions) {
  return [...questions].sort((a, b) => {
    const temaA = extractTemaNumber(a.temaPrincipalId);
    const temaB = extractTemaNumber(b.temaPrincipalId);

    if (temaA !== temaB) return temaA - temaB;

    const grupoA = getQuestionGroup(a);
    const grupoB = getQuestionGroup(b);

    if (grupoA !== grupoB) return grupoA.localeCompare(grupoB, 'es');

    const aparA = getAppearancesCount(a);
    const aparB = getAppearancesCount(b);

    if (aparA !== aparB) return aparB - aparA;

    const firstA = getFirstAppearanceSortValue(a);
    const firstB = getFirstAppearanceSortValue(b);

    if (firstA !== firstB) return firstA - firstB;

    return (a.enunciado || '').localeCompare(b.enunciado || '', 'es');
  });
}

export default function ExamPartPage() {
  const { asignaturaId, parteId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);
  const questions = publicLibrary.getQuestionBank(asignaturaId);

  const examParts = useMemo(
    () => getExamParts(subject, questions),
    [subject, questions]
  );

  const part = examParts.find(p => p.id === parteId);

  const [selectedTema, setSelectedTema] = useState('todos');
  const [selectedGroup, setSelectedGroup] = useState('todos');
  const [selectedOrigen, setSelectedOrigen] = useState('todos');
  const [selectedRevision, setSelectedRevision] = useState('todas');

  if (!subject) return <div className="page-error">Asignatura no encontrada</div>;
  if (!part) return <div className="page-error">Parte de examen no encontrada</div>;

  const baseQuestions = useMemo(
    () => questions.filter(q => part.tipos.includes(q.tipo)),
    [questions, part]
  );

  const temaMap = useMemo(
    () => Object.fromEntries((subject.temas || []).map(t => [t.id, t])),
    [subject.temas]
  );

  const temasDisponibles = useMemo(() => {
    const ids = [
      ...new Set(
        baseQuestions.flatMap(q =>
          q.temaIds?.length ? q.temaIds : q.temaPrincipalId ? [q.temaPrincipalId] : []
        )
      ),
    ];

    return ids.sort((a, b) => extractTemaNumber(a) - extractTemaNumber(b));
  }, [baseQuestions]);

  const gruposDisponibles = useMemo(() => {
    const grupos = [
      ...new Set(
        baseQuestions
          .map(q => getQuestionGroup(q))
          .filter(Boolean)
      ),
    ];

    return grupos.sort((a, b) => a.localeCompare(b, 'es'));
  }, [baseQuestions]);

  const origenesDisponibles = useMemo(
    () => [...new Set(baseQuestions.map(q => q.origen).filter(Boolean))].sort(),
    [baseQuestions]
  );

  const filteredQuestions = useMemo(
    () =>
      baseQuestions.filter(q => {
        if (selectedTema !== 'todos') {
          const temas = q.temaIds?.length ? q.temaIds : [q.temaPrincipalId];
          if (!temas?.includes(selectedTema)) return false;
        }

        if (selectedGroup !== 'todos') {
          const grupo = getQuestionGroup(q);
          if (grupo !== selectedGroup) return false;
        }

        if (selectedOrigen !== 'todos' && q.origen !== selectedOrigen) return false;
        if (selectedRevision === 'verificadas' && !q.verificada) return false;
        if (selectedRevision === 'pendientes' && q.verificada === true) return false;
        if (selectedRevision === 'revision' && !q.requiereRevision) return false;

        return true;
      }),
    [baseQuestions, selectedTema, selectedGroup, selectedOrigen, selectedRevision]
  );

  const sortedQuestions = useMemo(
    () => sortQuestionsForStudy(filteredQuestions),
    [filteredQuestions]
  );

  const hasFilters =
    selectedTema !== 'todos' ||
    selectedGroup !== 'todos' ||
    selectedOrigen !== 'todos' ||
    selectedRevision !== 'todas';

  const clearFilters = () => {
    setSelectedTema('todos');
    setSelectedGroup('todos');
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
          {part.desc && <p className="subject-hero-desc">{part.desc}</p>}
          <p className="subject-hero-desc">
            {baseQuestions.length} {baseQuestions.length === 1 ? 'pregunta' : 'preguntas'}
          </p>
        </div>
      </div>

      {baseQuestions.length === 0 ? (
        <div className="subject-empty">
          <p>Todavía no hay preguntas publicadas para esta parte.</p>
        </div>
      ) : (
        <>
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
                  <option key={id} value={id}>
                    {temaLabel(id)}
                  </option>
                ))}
              </select>

              <select
                className="exam-filter-select"
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                aria-label="Filtrar por temática"
              >
                <option value="todos">Todas las temáticas</option>
                {gruposDisponibles.map(grupo => (
                  <option key={grupo} value={grupo}>
                    {grupo}
                  </option>
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
                  <option key={o} value={o}>
                    {ORIGEN_LABELS[o] || o}
                  </option>
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
                ? `Mostrando ${sortedQuestions.length} de ${baseQuestions.length} preguntas`
                : `${baseQuestions.length} ${
                    baseQuestions.length === 1 ? 'pregunta disponible' : 'preguntas disponibles'
                  } · ordenadas por tema y patrón`}
            </p>

            {selectedGroup !== 'todos' && (
              <div className="exam-active-filter">
                <span>
                  Filtrando por temática: <strong>{selectedGroup}</strong>
                </span>
                <button className="btn btn-ghost" onClick={() => setSelectedGroup('todos')}>
                  Quitar filtro
                </button>
              </div>
            )}
          </div>

          {sortedQuestions.length === 0 ? (
            <div className="exam-filter-empty">
              <p>No hay preguntas que coincidan con los filtros seleccionados.</p>
              <button className="btn btn-ghost" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="exam-part-list">
              {sortedQuestions.map((q, i) => (
                <QuestionPracticeCard
                  key={q.id || i}
                  question={q}
                  onGroupClick={setSelectedGroup}
                />
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