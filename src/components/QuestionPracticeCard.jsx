import { useState } from 'react';
import './QuestionPracticeCard.css';

const TIPO_LABELS = {
  test: 'Test',
  verdadero_falso: 'Verdadero / Falso',
  corta: 'Respuesta corta',
  desarrollo: 'Desarrollo',
  practica: 'Práctica',
};

const OPCION_LETRAS = ['A', 'B', 'C', 'D'];

function letraOpcion(indice) {
  return OPCION_LETRAS[indice] ?? '?';
}

function getModelLabels(q) {
  if (Array.isArray(q.etiquetasModelo) && q.etiquetasModelo.length > 0) {
    return q.etiquetasModelo;
  }

  if (Array.isArray(q.fuentes) && q.fuentes.length > 0) {
    return q.fuentes;
  }

  if (Array.isArray(q.modelos) && q.modelos.length > 0) {
    return q.modelos;
  }

  return [];
}

function StatusBadges({ q }) {
  if (!q.requiereRevision && !q.verificada) return null;

  return (
    <div className="qpc-badges">
      {q.requiereRevision && <span className="qpc-badge qpc-badge-revision">Revisar</span>}
      {q.verificada && <span className="qpc-badge qpc-badge-verified">Verificada</span>}
    </div>
  );
}

// Botón "Editar" — solo visible en desarrollo local (no aparece en producción/GitHub Pages).
function EditButton({ q, onEditQuestion }) {
  if (!import.meta.env.DEV || !onEditQuestion) return null;

  return (
    <button
      type="button"
      className="qpc-edit-btn"
      onClick={() => onEditQuestion(q)}
      title="Editar pregunta (solo en local)"
    >
      ✏️ Editar
    </button>
  );
}

