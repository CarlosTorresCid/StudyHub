import { useState } from 'react';
import './QuestionPracticeCard.css';

const TIPO_LABELS = {
  test: 'Test',
  verdadero_falso: 'Verdadero / Falso',
  corta: 'Respuesta corta',
  desarrollo: 'Desarrollo',
  practica: 'Práctica',
};

function StatusBadges({ q }) {
  return (
    <div className="qpc-badges">
      {q.requiereRevision && <span className="qpc-badge qpc-badge-revision">Revisar</span>}
      {q.verificada && <span className="qpc-badge qpc-badge-verified">Verificada</span>}
    </div>
  );
}

function QuestionHeader({ q }) {
  return (
    <div className="qpc-header">
      <div className="qpc-meta">
        <span className="qpc-tipo-label">{TIPO_LABELS[q.tipo] || q.tipo}</span>
        {q.temaPrincipalId && <span className="qpc-tema">{q.temaPrincipalId}</span>}
      </div>
      <StatusBadges q={q} />
    </div>
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

  const isCorrect = checked && selected === q.respuestaCorrecta;

  function opcionClass(i) {
    if (!checked) return selected === i ? 'selected' : '';
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
              disabled={checked && i === selected && !isCorrect}
            >
              <span className="qpc-opcion-letra">{String.fromCharCode(65 + i)}</span>
              <span className="qpc-opcion-texto">{op}</span>
            </button>
          ))}
        </div>
      )}

      {opciones && (
        <div className="qpc-actions">
          {!hasAnswer && checked && (
            <p className="qpc-missing">No hay respuesta correcta configurada todavía.</p>
          )}
          {checked && hasAnswer && (
            <div className={`qpc-result ${isCorrect ? 'correct' : 'wrong'}`}>
              {isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
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
            <button className="btn btn-ghost" onClick={() => { setSelected(null); setChecked(false); }}>
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
  const [selected, setSelected] = useState(null); // true | false | null
  const [checked, setChecked] = useState(false);

  const hasAnswer = q.respuestaCorrecta !== null && q.respuestaCorrecta !== undefined;
  const isCorrect = checked && selected === q.respuestaCorrecta;

  function btnClass(val) {
    if (!checked) return selected === val ? 'selected' : '';
    if (val === q.respuestaCorrecta) return 'correct';
    if (val === selected && val !== q.respuestaCorrecta) return 'wrong';
    return '';
  }

  const handleSelect = (val) => { setSelected(val); setChecked(false); };

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
        {!hasAnswer && checked && (
          <p className="qpc-missing">No hay respuesta correcta configurada todavía.</p>
        )}
        {checked && hasAnswer && (
          <div className={`qpc-result ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
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
          <button className="btn btn-ghost" onClick={() => { setSelected(null); setChecked(false); }}>
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

export default function QuestionPracticeCard({ question: q }) {
  function renderBody() {
    switch (q.tipo) {
      case 'test': return <TestCard q={q} />;
      case 'verdadero_falso': return <VFCard q={q} />;
      case 'corta':
      case 'desarrollo':
      case 'practica': return <RevealCard q={q} />;
      default: return <p className="qpc-missing">Tipo de pregunta desconocido: {q.tipo}</p>;
    }
  }

  return (
    <div className="qpc">
      <QuestionHeader q={q} />
      <p className="qpc-enunciado">{q.enunciado}</p>
      {renderBody()}
    </div>
  );
}
