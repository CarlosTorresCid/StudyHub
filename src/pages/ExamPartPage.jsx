import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { usePageTitle } from '../hooks/usePageTitle';
import QuestionPracticeCard from '../components/QuestionPracticeCard';
import ExamPartIntro from '../components/ExamPartIntro';
import DevelopmentTable from '../components/DevelopmentTable';
import ModelNotebookRunner from '../components/ModelNotebookRunner';
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

// Una pregunta pertenece a esta parte si su parteExamenId coincide,
// o si no tiene parteExamenId pero su tipo encaja con los tipos de la parte
// (fallback para bancos importados sin parteExamenId asignado).
function normalizeParteExamenId(value) {
  const v = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

  if (!v) return null;

  const aliases = {
    // Tipo test
    test: 'parte-test',
    tipo_test: 'parte-test',
    parte_test: 'parte-test',
    parte_test_tipo: 'parte-test',
    preguntas_test: 'parte-test',
    verdadero_falso: 'parte-test',
    vf: 'parte-test',

    // Preguntas cortas
    corta: 'parte-cortas',
    cortas: 'parte-cortas',
    pregunta_corta: 'parte-cortas',
    preguntas_cortas: 'parte-cortas',
    parte_cortas: 'parte-cortas',
    respuesta_corta: 'parte-cortas',

    // Desarrollo
    desarrollo: 'parte-desarrollo',
    desarrollos: 'parte-desarrollo',
    pregunta_desarrollo: 'parte-desarrollo',
    preguntas_desarrollo: 'parte-desarrollo',
    parte_desarrollo: 'parte-desarrollo',
    teoria_desarrollo: 'parte-desarrollo',

    // Problemas prácticos
    practica: 'parte-problemas',
    practicas: 'parte-problemas',
    práctico: 'parte-problemas',
    prácticos: 'parte-problemas',
    problema: 'parte-problemas',
    problemas: 'parte-problemas',
    problema_practico: 'parte-problemas',
    problemas_practicos: 'parte-problemas',
    parte_problemas: 'parte-problemas',
  };

  return aliases[v] || value;
}

