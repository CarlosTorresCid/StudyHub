import { useState } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../services/questionService';
import { draftService } from '../services/draftService';
import { publicLibrary } from '../lib/publicLibrary';
import FileUploader from '../components/FileUploader';
import ContentPreview from '../components/ContentPreview';
import './ManagementPage.css';

const DRAFT_NOTICE = 'Gestión local: las preguntas importadas solo se guardan en tu navegador como borrador. Para publicarlas, exporta el JSON validado y añádelo al repositorio.';

export default function ImportQuestionsPage() {
  const subjects = publicLibrary.getSubjects();
  const [jsonData, setJsonData] = useState(null);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const handleData = (data) => {
    setJsonData(data);
    setStatus(null);
    setErrors([]);
    if (data) {
      const arr = Array.isArray(data) ? data : [data];
      const ids = arr.map(q => q.id).filter(Boolean);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      const errs = [];
      if (dupes.length) errs.push(`IDs duplicados en el archivo: ${[...new Set(dupes)].join(', ')}`);
      arr.forEach((q, i) => {
        const e = questionService.validateQuestion(q);
        if (e.length) errs.push(`Pregunta ${i + 1} (id: ${q.id || '?'}): ${e.join('; ')}`);
      });
      setErrors(errs);
    }
  };

  const handleImport = () => {
    if (!jsonData || errors.length) return;
    try {
      const arr = Array.isArray(jsonData) ? jsonData : [jsonData];
      const result = questionService.importDraftFromJson(arr);
      const asigId = arr[0]?.asignaturaId;
      const temaId = arr[0]?.temaId;
      const paths = asigId && temaId ? draftService.getPublicationPaths(asigId, temaId) : null;
      setStatus({ type: 'success', added: result.added, asigId, temaId, paths });
      setJsonData(null);
    } catch (e) {
      setStatus({ type: 'error', msg: e.message });
    }
  };

  return (
    <div className="mgmt-page">
      <div className="mgmt-breadcrumb">
        <Link to="/gestion">Administración</Link>
        <span> / </span>
        <span>Importar borrador de preguntas</span>
      </div>

      <div className="mgmt-draft-notice">
        <span className="mgmt-notice-icon">⚠</span>
        <span>{DRAFT_NOTICE}</span>
      </div>

      <div className="mgmt-header">
        <div>
          <h1>⬆ Importar borrador de preguntas</h1>
          <p className="mgmt-subtitle">Importa preguntas reales o generadas con IA para probarlas</p>
        </div>
      </div>

      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Formato del JSON</h3>
        <div className="import-schema">
          <pre>{`[
  {
    "id": "casi-real-test-001",
    "asignaturaId": "casi",          // uno de: ${subjects.map(s => s.id).join(', ')}
    "temaId": "tema-1",
    "parteExamenId": "parte-test",   // ID de la parte según configuracion.json
    "tipo": "test",                  // test | vf | desarrollo | practicas | sql | casos
    "enunciado": "...",
    "opciones": ["A", "B", "C", "D"],
    "respuestaCorrecta": 0,
    "explicacion": "...",
    "origen": "examen_real",         // examen_real | generada_ia
    "convocatoria": "2024-ordinaria",
    "dificultad": "media"
  }
]`}
          </pre>
        </div>

        <div className="form-group" style={{ marginTop: 12 }}>
          <label>Consultar estructura de examen de una asignatura</label>
          <select className="form-select" value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}>
            <option value="">Selecciona asignatura…</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.abreviatura} — {s.nombre}</option>)}
          </select>
        </div>
        {selectedSubject && (() => {
          const subject = subjects.find(s => s.id === selectedSubject);
          const partes = subject?.estructuraExamen || [];
          if (!partes.length) return <p className="mgmt-empty-msg">Esta asignatura todavía no tiene estructura de examen en el repositorio.</p>;
          return (
            <div className="import-partes-list">
              {partes.map(p => (
                <div key={p.id} className="import-parte-item">
                  <code>{p.id}</code> → {p.nombre} ({p.tipo}, {p.numeroPreguntasExamen} preg.)
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Subir archivo</h3>
        <FileUploader onData={handleData} label="Subir JSON de preguntas"
          hint="Array de preguntas según el formato indicado" />
        {errors.length > 0 && (
          <div className="import-errors">
            {errors.slice(0, 8).map((e, i) => <p key={i} className="mgmt-error">⚠ {e}</p>)}
            {errors.length > 8 && <p className="mgmt-error">… y {errors.length - 8} errores más</p>}
          </div>
        )}
      </div>

      {jsonData && errors.length === 0 && (
        <div className="mgmt-section">
          <h3 className="mgmt-section-title">Vista previa</h3>
          <ContentPreview data={Array.isArray(jsonData) ? jsonData : [jsonData]} type="questions" />
        </div>
      )}

      {status?.type === 'success' && (
        <div className="import-status success">
          <p>✓ {status.added} pregunta{status.added !== 1 ? 's' : ''} guardada{status.added !== 1 ? 's' : ''} como borrador</p>
          {status.paths && (
            <p className="import-pub-path">
              Para publicarlas: exporta el JSON y guárdalo en <code>{status.paths.preguntas}</code>
            </p>
          )}
          {status.asigId && status.temaId && (
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}
              onClick={() => draftService.exportQuestions(status.asigId, status.temaId)}>
              ⬇ Exportar JSON de preguntas
            </button>
          )}
        </div>
      )}
      {status?.type === 'error' && (
        <div className="import-status error">✗ {status.msg}</div>
      )}

      <div className="mgmt-save-bar">
        <button className="btn btn-primary" onClick={handleImport}
          disabled={!jsonData || errors.length > 0}>
          ⬆ Guardar borrador de preguntas
        </button>
        <Link to="/gestion" className="btn btn-ghost">Volver</Link>
      </div>
    </div>
  );
}
