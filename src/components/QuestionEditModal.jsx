import { useState, useEffect } from 'react';
import './QuestionEditModal.css';

const TIPO_OPTIONS = [
  { value: 'test', label: 'Test' },
  { value: 'verdadero_falso', label: 'Verdadero / Falso' },
  { value: 'corta', label: 'Respuesta corta' },
  { value: 'desarrollo', label: 'Desarrollo' },
  { value: 'practica', label: 'Práctica' },
];

const ORIGEN_OPTIONS = [
  { value: '', label: '— Sin especificar —' },
  { value: 'examen_real', label: 'Examen real' },
  { value: 'modelo_examen', label: 'Modelo de examen' },
  { value: 'autoevaluacion', label: 'Autoevaluación' },
  { value: 'indicada_clase', label: 'Indicada en clase' },
  { value: 'recopilada', label: 'Recopilada' },
  { value: 'generada_ia', label: 'Generada por IA' },
];

const PARTE_OPTIONS = [
  { value: '', label: '— Sin asignar —' },
  { value: 'parte-test', label: 'parte-test (Tipo test)' },
  { value: 'parte-cortas', label: 'parte-cortas (Preguntas cortas)' },
  { value: 'parte-desarrollo', label: 'parte-desarrollo (Desarrollo)' },
  { value: 'parte-problemas', label: 'parte-problemas (Problemas prácticos)' },
];

