import { useState } from 'react';
import { questionService } from '../services/questionService';
import './ExamStructureBuilder.css';

const TIPOS = [
  { value: 'test', label: 'Tipo test' },
  { value: 'vf', label: 'Verdadero/Falso' },
  { value: 'desarrollo', label: 'Desarrollo' },
  { value: 'practicas', label: 'Prácticas' },
  { value: 'sql', label: 'SQL / Código' },
  { value: 'casos', label: 'Casos prácticos' },
];

const TIPO_TO_ID = {
  test: 'parte-test', vf: 'parte-vf', desarrollo: 'parte-desarrollo',
  practicas: 'parte-practica', sql: 'parte-sql', casos: 'parte-casos',
};

const generateParteId = (tipo, existingPartes) => {
  const base = TIPO_TO_ID[tipo] || `parte-${tipo}`;
  if (!existingPartes.find(p => p.id === base)) return base;
  let n = 2;
  while (existingPartes.find(p => p.id === `${base}-${n}`)) n++;
  return `${base}-${n}`;
};

const emptyParte = (tipo, existingPartes) => ({
  id: generateParteId(tipo, existingPartes),
  _originalId: null,
  nombre: '',
  tipo,
  numeroPreguntasExamen: 10,
  puntuacion: 5,
  penalizacion: false,
  descripcionEstilo: '',
});

