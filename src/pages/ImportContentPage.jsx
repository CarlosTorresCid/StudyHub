import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { publicLibrary } from '../lib/publicLibrary';
import { localAdminService } from '../services/localAdminService';
import FileUploader from '../components/FileUploader';
import ContentPreview from '../components/ContentPreview';
import './ManagementPage.css';

export default function ImportContentPage() {
  const navigate = useNavigate();
  const subjects = publicLibrary.getSubjects();
  const [jsonData, setJsonData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const [overwriteConfirm, setOverwriteConfirm] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleData = (data) => {
    setJsonData(data);
    setStatus(null);
    setErrors([]);
    setOverwriteConfirm(false);

    if (data) {
      setErrors(contentService.validate(data));
    }
  };

  const handlePublish = async () => {
    if (!jsonData || errors.length || publishing) return;

    const existsPublic = !!publicLibrary.getTemaContent(
      jsonData.asignaturaId,
      jsonData.temaId
    );

    if (existsPublic && !overwriteConfirm) {
      setOverwriteConfirm(true);
      return;
    }

    setPublishing(true);

    try {
      const result = await localAdminService.publicarTema(jsonData);
      setStatus({ type: 'success', content: jsonData, result });
      setJsonData(null);
      setOverwriteConfirm(false);
    } catch (e) {
      setStatus({ type: 'error', msg: e.message });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="mgmt-page">
      <div className="mgmt-breadcrumb">
        <Link to="/gestion">Administración</Link>
        <span> / </span>
        <span>Importar tema</span>
      </div>

      <div className="mgmt-header">
        <div>
          <h1>⬆ Importar tema</h1>
          <p className="mgmt-subtitle">
            Importa un JSON generado con Claude y publícalo directamente en la biblioteca local.
          </p>
        </div>
      </div>

      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Estructura del JSON</h3>

        <div className="import-schema">
          <pre>{`{
  "asignaturaId": "casi",          // uno de: ${subjects.map(s => s.id).join(', ')}
  "temaId": "tema-2",              // patrón: tema-N  (ej: tema-2, tema-10)
  "titulo": "Tema 2. Nombre del tema",
  "apuntes": { "introduccion": "", "secciones": [] },
  "resumen": [],
  "conceptosClave": [],
  "flashcards": []
}`}</pre>
        </div>

        <details className="mgmt-json-example">
          <summary>Ver ejemplo mínimo de JSON válido</summary>

          <div className="import-schema">
            <pre>{`{
  "asignaturaId": "casi",
  "temaId": "tema-1",
  "titulo": "Tema 1. Introducción",
  "apuntes": {
    "introduccion": "Texto introductorio del tema.",
    "secciones": [
      {
        "titulo": "Concepto principal",
        "contenido": "Contenido explicado del apartado."
      }
    ]
  },
  "resumen": [
    "Idea clave del tema."
  ],
  "conceptosClave": [
    {
      "termino": "Concepto",
      "definicion": "Definición breve."
    }
  ],
  "flashcards": [
    {
      "pregunta": "Pregunta de repaso",
      "respuesta": "Respuesta esperada"
    }
  ]
}`}</pre>
          </div>
        </details>
      </div>

      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Seleccionar archivo</h3>

        <FileUploader
          onData={handleData}
          label="Seleccionar JSON de contenido"
          hint="Archivo generado con Claude"
        />

        {errors.length > 0 && (
          <div className="import-error-block">
            <div className="import-error-block-header">
              ⚠ Se han encontrado {errors.length} error{errors.length !== 1 ? 'es' : ''} en el JSON
            </div>

            {errors.slice(0, 12).map((e, i) => (
              <div key={i} className="import-error-item">
                {e}
              </div>
            ))}

            {errors.length > 12 && (
              <div className="import-error-more">
                … y {errors.length - 12} error{errors.length - 12 !== 1 ? 'es' : ''} más.
              </div>
            )}
          </div>
        )}
      </div>

      {jsonData && errors.length === 0 && (
        <div className="mgmt-section">
          <h3 className="mgmt-section-title">Vista previa del contenido</h3>
          <ContentPreview data={jsonData} type="content" />
          <InlineTopicPreview content={jsonData} />
        </div>
      )}

      {overwriteConfirm && (
        <div
          className="import-status"
          style={{
            background: 'var(--warning-soft)',
            color: 'var(--warning)',
            border: '1px solid var(--warning)',
          }}
        >
          <p>
            <strong>Este tema ya existe en la biblioteca pública local.</strong>
          </p>

          <p style={{ marginTop: 4 }}>
            Si continúas, se reemplazará el archivo actual:
            <br />
            <code style={{ fontSize: 12 }}>
              src/data/public/{jsonData?.asignaturaId}/temas/{jsonData?.temaId}-contenido.json
            </code>
          </p>

          <p style={{ marginTop: 8, fontSize: 13 }}>
            Pulsa de nuevo <em>Publicar en biblioteca local</em> para confirmar el reemplazo.
          </p>
        </div>
      )}

      {status?.type === 'success' && (
        <div className="import-status success">
          <p style={{ fontWeight: 600 }}>
            ✓ Tema {status.result.existed ? 'actualizado' : 'publicado'} en la biblioteca local del proyecto.
          </p>

          <p className="import-pub-path" style={{ marginTop: 8 }}>
            Archivo {status.result.existed ? 'actualizado' : 'creado'}:
            <br />
            <code>{status.result.path}</code>
          </p>

          {!status.result.existed ? (
            <div className="import-hmr-notice">
              <strong>Reinicia el servidor de desarrollo</strong> para que el nuevo tema aparezca en la biblioteca pública.
              En la terminal: <code>Ctrl+C</code> y luego <code>npm run dev</code>.
            </div>
          ) : (
            <div className="import-hmr-notice">
              Recarga la página para ver los cambios aplicados.
            </div>
          )}

          <div className="import-pub-steps" style={{ marginTop: 12 }}>
            <strong>Para publicarlo para tus compañeros:</strong>

            <ol>
              <li>Ejecuta <code>npm run build</code>.</li>
              <li>Haz commit de los cambios (<code>git add · git commit · git push</code>).</li>
              <li>Publica la nueva versión en GitHub Pages.</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {status.result.existed && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  navigate(`/asignatura/${status.content.asignaturaId}/tema/${status.content.temaId}`);
                  window.location.reload();
                }}
              >
                Ver tema publicado
              </button>
            )}

            <Link to="/gestion" className="btn btn-ghost btn-sm">
              Volver a Administración
            </Link>
          </div>
        </div>
      )}

      {status?.type === 'error' && (
        <div className="import-status error">✗ {status.msg}</div>
      )}

      {status?.type !== 'success' && jsonData && errors.length === 0 && (
        <div className="mgmt-save-bar" style={{ marginTop: 8 }}>
          <button
            type="button"
            className={`btn ${overwriteConfirm ? 'btn-danger-ghost' : 'btn-primary'}`}
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing
              ? 'Publicando…'
              : overwriteConfirm
              ? '⚠ Reemplazar contenido publicado'
              : 'Publicar en biblioteca local'}
          </button>

          <Link to="/gestion" className="btn btn-ghost">
            Volver
          </Link>
        </div>
      )}
    </div>
  );
}