const PRIORIDAD_OPTIONS = [
  { value: '', label: '— Sin asignar —' },
  { value: 'muy_alta', label: 'Muy alta' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

const OPCION_LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

function arrayToText(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}

function textToArray(value) {
  return value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function getRespuestaCorrectaKind(tipo, opciones) {
  if (tipo === 'verdadero_falso') return 'boolean';
  if (tipo === 'test' && opciones.length > 0) return 'index';
  return 'none';
}

function buildFormData(question) {
  let respuestaCorrectaValue = '';
  if (question.respuestaCorrecta === true) respuestaCorrectaValue = 'true';
  else if (question.respuestaCorrecta === false) respuestaCorrectaValue = 'false';
  else if (typeof question.respuestaCorrecta === 'number') {
    respuestaCorrectaValue = String(question.respuestaCorrecta);
  }

  return {
    temaPrincipalId: question.temaPrincipalId || '',
    temaIds: arrayToText(question.temaIds),
    parteExamenId: question.parteExamenId || '',
    tipo: question.tipo || '',
    origen: question.origen || '',
    grupoTematico: question.grupoTematico || '',
    patronRelacionado: question.patronRelacionado || '',
    prioridadExamen: question.prioridadExamen || '',
    fuentes: arrayToText(question.fuentes),
    observaciones: question.observaciones || '',
    requiereRevision: Boolean(question.requiereRevision),
    verificada: Boolean(question.verificada),

    enunciado: question.enunciado || '',
    respuestaModelo: question.respuestaModelo || '',
    solucionOrientativa: question.solucionOrientativa || '',
    explicacion: question.explicacion || '',
    criteriosCorreccion: arrayToText(question.criteriosCorreccion),

    opciones: arrayToText(question.opciones),
    respuestaCorrectaValue,

    modeloExamenId: question.modeloExamenId || '',
    modeloExamenNombre: question.modeloExamenNombre || '',
    ordenPregunta: question.ordenPregunta != null ? String(question.ordenPregunta) : '',
  };
}

// Reconstruye la pregunta completa preservando todos los campos no editables
// (p. ej. campos específicos de AAMD como codigoReferencia, convocatorias, etc.)
// y sin añadir campos vacíos que no existían en el original.
function buildUpdatedQuestion(original, formData) {
  const result = { ...original };

  const setField = (key, value) => {
    const had = Object.prototype.hasOwnProperty.call(original, key);
    if (had || !isEmptyValue(value)) {
      result[key] = value;
    }
  };

  setField('temaPrincipalId', formData.temaPrincipalId.trim());
  setField('temaIds', textToArray(formData.temaIds));
  setField('parteExamenId', formData.parteExamenId || null);
  result.tipo = formData.tipo;
  setField('origen', formData.origen);
  setField('grupoTematico', formData.grupoTematico.trim());
  setField('patronRelacionado', formData.patronRelacionado.trim());
  setField('prioridadExamen', formData.prioridadExamen);
  setField('fuentes', textToArray(formData.fuentes));
  setField('observaciones', formData.observaciones);
  result.requiereRevision = formData.requiereRevision;
  result.verificada = formData.verificada;

  result.enunciado = formData.enunciado;
  setField('respuestaModelo', formData.respuestaModelo);
  setField('solucionOrientativa', formData.solucionOrientativa);
  setField('explicacion', formData.explicacion);
  setField('criteriosCorreccion', textToArray(formData.criteriosCorreccion));

  const opcionesArr = textToArray(formData.opciones);
  setField('opciones', opcionesArr);

  const respuestaCorrectaKind = getRespuestaCorrectaKind(formData.tipo, opcionesArr);
  if (respuestaCorrectaKind === 'boolean') {
    if (formData.respuestaCorrectaValue === 'true') result.respuestaCorrecta = true;
    else if (formData.respuestaCorrectaValue === 'false') result.respuestaCorrecta = false;
    else result.respuestaCorrecta = null;
  } else if (respuestaCorrectaKind === 'index') {
    result.respuestaCorrecta =
      formData.respuestaCorrectaValue === '' ? null : Number(formData.respuestaCorrectaValue);
  }
  // En otro caso se conserva el valor original de respuestaCorrecta (ya copiado por el spread).

  setField('modeloExamenId', formData.modeloExamenId.trim());
  setField('modeloExamenNombre', formData.modeloExamenNombre.trim());

  if (formData.ordenPregunta.trim() !== '') {
    result.ordenPregunta = Number(formData.ordenPregunta);
  } else if (Object.prototype.hasOwnProperty.call(original, 'ordenPregunta')) {
    result.ordenPregunta = null;
  }

  return result;
}

function TextField({ label, value, onChange, disabled, placeholder }) {
  return (
    <label className="qem-field">
      <span className="qem-label">{label}</span>
      <input
        type="text"
        className="qem-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 4, hint }) {
  return (
    <label className="qem-field">
      <span className="qem-label">{label}</span>
      <textarea
        className="qem-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
      />
      {hint && <span className="qem-hint">{hint}</span>}
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="qem-field">
      <span className="qem-label">{label}</span>
      <select className="qem-select" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function QuestionEditModal({ question, isOpen, onClose, onSave, saving = false, error = '' }) {
  const [formData, setFormData] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (question) {
      setFormData(buildFormData(question));
      setValidationError('');
    }
  }, [question]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (e) => {
      if (e.key === 'Escape' && !saving) onClose();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, saving, onClose]);

  if (!isOpen || !question || !formData) return null;

  const update = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const opcionesActuales = textToArray(formData.opciones);
  const hasOpcionesField = Object.prototype.hasOwnProperty.call(question, 'opciones');
  const showTestSection =
    formData.tipo === 'test' ||
    formData.tipo === 'verdadero_falso' ||
    hasOpcionesField ||
    opcionesActuales.length > 0;

  const respuestaCorrectaKind = getRespuestaCorrectaKind(formData.tipo, opcionesActuales);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.enunciado.trim()) {
      setValidationError('El enunciado no puede estar vacío.');
      return;
    }

    if (!formData.tipo.trim()) {
      setValidationError('El tipo de pregunta no puede estar vacío.');
      return;
    }

    setValidationError('');
    onSave(buildUpdatedQuestion(question, formData));
  };

  return (
    <div className="qem-overlay" onClick={() => !saving && onClose()}>
      <div className="qem-modal" onClick={e => e.stopPropagation()}>
        <div className="qem-header">
          <div>
            <h2>Editar pregunta</h2>
            <p className="qem-id">ID: {question.id}</p>
          </div>
          <button
            type="button"
            className="qem-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form className="qem-body" onSubmit={handleSubmit}>
          <div className="qem-section">
            <div className="qem-section-title">General</div>

            <div className="qem-row">
              <TextField label="ID" value={question.id} disabled />
              <TextField label="Asignatura" value={question.asignaturaId} disabled />
            </div>

            <div className="qem-row">
              <TextField
                label="Tema principal"
                value={formData.temaPrincipalId}
                onChange={v => update('temaPrincipalId', v)}
              />
              <SelectField
                label="Parte de examen"
                value={formData.parteExamenId}
                onChange={v => update('parteExamenId', v)}
                options={PARTE_OPTIONS}
              />
            </div>

            <div className="qem-row">
              <SelectField
                label="Tipo"
                value={formData.tipo}
                onChange={v => update('tipo', v)}
                options={TIPO_OPTIONS}
              />
              <SelectField
                label="Origen"
                value={formData.origen}
                onChange={v => update('origen', v)}
                options={ORIGEN_OPTIONS}
              />
            </div>

            <div className="qem-row">
              <TextField
                label="Grupo temático"
                value={formData.grupoTematico}
                onChange={v => update('grupoTematico', v)}
                placeholder="Ej. Validación cruzada"
              />
              <TextField
                label="Patrón relacionado"
                value={formData.patronRelacionado}
                onChange={v => update('patronRelacionado', v)}
              />
            </div>

            <div className="qem-row">
              <SelectField
                label="Prioridad de examen"
                value={formData.prioridadExamen}
                onChange={v => update('prioridadExamen', v)}
                options={PRIORIDAD_OPTIONS}
              />
            </div>

            <TextAreaField
              label="Temas relacionados (uno por línea)"
              value={formData.temaIds}
              onChange={v => update('temaIds', v)}
              rows={2}
            />

            <TextAreaField
              label="Fuentes (una por línea)"
              value={formData.fuentes}
              onChange={v => update('fuentes', v)}
              rows={2}
            />

            <div className="qem-checkbox-row">
              <label className="qem-checkbox">
                <input
                  type="checkbox"
                  checked={formData.requiereRevision}
                  onChange={e => update('requiereRevision', e.target.checked)}
                />
                <span>Requiere revisión</span>
              </label>

              <label className="qem-checkbox">
                <input
                  type="checkbox"
                  checked={formData.verificada}
                  onChange={e => update('verificada', e.target.checked)}
                />
                <span>Verificada</span>
              </label>
            </div>

            {!formData.parteExamenId && (
              <p className="qem-warning">
                ⚠️ Esta pregunta no tiene parte de examen asignada (parteExamenId vacío).
              </p>
            )}
          </div>

          <div className="qem-section">
            <div className="qem-section-title">Contenido</div>

            <TextAreaField
              label="Enunciado"
              value={formData.enunciado}
              onChange={v => update('enunciado', v)}
              rows={5}
            />

            <TextAreaField
              label="Respuesta modelo"
              value={formData.respuestaModelo}
              onChange={v => update('respuestaModelo', v)}
              rows={4}
            />

            <TextAreaField
              label="Solución orientativa"
              value={formData.solucionOrientativa}
              onChange={v => update('solucionOrientativa', v)}
              rows={4}
            />

            <TextAreaField
              label="Explicación"
              value={formData.explicacion}
              onChange={v => update('explicacion', v)}
              rows={3}
            />

            <TextAreaField
              label="Criterios de corrección (uno por línea)"
              value={formData.criteriosCorreccion}
              onChange={v => update('criteriosCorreccion', v)}
              rows={3}
            />
          </div>

          {showTestSection && (
            <div className="qem-section">
              <div className="qem-section-title">Tipo test / Verdadero-Falso</div>

              <TextAreaField
                label="Opciones (una por línea)"
                value={formData.opciones}
                onChange={v => update('opciones', v)}
                rows={4}
              />

              {respuestaCorrectaKind === 'index' && (
                <SelectField
                  label="Respuesta correcta"
                  value={formData.respuestaCorrectaValue}
                  onChange={v => update('respuestaCorrectaValue', v)}
                  options={[
                    { value: '', label: '— Sin respuesta —' },
                    ...opcionesActuales.map((op, i) => ({
                      value: String(i),
                      label: `${OPCION_LETRAS[i] ?? i}: ${op.slice(0, 60)}`,
                    })),
                  ]}
                />
              )}

              {respuestaCorrectaKind === 'boolean' && (
                <SelectField
                  label="Respuesta correcta"
                  value={formData.respuestaCorrectaValue}
                  onChange={v => update('respuestaCorrectaValue', v)}
                  options={[
                    { value: '', label: '— Sin respuesta —' },
                    { value: 'true', label: 'Verdadero' },
                    { value: 'false', label: 'Falso' },
                  ]}
                />
              )}

              {respuestaCorrectaKind === 'none' && (
                <p className="qem-hint">
                  El formato de "respuestaCorrecta" de esta pregunta no se modifica desde aquí.
                </p>
              )}
            </div>
          )}

          <div className="qem-section">
            <div className="qem-section-title">Modelo de examen</div>

            <div className="qem-row">
              <TextField
                label="ID del modelo"
                value={formData.modeloExamenId}
                onChange={v => update('modeloExamenId', v)}
                placeholder="Ej. 2025-modelo-a"
              />
              <TextField
                label="Nombre del modelo"
                value={formData.modeloExamenNombre}
                onChange={v => update('modeloExamenNombre', v)}
                placeholder="Ej. 2025 Modelo A"
              />
              <TextField
                label="Orden dentro del modelo"
                value={formData.ordenPregunta}
                onChange={v => update('ordenPregunta', v.replace(/[^0-9]/g, ''))}
                placeholder="Ej. 1"
              />
            </div>
          </div>

          <div className="qem-section">
            <div className="qem-section-title">Observaciones</div>

            <TextAreaField
              label="Observaciones internas"
              value={formData.observaciones}
              onChange={v => update('observaciones', v)}
              rows={3}
            />
          </div>

          {(validationError || error) && (
            <p className="qem-error">{validationError || error}</p>
          )}

          <div className="qem-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