export default function ExamStructureBuilder({ partes = [], onChange, asignaturaId }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [idError, setIdError] = useState('');

  const startAdd = () => {
    const nueva = emptyParte('test', partes);
    setEditing(nueva.id);
    setForm(nueva);
    setIdError('');
  };

  const startEdit = (parte) => {
    setEditing(parte.id);
    setForm({ ...parte, _originalId: parte._originalId || parte.id });
    setIdError('');
  };

  const cancelEdit = () => { setEditing(null); setForm(null); setIdError(''); };

  const handleTipoChange = (tipo) => {
    const newId = generateParteId(tipo, partes.filter(p => p.id !== form.id));
    setForm(f => ({ ...f, tipo, id: newId }));
    setIdError('');
  };

  const handleIdChange = (newId) => {
    setForm(f => ({ ...f, id: newId }));
    const dup = partes.find(p => p.id === newId && p.id !== (form._originalId || editing));
    setIdError(dup ? `El ID "${newId}" ya está en uso` : '');
  };

  const saveEdit = () => {
    if (!form.nombre.trim() || idError) return;

    const oldId = form._originalId;
    const newId = form.id;
    const idChanged = oldId && oldId !== newId;

    if (idChanged && asignaturaId) {
      const affectedCount = questionService.countByParte(oldId);
      if (affectedCount > 0) {
        if (!confirm(`El ID cambió de "${oldId}" a "${newId}". Hay ${affectedCount} pregunta(s) vinculadas. ¿Actualizar sus referencias?`)) return;
        questionService.updateParteId(oldId, newId);
      }
    }

    const { _originalId, ...parteClean } = { ...form, id: newId };
    const updated = [...partes];
    const idx = updated.findIndex(p => p.id === (oldId || newId));
    if (idx >= 0) updated[idx] = parteClean;
    else updated.push(parteClean);
    onChange(updated);
    setEditing(null);
    setForm(null);
    setIdError('');
  };

  const remove = (id) => onChange(partes.filter(p => p.id !== id));

  const moveUp = (i) => {
    if (i === 0) return;
    const updated = [...partes];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    onChange(updated);
  };

  const moveDown = (i) => {
    if (i === partes.length - 1) return;
    const updated = [...partes];
    [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
    onChange(updated);
  };

  return (
    <div className="exam-builder">
      {partes.length === 0 && !editing && (
        <div className="exam-builder-empty">
          <p>No hay partes definidas. Añade la estructura del examen.</p>
        </div>
      )}

      {partes.map((parte, i) => (
        editing === parte.id && form ? (
          <ParteForm
            key={parte.id}
            form={form} setForm={setForm}
            idError={idError}
            onTipoChange={handleTipoChange}
            onIdChange={handleIdChange}
            onSave={saveEdit} onCancel={cancelEdit}
          />
        ) : (
          <div key={parte.id} className="exam-parte-row">
            <div className="exam-parte-order">
              <button onClick={() => moveUp(i)} disabled={i === 0} title="Subir">↑</button>
              <span>{i + 1}</span>
              <button onClick={() => moveDown(i)} disabled={i === partes.length - 1} title="Bajar">↓</button>
            </div>
            <div className="exam-parte-info">
              <div className="exam-parte-nombre">{parte.nombre}</div>
              <div className="exam-parte-meta">
                <span className="exam-parte-tipo">{TIPOS.find(t => t.value === parte.tipo)?.label || parte.tipo}</span>
                <span>{parte.numeroPreguntasExamen} preguntas</span>
                {parte.puntuacion > 0 && <span>{parte.puntuacion} pts</span>}
                {parte.penalizacion && <span className="penalizacion">⚠ Penaliza</span>}
              </div>
              {parte.descripcionEstilo && <div className="exam-parte-desc">{parte.descripcionEstilo}</div>}
              <div className="exam-parte-id">
                ID: <code>{parte.id}</code>
              </div>
            </div>
            <div className="exam-parte-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(parte)}>Editar</button>
              <button className="btn btn-danger-ghost btn-sm" onClick={() => remove(parte.id)}>×</button>
            </div>
          </div>
        )
      ))}

      {editing && form && !partes.find(p => p.id === (form._originalId || editing)) && (
        <ParteForm
          form={form} setForm={setForm}
          idError={idError}
          onTipoChange={handleTipoChange}
          onIdChange={handleIdChange}
          onSave={saveEdit} onCancel={cancelEdit}
        />
      )}

      {!editing && (
        <button className="btn btn-ghost exam-builder-add" onClick={startAdd}>
          + Añadir parte del examen
        </button>
      )}
    </div>
  );
}

function ParteForm({ form, setForm, idError, onTipoChange, onIdChange, onSave, onCancel }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="exam-parte-form">
      <div className="form-row">
        <div className="form-group">
          <label>Nombre de la parte</label>
          <input className="form-input" value={form.nombre}
            onChange={e => set('nombre', e.target.value)}
            placeholder="Ej: Preguntas tipo test" />
        </div>
        <div className="form-group form-group-sm">
          <label>Tipo</label>
          <select className="form-select" value={form.tipo}
            onChange={e => onTipoChange(e.target.value)}>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>ID de la parte <span style={{ fontWeight: 400, color: 'var(--text-dim)' }}>(úsalo en los JSON de preguntas como parteExamenId)</span></label>
        <input
          className={`form-input mgmt-tema-id-input ${idError ? 'input-error' : ''}`}
          value={form.id}
          onChange={e => onIdChange(e.target.value)}
          spellCheck={false}
        />
        {idError && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{idError}</p>}
      </div>
      <div className="form-row">
        <div className="form-group form-group-sm">
          <label>Nº preguntas en examen</label>
          <input className="form-input" type="number" min="1"
            value={form.numeroPreguntasExamen}
            onChange={e => set('numeroPreguntasExamen', parseInt(e.target.value) || 1)} />
        </div>
        <div className="form-group form-group-sm">
          <label>Puntuación total</label>
          <input className="form-input" type="number" min="0" step="0.5"
            value={form.puntuacion}
            onChange={e => set('puntuacion', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="form-group form-group-sm form-group-checkbox">
          <label>
            <input type="checkbox" checked={form.penalizacion}
              onChange={e => set('penalizacion', e.target.checked)} />
            Penaliza errores
          </label>
        </div>
      </div>
      <div className="form-group">
        <label>Descripción del estilo (opcional)</label>
        <textarea className="form-input" rows={2} value={form.descripcionEstilo}
          onChange={e => set('descripcionEstilo', e.target.value)}
          placeholder="Describe el tipo de preguntas de esta parte..." />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary btn-sm" onClick={onSave}
          disabled={!form.nombre.trim() || !!idError}>
          Guardar parte
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