function QuestionModelTags({ q, onGroupClick }) {
  const etiquetas = getModelLabels(q);
  const numeroApariciones = q.numeroApariciones || q.apariciones?.length || etiquetas.length;
  const grupo = q.grupoTematico || q.patronRelacionado || null;

  if (etiquetas.length === 0 && !grupo && !numeroApariciones) return null;

  return (
    <div className="qpc-model-section">
      <div className="qpc-model-summary">
        {grupo && (
          <button
            type="button"
            className="qpc-topic-chip qpc-topic-chip-clickable"
            onClick={() => onGroupClick?.(grupo)}
            title={`Filtrar por ${grupo}`}
          >
            {grupo}
          </button>
        )}

        {numeroApariciones > 0 && (
          <span className="qpc-appearances-chip">
            {numeroApariciones} {numeroApariciones === 1 ? 'aparición' : 'apariciones'}
          </span>
        )}
      </div>

      {etiquetas.length > 0 && (
        <div className="qpc-model-tags" aria-label="Modelos de examen donde aparece esta pregunta">
          {etiquetas.map((etiqueta, index) => (
            <span key={`${etiqueta}-${index}`} className="qpc-model-tag">
              {etiqueta}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionHeader({ q, onEditQuestion }) {
  return (
    <div className="qpc-header">
      <div className="qpc-meta">
        <span className="qpc-tipo-label">{TIPO_LABELS[q.tipo] || q.tipo}</span>
        {q.temaPrincipalId && <span className="qpc-tema">{q.temaPrincipalId}</span>}
      </div>
      <div className="qpc-status-mini">
        <StatusBadges q={q} />
        <EditButton q={q} onEditQuestion={onEditQuestion} />
      </div>
    </div>
  );
}

// ─── Cabecera de progreso (Pregunta X de N) ──────────────────────────────────

function QuestionProgressHeader({
  q,
  questionNumber,
  totalQuestions,
  showCompactMeta,
  onGroupClick,
  onEditQuestion,
}) {
  const grupo = q.grupoTematico || q.patronRelacionado || null;

  return (
    <div className="qpc-progress-header">
      <div className="qpc-progress-main">
        <div className="qpc-question-number">
          Pregunta {questionNumber} de {totalQuestions}
        </div>

        <div className="qpc-question-context">
          {q.origenVisible || q.modeloExamenNombre || q.carpetaPrincipalNombre}
          {q.bloqueExamenNombre ? ` · ${q.bloqueExamenNombre}` : ''}
        </div>

        {(q.temaPrincipalId || grupo) && (
          <div className="qpc-question-topic">
            {grupo && (
              <button
                type="button"
                className="qpc-topic-chip qpc-topic-chip-clickable"
                onClick={() => onGroupClick?.(grupo)}
                title={`Filtrar por ${grupo}`}
              >
                {grupo}
              </button>
            )}

            {q.temaPrincipalId && (
              <span className="qpc-tema-chip">
                {q.temaPrincipalId}
              </span>
            )}
          </div>
        )}
      </div>

      {(showCompactMeta || (import.meta.env.DEV && onEditQuestion)) && (
        <div className="qpc-status-mini">
          {showCompactMeta && <StatusBadges q={q} />}
          <EditButton q={q} onEditQuestion={onEditQuestion} />
        </div>
      )}
    </div>
  );
}

// ─── Detalles secundarios (colapsables) ──────────────────────────────────────

function QuestionDetails({ q }) {
  const etiquetas = getModelLabels(q);
  const numeroApariciones = q.numeroApariciones || q.apariciones?.length || etiquetas.length;
  const ruta = Array.isArray(q.rutaJerarquica) ? q.rutaJerarquica : [];

  if (etiquetas.length === 0 && ruta.length === 0 && !numeroApariciones) return null;

  return (
    <details className="qpc-details">
      <summary className="qpc-details-summary">Detalles de la pregunta</summary>
      <div className="qpc-details-content">
        {ruta.length > 0 && <p className="qpc-details-ruta">{ruta.join(' / ')}</p>}

        {numeroApariciones > 0 && (
          <p className="qpc-details-apariciones">
            {numeroApariciones} {numeroApariciones === 1 ? 'aparición' : 'apariciones'}
          </p>
        )}

        {etiquetas.length > 0 && (
          <div className="qpc-model-tags" aria-label="Modelos de examen donde aparece esta pregunta">
            {etiquetas.map((etiqueta, index) => (
              <span key={`${etiqueta}-${index}`} className="qpc-model-tag">
                {etiqueta}
              </span>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

// ─── Tipo test ────────────────────────────────────────────────────────────────

function TestCard({ q }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const opciones = Array.isArray(q.opciones) && q.opciones.length > 0 ? q.opciones : null;
  const hasAnswer = q.respuestaCorrecta !== null && q.respuestaCorrecta !== undefined;

  const handleCheck = () => setChecked(true);

  const handleSelect = (i) => {
    setSelected(i);
    setChecked(false);
  };

  const isCorrect = hasAnswer && checked && selected === q.respuestaCorrecta;

  function opcionClass(i) {
    if (!checked) return selected === i ? 'selected' : '';
    if (!hasAnswer) return selected === i ? 'selected' : '';
    if (i === q.respuestaCorrecta) return 'correct';
    if (i === selected && i !== q.respuestaCorrecta) return 'wrong';
    return '';
  }

  return (
    <>
      {!opciones ? (
        <p className="qpc-missing">Esta pregunta no tiene opciones configuradas.</p>
      ) : (
        <div className="qpc-opciones">
          {opciones.map((op, i) => (
            <button
              key={i}
              className={`qpc-opcion ${opcionClass(i)}`}
              onClick={() => handleSelect(i)}
              disabled={checked && hasAnswer && i === selected && !isCorrect}
            >
              <span className="qpc-opcion-letra">{letraOpcion(i)}</span>
              <span className="qpc-opcion-texto">{op}</span>
            </button>
          ))}
        </div>
      )}

      {opciones && (
        <div className="qpc-actions">
          {checked && !hasAnswer && (
            <p className="qpc-pending-answer">
              Respuesta todavía no configurada. Puedes resolverla con el notebook completo del modelo.
            </p>
          )}

          {checked && hasAnswer && (
            <div className={`qpc-result ${isCorrect ? 'correct' : 'wrong'}`}>
              {isCorrect
                ? '✓ Correcto'
                : `✗ Incorrecto. Respuesta correcta: ${letraOpcion(q.respuestaCorrecta)}`}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleCheck}
            disabled={selected === null}
          >
            Comprobar
          </button>

          {checked && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                setSelected(null);
                setChecked(false);
              }}
            >
              Reintentar
            </button>
          )}
        </div>
      )}

      {checked && q.explicacion && (
        <div className="qpc-explicacion">
          <span className="qpc-explicacion-label">Explicación</span>
          <p>{q.explicacion}</p>
        </div>
      )}
    </>
  );
}

// ─── Verdadero / Falso ───────────────────────────────────────────────────────

function VFCard({ q }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const hasAnswer = q.respuestaCorrecta !== null && q.respuestaCorrecta !== undefined;
  const isCorrect = hasAnswer && checked && selected === q.respuestaCorrecta;

  function btnClass(val) {
    if (!checked) return selected === val ? 'selected' : '';
    if (!hasAnswer) return selected === val ? 'selected' : '';
    if (val === q.respuestaCorrecta) return 'correct';
    if (val === selected && val !== q.respuestaCorrecta) return 'wrong';
    return '';
  }

  const handleSelect = (val) => {
    setSelected(val);
    setChecked(false);
  };

  return (
    <>
      <div className="qpc-vf-buttons">
        <button className={`qpc-vf-btn ${btnClass(true)}`} onClick={() => handleSelect(true)}>
          Verdadero
        </button>
        <button className={`qpc-vf-btn ${btnClass(false)}`} onClick={() => handleSelect(false)}>
          Falso
        </button>
      </div>

      <div className="qpc-actions">
        {checked && !hasAnswer && (
          <p className="qpc-pending-answer">
            Respuesta todavía no configurada. Puedes resolverla con el notebook completo del modelo.
          </p>
        )}

        {checked && hasAnswer && (
          <div className={`qpc-result ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect
              ? '✓ Correcto'
              : `✗ Incorrecto. Respuesta correcta: ${q.respuestaCorrecta ? 'Verdadero' : 'Falso'}`}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={() => setChecked(true)}
          disabled={selected === null}
        >
          Comprobar
        </button>

        {checked && (
          <button
            className="btn btn-ghost"
            onClick={() => {
              setSelected(null);
              setChecked(false);
            }}
          >
            Reintentar
          </button>
        )}
      </div>

      {checked && q.explicacion && (
        <div className="qpc-explicacion">
          <span className="qpc-explicacion-label">Explicación</span>
          <p>{q.explicacion}</p>
        </div>
      )}
    </>
  );
}

// ─── Corta / Desarrollo / Práctica ───────────────────────────────────────────

function RevealCard({ q }) {
  const [revealed, setRevealed] = useState(false);

  const respuesta = q.tipo === 'practica' ? q.solucionOrientativa : q.respuestaModelo;
  const criterios = Array.isArray(q.criteriosCorreccion) ? q.criteriosCorreccion : [];
  const respuestaLabel = q.tipo === 'practica' ? 'Solución orientativa' : 'Respuesta modelo';
  const btnLabel = q.tipo === 'practica' ? 'Ver solución' : 'Ver respuesta';

  return (
    <>
      <div className="qpc-actions">
        <button
          className="btn btn-ghost"
          onClick={() => setRevealed(r => !r)}
        >
          {revealed ? `Ocultar ${q.tipo === 'practica' ? 'solución' : 'respuesta'}` : btnLabel}
        </button>
      </div>

      {revealed && (
        <div className="qpc-respuesta">
          <span className="qpc-respuesta-label">{respuestaLabel}</span>

          {respuesta && respuesta.trim() ? (
            <p className="qpc-respuesta-texto">{respuesta}</p>
          ) : (
            <p className="qpc-missing">
              {q.tipo === 'practica'
                ? 'Falta añadir solución orientativa para esta pregunta.'
                : 'Falta añadir respuesta modelo para esta pregunta.'}
            </p>
          )}

          {criterios.length > 0 && (
            <div className="qpc-criterios">
              <span className="qpc-criterios-label">Criterios de corrección</span>
              <ul className="qpc-criterios-list">
                {criterios.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function QuestionPracticeCard({
  question: q,
  onGroupClick,
  questionNumber,
  totalQuestions,
  showCompactMeta = false,
  onEditQuestion,
}) {
  const hasProgress = questionNumber != null && totalQuestions != null;

  function renderBody() {
    switch (q.tipo) {
      case 'test':
        return <TestCard q={q} />;
      case 'verdadero_falso':
        return <VFCard q={q} />;
      case 'corta':
      case 'desarrollo':
      case 'practica':
        return <RevealCard q={q} />;
      default:
        return <p className="qpc-missing">Tipo de pregunta desconocido: {q.tipo}</p>;
    }
  }

  return (
    <div className="qpc">
      {hasProgress ? (
       <QuestionProgressHeader
        q={q}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        showCompactMeta={showCompactMeta}
        onGroupClick={onGroupClick}
        onEditQuestion={onEditQuestion}
      />
      ) : (
        <>
          <QuestionHeader q={q} onEditQuestion={onEditQuestion} />
          <QuestionModelTags q={q} onGroupClick={onGroupClick} />
        </>
      )}

      <p className="qpc-enunciado">{q.enunciado}</p>
      {renderBody()}

      {hasProgress && <QuestionDetails q={q} />}
    </div>
  );
}
