import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { contentService } from '../services/contentService';
import { localAdminService } from '../services/localAdminService';
import './EditPage.css';
import './ManagementPage.css';

// ── Helpers de reordenación ──────────────────────────────────────────────────
const swap = (arr, i, j) => {
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
};
const remove = (arr, i) => arr.filter((_, idx) => idx !== i);

// Genera el siguiente ID de flashcard: [asig]-[tema]-fc-NNN
function nextFcId(asignaturaId, temaId, flashcards) {
  const prefix = `${asignaturaId}-${temaId}-fc-`;
  const nums = flashcards
    .map(f => {
      const n = parseInt(f.id?.replace(prefix, '') || '0', 10);
      return isNaN(n) ? 0 : n;
    })
    .filter(n => n > 0);
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

// ── Editor principal ─────────────────────────────────────────────────────────
export default function EditPage() {
  const { asignaturaId, temaId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);
  const publicContent = publicLibrary.getTemaContent(asignaturaId, temaId);

  const [form, setForm] = useState(() => {
    if (!publicContent) return null;
    return {
      ...publicContent,
      apuntes: publicContent.apuntes || { introduccion: '', secciones: [] },
      resumen: publicContent.resumen || [],
      conceptosClave: publicContent.conceptosClave || [],
      flashcards: publicContent.flashcards || [],
    };
  });

  const [tab, setTab] = useState('apuntes');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const set = useCallback((updater) => setForm(f => typeof updater === 'function' ? updater(f) : { ...f, ...updater }), []);

  // ── Guardar ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form || saving) return;
    const errors = contentService.validate(form);
    if (errors.length) { setValidationErrors(errors); return; }
    setValidationErrors([]);
    setSaving(true);
    try {
      const result = await localAdminService.publicarTema(form);
      setSaveStatus({ type: 'success', result });
    } catch (e) {
      setSaveStatus({ type: 'error', msg: e.message });
    } finally {
      setSaving(false);
    }
  };

  // ── Sin contenido público ────────────────────────────────────────────────
  if (!publicContent) {
    return (
      <div className="mgmt-page">
        <div className="mgmt-breadcrumb">
          <Link to="/gestion">Administración</Link>
          <span> / Editar</span>
        </div>
        <div className="page-error" style={{ flexDirection: 'column', gap: 12 }}>
          <p>El tema <strong>{asignaturaId} / {temaId}</strong> no está publicado en la sesión actual.</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Si acabas de crearlo, reinicia <code>npm run dev</code> para que aparezca.
          </p>
          <Link to="/gestion" className="btn btn-ghost">← Volver</Link>
        </div>
      </div>
    );
  }

  const TABS = ['apuntes', 'resumen', 'conceptos', 'flashcards'];
  const filePath = `src/data/public/${asignaturaId}/temas/${temaId}-contenido.json`;

  return (
    <div className="edit-page">
      {/* Cabecera fija */}
      <div className="edit-header">
        <div className="edit-header-left">
          <Link to="/gestion" className="btn btn-ghost btn-sm">← Administración</Link>
          <div className="edit-header-meta">
            <span className="edit-asig" style={{ color: subject?.color }}>{subject?.abreviatura || asignaturaId}</span>
            <span className="edit-sep">/</span>
            <code className="edit-tema-id">{temaId}</code>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios en biblioteca local'}
        </button>
      </div>

      {/* Mensajes de estado */}
      {validationErrors.length > 0 && (
        <div className="edit-notice error">
          {validationErrors.map((e, i) => <p key={i}>⚠ {e}</p>)}
        </div>
      )}
      {saveStatus?.type === 'success' && (
        <div className="edit-notice success">
          <p>✓ Cambios guardados en: <code>{saveStatus.result.path}</code></p>
          <p style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>
            Recarga la página para ver los cambios en la vista pública.
            Recuerda hacer commit y deploy para publicarlos a tus compañeros.
          </p>
        </div>
      )}
      {saveStatus?.type === 'error' && (
        <div className="edit-notice error"><p>✗ {saveStatus.msg}</p></div>
      )}

      <div className="edit-body">
        {/* Título */}
        <div className="edit-titulo-section">
          <label className="edit-field-label">Título del tema</label>
          <input className="form-input edit-titulo-input"
            value={form.titulo}
            onChange={e => set({ titulo: e.target.value })}
            placeholder="Tema N. Nombre completo del tema"
          />
          <p className="edit-file-path">{filePath}</p>
        </div>

        {/* Pestañas del editor */}
        <div className="edit-tabs">
          {TABS.map(t => (
            <button key={t} className={`edit-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}>
              {{ apuntes: '📖 Apuntes', resumen: '⚡ Resumen', conceptos: '🔑 Conceptos', flashcards: '🃏 Flashcards' }[t]}
            </button>
          ))}
        </div>

        <div className="edit-tab-content">
          {tab === 'apuntes' && <ApuntesEditor form={form} set={set} />}
          {tab === 'resumen' && <ResumenEditor form={form} set={set} />}
          {tab === 'conceptos' && <ConceptosEditor form={form} set={set} />}
          {tab === 'flashcards' && <FlashcardsEditor form={form} set={set} asignaturaId={asignaturaId} temaId={temaId} />}
        </div>
      </div>
    </div>
  );
}

// ── Editor de Apuntes ────────────────────────────────────────────────────────
function ApuntesEditor({ form, set }) {
  const apuntes = form.apuntes || { introduccion: '', secciones: [] };

  const setIntro = (v) => set(f => ({ ...f, apuntes: { ...f.apuntes, introduccion: v } }));
  const setSecciones = (fn) => set(f => ({ ...f, apuntes: { ...f.apuntes, secciones: fn(f.apuntes?.secciones || []) } }));

  return (
    <div className="editor-section">
      <div className="editor-field">
        <label className="edit-field-label">Introducción</label>
        <textarea className="form-input" rows={4}
          value={apuntes.introduccion || ''}
          onChange={e => setIntro(e.target.value)}
          placeholder="Párrafo introductorio del tema…" />
      </div>

      <div className="editor-field">
        <div className="editor-field-header">
          <label className="edit-field-label">Secciones ({apuntes.secciones?.length || 0})</label>
          <button className="btn btn-ghost btn-sm"
            onClick={() => setSecciones(ss => [...ss, { titulo: '', contenido: '' }])}>
            + Añadir sección
          </button>
        </div>
        {(!apuntes.secciones || apuntes.secciones.length === 0) && (
          <p className="edit-empty">Sin secciones. Pulsa "+ Añadir sección".</p>
        )}
        {apuntes.secciones?.map((sec, i) => (
          <div key={i} className="editor-item">
            <div className="editor-item-controls">
              <span className="editor-item-num">{i + 1}</span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="form-input"
                  value={sec.titulo}
                  placeholder="Título de la sección"
                  onChange={e => setSecciones(ss => ss.map((s, j) => j === i ? { ...s, titulo: e.target.value } : s))} />
                <textarea className="form-input" rows={5}
                  value={sec.contenido}
                  placeholder="Contenido. Usa **negrita**, *cursiva* y '- ' para listas."
                  onChange={e => setSecciones(ss => ss.map((s, j) => j === i ? { ...s, contenido: e.target.value } : s))} />
              </div>
              <div className="editor-item-btns">
                <button className="edit-move-btn" onClick={() => setSecciones(ss => swap(ss, i, i - 1))} disabled={i === 0}>↑</button>
                <button className="edit-move-btn" onClick={() => setSecciones(ss => swap(ss, i, i + 1))} disabled={i === apuntes.secciones.length - 1}>↓</button>
                <button className="edit-del-btn" onClick={() => setSecciones(ss => remove(ss, i))}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Editor de Resumen ────────────────────────────────────────────────────────
function ResumenEditor({ form, set }) {
  const resumen = form.resumen || [];
  const setResumen = (fn) => set(f => ({ ...f, resumen: fn(f.resumen || []) }));

  return (
    <div className="editor-section">
      <div className="editor-field">
        <div className="editor-field-header">
          <label className="edit-field-label">Puntos de resumen ({resumen.length})</label>
          <button className="btn btn-ghost btn-sm" onClick={() => setResumen(r => [...r, ''])}>
            + Añadir punto
          </button>
        </div>
        {resumen.length === 0 && <p className="edit-empty">Sin puntos. Pulsa "+ Añadir punto".</p>}
        {resumen.map((punto, i) => (
          <div key={i} className="editor-item editor-item-inline">
            <span className="editor-item-num">{i + 1}</span>
            <input className="form-input" style={{ flex: 1 }}
              value={punto}
              placeholder="Punto del resumen…"
              onChange={e => setResumen(r => r.map((p, j) => j === i ? e.target.value : p))} />
            <div className="editor-item-btns">
              <button className="edit-move-btn" onClick={() => setResumen(r => swap(r, i, i - 1))} disabled={i === 0}>↑</button>
              <button className="edit-move-btn" onClick={() => setResumen(r => swap(r, i, i + 1))} disabled={i === resumen.length - 1}>↓</button>
              <button className="edit-del-btn" onClick={() => setResumen(r => remove(r, i))}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Editor de Conceptos clave ────────────────────────────────────────────────
function ConceptosEditor({ form, set }) {
  const conceptos = form.conceptosClave || [];
  const setConceptos = (fn) => set(f => ({ ...f, conceptosClave: fn(f.conceptosClave || []) }));

  return (
    <div className="editor-section">
      <div className="editor-field">
        <div className="editor-field-header">
          <label className="edit-field-label">Conceptos clave ({conceptos.length})</label>
          <button className="btn btn-ghost btn-sm"
            onClick={() => setConceptos(cs => [...cs, { termino: '', definicion: '' }])}>
            + Añadir concepto
          </button>
        </div>
        {conceptos.length === 0 && <p className="edit-empty">Sin conceptos. Pulsa "+ Añadir concepto".</p>}
        {conceptos.map((c, i) => (
          <div key={i} className="editor-item">
            <div className="editor-item-controls">
              <span className="editor-item-num">{i + 1}</span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input className="form-input"
                  value={c.termino}
                  placeholder="Término o concepto"
                  onChange={e => setConceptos(cs => cs.map((x, j) => j === i ? { ...x, termino: e.target.value } : x))} />
                <textarea className="form-input" rows={2}
                  value={c.definicion}
                  placeholder="Definición breve"
                  onChange={e => setConceptos(cs => cs.map((x, j) => j === i ? { ...x, definicion: e.target.value } : x))} />
              </div>
              <div className="editor-item-btns">
                <button className="edit-move-btn" onClick={() => setConceptos(cs => swap(cs, i, i - 1))} disabled={i === 0}>↑</button>
                <button className="edit-move-btn" onClick={() => setConceptos(cs => swap(cs, i, i + 1))} disabled={i === conceptos.length - 1}>↓</button>
                <button className="edit-del-btn" onClick={() => setConceptos(cs => remove(cs, i))}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Editor de Flashcards ─────────────────────────────────────────────────────
function FlashcardsEditor({ form, set, asignaturaId, temaId }) {
  const flashcards = form.flashcards || [];
  const setFlashcards = (fn) => set(f => ({ ...f, flashcards: fn(f.flashcards || []) }));

  const addFlashcard = () => {
    const newId = nextFcId(asignaturaId, temaId, flashcards);
    setFlashcards(fs => [...fs, { id: newId, pregunta: '', respuesta: '' }]);
  };

  return (
    <div className="editor-section">
      <div className="editor-field">
        <div className="editor-field-header">
          <label className="edit-field-label">Flashcards ({flashcards.length})</label>
          <button className="btn btn-ghost btn-sm" onClick={addFlashcard}>+ Añadir flashcard</button>
        </div>
        {flashcards.length === 0 && <p className="edit-empty">Sin flashcards. Pulsa "+ Añadir flashcard".</p>}
        {flashcards.map((fc, i) => (
          <div key={fc.id || i} className="editor-item">
            <div className="editor-item-controls">
              <div className="editor-fc-num">
                <span className="editor-item-num">{i + 1}</span>
                <code className="editor-fc-id">{fc.id}</code>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input className="form-input"
                  value={fc.pregunta}
                  placeholder="Pregunta de la flashcard"
                  onChange={e => setFlashcards(fs => fs.map((x, j) => j === i ? { ...x, pregunta: e.target.value } : x))} />
                <textarea className="form-input" rows={3}
                  value={fc.respuesta}
                  placeholder="Respuesta de la flashcard"
                  onChange={e => setFlashcards(fs => fs.map((x, j) => j === i ? { ...x, respuesta: e.target.value } : x))} />
              </div>
              <div className="editor-item-btns">
                <button className="edit-move-btn" onClick={() => setFlashcards(fs => swap(fs, i, i - 1))} disabled={i === 0}>↑</button>
                <button className="edit-move-btn" onClick={() => setFlashcards(fs => swap(fs, i, i + 1))} disabled={i === flashcards.length - 1}>↓</button>
                <button className="edit-del-btn" onClick={() => setFlashcards(fs => remove(fs, i))}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
