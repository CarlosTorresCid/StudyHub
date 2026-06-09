import { useState } from 'react';
import { Link } from 'react-router-dom';
import { draftService } from '../services/draftService';
import { publicLibrary } from '../lib/publicLibrary';
import './ManagementPage.css';

export default function QuestionBankPage() {
  const subjects = publicLibrary.getSubjects();
  const [filterSubject, setFilterSubject] = useState('');
  const [filterOrigen, setFilterOrigen] = useState('');
  const [, forceUpdate] = useState(0);

  const allDraft = draftService.getAllDraftQuestions();

  const filtered = allDraft.filter(q => {
    if (filterSubject && q.asignaturaId !== filterSubject) return false;
    if (filterOrigen && q.origen !== filterOrigen) return false;
    return true;
  });

  const stats = filtered.reduce(
    (acc, q) => {
      acc.total += 1;
      acc.porTipo[q.tipo] = (acc.porTipo[q.tipo] || 0) + 1;
      acc.porOrigen[q.origen] = (acc.porOrigen[q.origen] || 0) + 1;

      if (q.verificada) acc.verificadas += 1;
      if (q.requiereRevision) acc.revision += 1;

      return acc;
    },
    {
      total: 0,
      porTipo: {},
      porOrigen: {},
      verificadas: 0,
      revision: 0,
    }
  );

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar esta pregunta del borrador?')) return;
    draftService.deleteDraftQuestion(id);
    forceUpdate(n => n + 1);
  };

  const subjectName = (id) => subjects.find(s => s.id === id)?.abreviatura || id;

  return (
    <div className="mgmt-page">
      <div className="mgmt-breadcrumb">
        <Link to="/gestion">Administración</Link>
        <span> / </span>
        <span>Borradores de preguntas</span>
      </div>

      <div className="mgmt-draft-notice">
        <span className="mgmt-notice-icon">⚠</span>
        <span>
          Solo se muestran las preguntas guardadas localmente como borrador.
          Las preguntas publicadas en el repositorio no aparecen aquí.
        </span>
      </div>

      <div className="mgmt-header">
        <div>
          <h1>❓ Borradores de preguntas</h1>
          <p className="mgmt-subtitle">
            {allDraft.length} pregunta{allDraft.length !== 1 ? 's' : ''} en borradores locales
          </p>
        </div>

        <Link to="/gestion/importar/preguntas" className="btn btn-primary btn-sm">
          + Importar
        </Link>
      </div>

      <div className="mgmt-section">
        <div className="form-row">
          <div className="form-group">
            <label>Asignatura</label>
            <select
              className="form-select"
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
            >
              <option value="">Todas</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.abreviatura}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Origen</label>
            <select
              className="form-select"
              value={filterOrigen}
              onChange={e => setFilterOrigen(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="examen_real">📝 Examen real</option>
              <option value="modelo_examen">📄 Modelo de examen</option>
              <option value="autoevaluacion">✅ Autoevaluación</option>
              <option value="indicada_clase">🎓 Indicada en clase</option>
              <option value="recopilada">📚 Recopilada</option>
              <option value="generada_ia">🤖 Generada IA</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Preguntas ({filtered.length})</h3>

        {filtered.length > 0 && (
          <div className="qbank-stats">
            <span className="qbank-stat-item">
              Total: <strong>{stats.total}</strong>
            </span>

            <span className="qbank-stat-item">
              Verificadas: <strong>{stats.verificadas}</strong>
            </span>

            <span className="qbank-stat-item">
              Revisión: <strong>{stats.revision}</strong>
            </span>

            {Object.entries(stats.porTipo).map(([tipo, count]) => (
              <span key={tipo} className="qbank-stat-item">
                {tipo}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="qbank-empty">
            <p>No hay borradores de preguntas con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="qbank-table">
            {filtered.map(q => (
              <div key={q.id} className="qbank-row">
                <span className="qbank-tipo">{q.tipo}</span>

                <span className="qbank-origen">
                  {subjectName(q.asignaturaId)} · {q.temaId || q.temaPrincipalId}
                </span>

                <span className="qbank-enunciado">{q.enunciado}</span>

                <span className="qbank-parte">
                  {q.origen === 'examen_real' ? '📝' : '🤖'} {q.convocatoria || q.origen}
                </span>

                <button
                  type="button"
                  className="qbank-delete"
                  onClick={() => handleDelete(q.id)}
                  title="Eliminar"
                  aria-label={`Eliminar pregunta ${q.id}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {allDraft.length > 0 && (
        <div className="mgmt-save-bar">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              draftService.exportQuestions(filterSubject || undefined, undefined);
            }}
          >
            ⬇ Exportar visibles
          </button>

          <button
            type="button"
            className="btn btn-danger-ghost btn-sm"
            onClick={() => {
              if (confirm('¿Borrar TODOS los borradores de preguntas?')) {
                draftService.clearAllDraftQuestions();
                forceUpdate(n => n + 1);
              }
            }}
          >
            🗑 Borrar todos los borradores
          </button>
        </div>
      )}
    </div>
  );
}