function InlineTopicPreview({ content }) {
  if (!content) return null;

  const hasApuntes = content.apuntes?.introduccion || content.apuntes?.secciones?.length > 0;
  const hasResumen = content.resumen?.length > 0;
  const hasConceptos = content.conceptosClave?.length > 0;
  const hasFlashcards = content.flashcards?.length > 0;

  if (!hasApuntes && !hasResumen && !hasConceptos && !hasFlashcards) {
    return (
      <p className="empty-msg" style={{ marginTop: 10 }}>
        El JSON está vacío (sin contenido académico). Puedes publicarlo y añadir contenido después desde el editor.
      </p>
    );
  }

  return (
    <div className="inline-preview">
      {hasApuntes && (
        <div className="inline-preview-section">
          <h4>📖 Apuntes</h4>

          {content.apuntes.introduccion && (
            <p className="inline-preview-intro">
              {content.apuntes.introduccion.slice(0, 200)}
              {content.apuntes.introduccion.length > 200 ? '…' : ''}
            </p>
          )}

          {content.apuntes.secciones?.length > 0 && (
            <p className="inline-preview-meta">
              {content.apuntes.secciones.length} sección{content.apuntes.secciones.length > 1 ? 'es' : ''}:{' '}
              {content.apuntes.secciones.map(s => s.titulo).join(' · ')}
            </p>
          )}
        </div>
      )}

      {hasResumen && (
        <div className="inline-preview-section">
          <h4>⚡ Resumen</h4>

          <ul className="inline-preview-list">
            {content.resumen.slice(0, 3).map((r, i) => (
              <li key={i}>
                {r.slice(0, 100)}
                {r.length > 100 ? '…' : ''}
              </li>
            ))}

            {content.resumen.length > 3 && (
              <li style={{ color: 'var(--text-dim)' }}>
                … y {content.resumen.length - 3} puntos más
              </li>
            )}
          </ul>
        </div>
      )}

      {hasConceptos && (
        <div className="inline-preview-section">
          <h4>🔑 {content.conceptosClave.length} conceptos clave</h4>

          <p className="inline-preview-meta">
            {content.conceptosClave.slice(0, 5).map(c => c.termino).join(' · ')}
            {content.conceptosClave.length > 5 ? '…' : ''}
          </p>
        </div>
      )}

      {hasFlashcards && (
        <div className="inline-preview-section">
          <h4>🃏 {content.flashcards.length} flashcards</h4>

          <p className="inline-preview-meta">
            {content.flashcards[0]?.pregunta?.slice(0, 80)}
            {content.flashcards[0]?.pregunta?.length > 80 ? '…' : ''}
          </p>
        </div>
      )}
    </div>
  );
}