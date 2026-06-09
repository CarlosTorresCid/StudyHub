import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { usePageTitle } from '../hooks/usePageTitle';
import QuestionPracticeCard from '../components/QuestionPracticeCard';
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

function getOptionText(opcion) {
  if (typeof opcion === 'string') return opcion;
  if (opcion?.texto) return opcion.texto;
  if (opcion?.label) return opcion.label;

  try {
    return JSON.stringify(opcion);
  } catch {
    return '';
  }
}

export default function ExamPartPage() {
  const { asignaturaId, parteId, modeloId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);
  const questions = publicLibrary.getQuestionBank(asignaturaId);

  const examParts = useMemo(
    () => getExamParts(subject, questions),
    [subject, questions]
  );

  const part = examParts.find(p => p.id === parteId);

  usePageTitle(
    subject && part
      ? `${part.nombre} · Examen · ${subject.abreviatura}`
      : 'Examen'
  );

  const [selectedTema, setSelectedTema] = useState('todos');
  const [selectedGroup, setSelectedGroup] = useState('todos');
  const [selectedOrigen, setSelectedOrigen] = useState('todos');
  const [selectedRevision, setSelectedRevision] = useState('todos');
  const [searchText, setSearchText] = useState('');

  const temas = subject?.temas || [];
 
  const examModels = useMemo(() => {
    if (!part) return [];
    return publicLibrary.getExamModels(asignaturaId, parteId);
  }, [asignaturaId, parteId, part]);
 
const baseQuestions = useMemo(() => {
  if (!part) return [];

  if (modeloId) {
    return publicLibrary.getQuestionsByParteAndModel(asignaturaId, parteId, modeloId);
  }

  return questions.filter(q => q.parteExamenId === parteId && q.esPreguntaTipo !== true);
}, [questions, part, asignaturaId, parteId, modeloId]);

  const grupos = useMemo(() => {
  const values = baseQuestions
      .map(q => q.grupoTematico || q.patronRelacionado)
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [baseQuestions]);

  const filteredQuestions = useMemo(() => {
    return baseQuestions.filter(q => {
      if (selectedTema !== 'todos') {
        const temasPregunta = q.temaIds?.length ? q.temaIds : [q.temaPrincipalId];
        if (!temasPregunta?.includes(selectedTema)) return false;
      }

      if (selectedGroup !== 'todos') {
        const grupo = q.grupoTematico || q.patronRelacionado || null;
        if (grupo !== selectedGroup) return false;
      }

      if (selectedOrigen !== 'todos' && q.origen !== selectedOrigen) {
        return false;
      }

      if (selectedRevision === 'verificadas' && !q.verificada) {
        return false;
      }

      if (selectedRevision === 'pendientes' && q.verificada === true) {
        return false;
      }

      if (selectedRevision === 'revision' && !q.requiereRevision) {
        return false;
      }

      if (searchText?.trim()) {
        const search = searchText.toLowerCase().trim();

        const opcionesText = Array.isArray(q.opciones)
          ? q.opciones.map(getOptionText).join(' ')
          : '';

        const searchableText = [
          q.enunciado,
          q.respuesta,
          q.respuestaModelo,
          q.solucionOrientativa,
          q.explicacion,
          opcionesText,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(search)) return false;
      }

      return true;
    });
  }, [
    baseQuestions,
    selectedTema,
    selectedGroup,
    selectedOrigen,
    selectedRevision,
    searchText,
  ]);

  const clearFilters = () => {
    setSelectedTema('todos');
    setSelectedGroup('todos');
    setSelectedOrigen('todos');
    setSelectedRevision('todos');
    setSearchText('');
  };

  const hasActiveFilters =
    selectedTema !== 'todos' ||
    selectedGroup !== 'todos' ||
    selectedOrigen !== 'todos' ||
    selectedRevision !== 'todos' ||
    searchText.trim();

  if (!subject) {
    return <div className="page-error">Asignatura no encontrada</div>;
  }

  if (!part) {
    return (
      <div className="exam-part-page">
        <nav className="breadcrumb" aria-label="Navegación">
          <Link to="/">Inicio</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <Link to={`/asignatura/${asignaturaId}`} style={{ color: subject.color }}>
            {subject.abreviatura}
          </Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <Link to={`/asignatura/${asignaturaId}/examen`}>Examen</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <span aria-current="page">Parte no encontrada</span>
        </nav>

        <div className="page-error">
          <p>No se ha encontrado esta parte del examen.</p>
          <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-ghost">
            ← Volver al examen de {subject.abreviatura}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-part-page">
      <nav className="breadcrumb" aria-label="Navegación">
        <Link to="/">Inicio</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to={`/asignatura/${asignaturaId}`} style={{ color: subject.color }}>
          {subject.abreviatura}
        </Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to={`/asignatura/${asignaturaId}/examen`}>Examen</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">{part.nombre}</span>
      </nav>

      <header className="exam-part-header">
        <div className="exam-part-header-top">
          <div className="exam-part-title">
            <span className="exam-part-title-icon">{part.icono || '📝'}</span>
            <div>
              <h1>{part.nombre}</h1>
              <p className="exam-part-subtitle">
                {part.desc || `Practica preguntas de ${subject.abreviatura}`}
              </p>
            </div>
          </div>

          <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-ghost">
            ← Volver al examen de {subject.abreviatura}
          </Link>
        </div>
      </header>

      {!modeloId && (
  <>
    <div className="exam-model-grid">
      {examModels.map(model => (
        <Link
          key={model.id}
          to={`/asignatura/${asignaturaId}/examen/${parteId}/${model.id}`}
          className="exam-model-card"
        >
          <div className="exam-model-card-title">{model.nombre}</div>
          <div className="exam-model-card-meta">
            {model.count} {model.count === 1 ? 'pregunta' : 'preguntas'}
          </div>
        </Link>
      ))}
    </div>

    <div className="exam-part-footer">
      <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-ghost">
        ← Volver al examen
      </Link>
    </div>
  </>
)}

{modeloId && (
  <>
    {/* filtros */}
    {/* contador */}
    {/* lista de preguntas */}
  </>
)}

      <div className="exam-filters">
        <div className="exam-filters-row">
          <input
            type="text"
            className="exam-filter-search"
            placeholder="Buscar palabra clave..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />

          <select
            className="exam-filter-select"
            value={selectedTema}
            onChange={e => setSelectedTema(e.target.value)}
          >
            <option value="todos">Todos los temas</option>
            {temas.map(t => (
              <option key={t.id} value={t.id}>
                Tema {t.numero}. {t.titulo}
              </option>
            ))}
          </select>

          {grupos.length > 0 && (
            <select
              className="exam-filter-select"
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
            >
              <option value="todos">Todos los grupos</option>
              {grupos.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}

          <select
            className="exam-filter-select"
            value={selectedOrigen}
            onChange={e => setSelectedOrigen(e.target.value)}
          >
            <option value="todos">Todos los orígenes</option>
            <option value="examen_real">📝 Examen real</option>
            <option value="modelo_examen">📄 Modelo de examen</option>
            <option value="autoevaluacion">✅ Autoevaluación</option>
            <option value="indicada_clase">🎓 Indicada en clase</option>
            <option value="recopilada">📚 Recopilada</option>
            <option value="generada_ia">🤖 Generada IA</option>
          </select>

          <select
            className="exam-filter-select"
            value={selectedRevision}
            onChange={e => setSelectedRevision(e.target.value)}
          >
            <option value="todos">Todas</option>
            <option value="verificadas">Verificadas</option>
            <option value="pendientes">Pendientes</option>
            <option value="revision">Requiere revisión</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-ghost exam-filter-clear"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="exam-part-count-bar">
        <span>
          Mostrando{' '}
          <span className="exam-part-count-num">{filteredQuestions.length}</span>
          {' '}de{' '}
          <span className="exam-part-count-num">{baseQuestions.length}</span>
          {' '}pregunta{baseQuestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="exam-part-list">
        {filteredQuestions.length === 0 ? (
          <div className="exam-filter-empty">
            <p>No hay preguntas con estos filtros.</p>
            <p>Prueba a limpiar los filtros o cambiar el tipo de búsqueda.</p>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          filteredQuestions.map(q => (
            <QuestionPracticeCard key={q.id} question={q} />
          ))
        )}
      </div>

      <div className="exam-part-footer">
        <Link to={`/asignatura/${asignaturaId}/examen`} className="btn btn-ghost">
          ← Volver al examen
        </Link>
      </div>
    </div>
  );
}