// Una pregunta pertenece a esta parte si su parteExamenId coincide,
// si su parteExamenId usa un alias conocido,
// o si no tiene parteExamenId pero su tipo encaja con los tipos de la parte.
function questionMatchesPart(q, part) {
  if (!part) return false;

  const normalizedParteId = normalizeParteExamenId(q.parteExamenId);

  if (normalizedParteId === part.id) return true;

  const sinParte =
    q.parteExamenId === null ||
    q.parteExamenId === undefined ||
    q.parteExamenId === '';

  return sinParte && Boolean(part.tipos?.includes(q.tipo));
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

  const [selectedTema, setSelectedTema] = useState('todos');
  const [selectedGroup, setSelectedGroup] = useState('todos');
  const [selectedOrigen, setSelectedOrigen] = useState('todos');
  const [selectedRevision, setSelectedRevision] = useState('todos');
  const [searchText, setSearchText] = useState('');

  const temas = subject?.temas || [];

  const examParts = useMemo(
    () => getExamParts(subject, questions),
    [subject, questions]
  );

  const part = examParts.find(p => p.id === parteId);

  const hasConfiguredExamModels =
  subject?.modelosExamen &&
  Object.keys(subject.modelosExamen).length > 0;

const examModels = useMemo(() => {
  if (!part || !hasConfiguredExamModels) return [];
  return publicLibrary.getExamModels(asignaturaId, parteId);
}, [asignaturaId, parteId, part, hasConfiguredExamModels]);

const selectedModel = useMemo(() => {
  if (!modeloId || !hasConfiguredExamModels) return null;
  return publicLibrary.getExamModel(asignaturaId, parteId, modeloId);
}, [asignaturaId, parteId, modeloId, hasConfiguredExamModels]);

const modelDetails = useMemo(() => {
  if (!modeloId || !hasConfiguredExamModels) return null;
  return subject.modelosExamen[modeloId] || null;
}, [modeloId, subject?.modelosExamen, hasConfiguredExamModels]);

const hasModelSelector = hasConfiguredExamModels && examModels.length > 0;
  const shouldShowModelSelector = hasModelSelector && !modeloId;
  const shouldShowQuestions = !hasModelSelector || Boolean(modeloId);

  const baseQuestions = useMemo(() => {
    if (!part) return [];

    if (modeloId) {
      return publicLibrary.getQuestionsByParteAndModel(asignaturaId, parteId, modeloId);
    }

    return questions.filter(q => questionMatchesPart(q, part) && q.esPreguntaTipo !== true);
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

  usePageTitle(
    subject && part
      ? modeloId && selectedModel
        ? `${part.nombre} · ${selectedModel.nombre} · ${subject.abreviatura}`
        : `${part.nombre} · Examen · ${subject.abreviatura}`
      : 'Examen'
  );

  const clearFilters = () => {
  setSelectedTema('todos');
  setSelectedGroup('todos');
  setSelectedOrigen('todos');
  setSelectedRevision('todos');
  setSearchText('');
};

const handleGroupClick = (grupo) => {
  setSelectedGroup(grupo);

  // Limpieza opcional para que el clic siempre muestre resultados claros.
  setSelectedTema('todos');
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

  const isTest = parteId === 'parte-test';
  const isDesarrollo = parteId === 'parte-desarrollo';
  const desarrollo = modelDetails?.ejercicioDesarrollo;
  const hasEmbeddedTable = isDesarrollo && desarrollo?.tabla != null;
  const hasArchivoPredicciones = isDesarrollo && desarrollo?.archivoPredicciones != null;

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

        {modeloId ? (
          <>
            <Link to={`/asignatura/${asignaturaId}/examen/${parteId}`}>{part.nombre}</Link>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span aria-current="page">{selectedModel?.nombre || modeloId}</span>
          </>
        ) : (
          <span aria-current="page">{part.nombre}</span>
        )}
      </nav>

      <header className="exam-part-header">
        <div className="exam-part-header-top">
          <div className="exam-part-title">
            <span className="exam-part-title-icon">{part.icono || '📝'}</span>
            <div>
              <h1>
                {modeloId
                  ? `${part.nombre} · ${selectedModel?.nombre || modeloId}`
                  : part.nombre}
              </h1>
              <p className="exam-part-subtitle">
                {modeloId
                  ? `${selectedModel?.count ?? baseQuestions.length} pregunta${(selectedModel?.count ?? baseQuestions.length) !== 1 ? 's' : ''} · ${subject.abreviatura}`
                  : (part.desc || `Practica preguntas de ${subject.abreviatura}`)}
              </p>
            </div>
          </div>

          {modeloId ? (
            <Link
              to={`/asignatura/${asignaturaId}/examen/${parteId}`}
              className="btn btn-ghost"
            >
              ← Volver a {part.nombre}
            </Link>
          ) : (
            <Link
              to={`/asignatura/${asignaturaId}/examen`}
              className="btn btn-ghost"
            >
              ← Volver al examen de {subject.abreviatura}
            </Link>
          )}
        </div>
      </header>

      <ExamPartIntro explicacion={part.explicacion} />

      {shouldShowModelSelector && (
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

                {model.recursos?.length > 0 && (
                  <div className="exam-model-card-resources">
                    {model.recursos.length === 1
                      ? model.recursos[0].nombre
                      : `${model.recursos.length} CSV disponibles`}
                  </div>
                )}
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

      {shouldShowQuestions && (
        <>
          {hasModelSelector && (
            <div className="exam-model-grid">
              {examModels.map(model => (
                <Link
                  key={model.id}
                  to={`/asignatura/${asignaturaId}/examen/${parteId}/${model.id}`}
                  className={`exam-model-card${model.id === modeloId ? ' exam-model-card--active' : ''}`}
                  aria-current={model.id === modeloId ? 'page' : undefined}
                >
                  <div className="exam-model-card-title">{model.nombre}</div>
                  <div className="exam-model-card-meta">
                    {model.count} {model.count === 1 ? 'pregunta' : 'preguntas'}
                  </div>

                  {model.recursos?.length > 0 && (
                    <div className="exam-model-card-resources">
                      {model.recursos.length === 1
                        ? model.recursos[0].nombre
                        : `${model.recursos.length} CSV disponibles`}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {selectedModel?.recursos?.length > 0 && (
            <div className="exam-resource-downloads">
              <div className="exam-resource-title">CSV del modelo</div>
              <div className="exam-resource-actions">
                {selectedModel.recursos.map(resource => (
                  <a
                    key={resource.path}
                    href={resource.url}
                    download
                    className="btn btn-download"
                  >
                    ⬇ Descargar {resource.nombre}
                  </a>
                ))}
              </div>
            </div>
          )}

          {modelDetails && (
            <div className="exam-model-info-card">
              <div className="exam-model-info-grid">
                {modelDetails.csv && (
                  <div className="exam-model-info-row">
                    <span className="exam-model-info-label">Dataset</span>
                    <code className="exam-model-info-value">{modelDetails.csv}</code>
                  </div>
                )}

                {modelDetails.carpeta && (
                  <div className="exam-model-info-row">
                    <span className="exam-model-info-label">Carpeta</span>
                    <span className="exam-model-info-value">{modelDetails.carpeta}</span>
                  </div>
                )}

                {modelDetails.contrasena && (
                  <div className="exam-model-info-row">
                    <span className="exam-model-info-label">Contraseña</span>
                    <code className="exam-model-info-value">{modelDetails.contrasena}</code>
                  </div>
                )}

                {modelDetails.variableObjetivo && (
                  <div className="exam-model-info-row">
                    <span className="exam-model-info-label">Variable objetivo</span>
                    <code className="exam-model-info-value">{modelDetails.variableObjetivo}</code>
                  </div>
                )}
              </div>

              {modelDetails.descripcionCaso && (
                <p className="exam-model-info-desc">{modelDetails.descripcionCaso}</p>
              )}

              {isTest && modelDetails.ejercicioTest?.descripcion && (
                <p className="exam-model-info-context">{modelDetails.ejercicioTest.descripcion}</p>
              )}
            </div>
          )}

          {isDesarrollo && hasEmbeddedTable && (
            <div className="exam-development-section">
              <div className="exam-development-section-title">Tabla de predicciones</div>
              <DevelopmentTable
                tabla={desarrollo.tabla}
                clasesPositivas={desarrollo.clasesPositivasROC}
                claseNegativa={desarrollo.claseNegativaROC}
              />
            </div>
          )}

          {isDesarrollo && hasArchivoPredicciones && (
            <div className="exam-resource-downloads">
              <div className="exam-resource-title">Archivo de predicciones</div>
              <p className="exam-resource-desc">{desarrollo.descripcion}</p>
              <div className="exam-resource-actions">
                <a
                  href={publicLibrary.resolveResourceUrl(desarrollo.archivoPredicciones.path)}
                  download
                  className="btn btn-download"
                >
                  ⬇ Descargar {desarrollo.archivoPredicciones.nombre}
                </a>
              </div>

              {(desarrollo.clasesPositivasROC?.length > 0 || desarrollo.claseNegativaROC) && (
                <div className="exam-resource-roc-note">
                  ROC: Positiva = <strong>{desarrollo.clasesPositivasROC?.join(' + ')}</strong>
                  {desarrollo.claseNegativaROC && (
                    <> · Negativa = <strong>{desarrollo.claseNegativaROC}</strong></>
                  )}
                </div>
              )}
            </div>
          )}

          {isDesarrollo && part.explicacion?.apartadosComunes?.length > 0 && (
            <div className="exam-common-questions">
              <div className="exam-common-questions-title">Apartados a responder</div>
              <ol className="exam-common-questions-list">
                {part.explicacion.apartadosComunes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
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
                {baseQuestions.length === 0 ? (
                  <>
                    <p>No hay preguntas para esta parte del examen.</p>
                    <p>Puede que el banco de preguntas todavía no tenga preguntas de este tipo para {subject.abreviatura}.</p>
                  </>
                ) : (
                  <>
                    <p>No hay preguntas con estos filtros.</p>
                    <p>Prueba a limpiar los filtros o cambiar el tipo de búsqueda.</p>
                  </>
                )}

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
              filteredQuestions.map((q, index) => (
              <QuestionPracticeCard
                key={q.id}
                question={q}
                questionNumber={index + 1}
                totalQuestions={filteredQuestions.length}
                showCompactMeta
                onGroupClick={handleGroupClick}
              />
              ))
            )}
          </div>

          {isTest && modeloId && selectedModel?.recursos?.length > 0 && (
            <ModelNotebookRunner
              asignaturaId={asignaturaId}
              modeloId={modeloId}
              resources={selectedModel.recursos}
              target={selectedModel.target || modelDetails?.variableObjetivo || ''}
            />
          )}

          <div className="exam-part-footer">
            {modeloId ? (
              <Link
                to={`/asignatura/${asignaturaId}/examen/${parteId}`}
                className="btn btn-ghost"
              >
                ← Volver a {part.nombre}
              </Link>
            ) : (
              <Link
                to={`/asignatura/${asignaturaId}/examen`}
                className="btn btn-ghost"
              >
                ← Volver al examen
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}