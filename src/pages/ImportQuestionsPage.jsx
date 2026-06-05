import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { localAdminService } from '../services/localAdminService';
import { publicLibrary } from '../lib/publicLibrary';
import FileUploader from '../components/FileUploader';
import './ManagementPage.css';

const VALID_TIPOS = ['test', 'verdadero_falso', 'corta', 'desarrollo', 'practica'];
const VALID_ORIGENES = ['examen_real', 'modelo_examen', 'autoevaluacion', 'indicada_clase', 'recopilada', 'generada_ia'];

const TIPO_LABELS = {
  test: 'Test',
  verdadero_falso: 'Verdadero/Falso',
  corta: 'Respuesta corta',
  desarrollo: 'Desarrollo',
  practica: 'Práctica',
};

const ORIGEN_LABELS = {
  examen_real: 'Examen real',
  modelo_examen: 'Modelo de examen',
  autoevaluacion: 'Autoevaluación',
  indicada_clase: 'Indicada en clase',
  recopilada: 'Recopilada',
  generada_ia: 'Generada por IA',
};

function validateBanco(preguntas) {
  const errors = [];

  if (!preguntas.length) {
    errors.push('El banco está vacío (0 preguntas).');
    return errors;
  }

  const asigIds = new Set(preguntas.map(q => q.asignaturaId).filter(Boolean));
  if (asigIds.size > 1) {
    errors.push(`Las preguntas pertenecen a varias asignaturas: ${[...asigIds].join(', ')}. Todas deben tener el mismo asignaturaId.`);
  }

  preguntas.forEach((q, i) => {
    const label = `Pregunta ${i + 1}${q.id ? ` (${q.id})` : ''}`;
    const pErrors = [];

    if (!q.id) pErrors.push('falta id');
    if (!q.asignaturaId) pErrors.push('falta asignaturaId');
    if (!q.temaPrincipalId) pErrors.push('falta temaPrincipalId');
    if (!Array.isArray(q.temaIds)) pErrors.push('temaIds debe ser un array');
    if (!q.tipo) pErrors.push('falta tipo');
    else if (!VALID_TIPOS.includes(q.tipo)) pErrors.push(`tipo "${q.tipo}" no válido (acepta: ${VALID_TIPOS.join(', ')})`);
    if (!q.origen) pErrors.push('falta origen');
    else if (!VALID_ORIGENES.includes(q.origen)) pErrors.push(`origen "${q.origen}" no válido`);
    if (!q.enunciado) pErrors.push('falta enunciado');
    if (!Array.isArray(q.fuentes)) pErrors.push('fuentes debe ser un array');
    if (q.requiereRevision === undefined || q.requiereRevision === null) pErrors.push('falta requiereRevision');
    if (q.verificada === undefined || q.verificada === null) pErrors.push('falta verificada');

    if (q.tipo === 'test') {
      if (!Array.isArray(q.opciones) || q.opciones.length < 2)
        pErrors.push('test: opciones debe ser array con al menos 2 elementos');
      if (q.respuestaCorrecta !== null && typeof q.respuestaCorrecta !== 'number')
        pErrors.push('test: respuestaCorrecta debe ser número o null');
      if (typeof q.explicacion !== 'string')
        pErrors.push('test: explicacion debe ser string (puede estar vacía)');
    }

    if (q.tipo === 'verdadero_falso') {
      if (q.respuestaCorrecta !== null && typeof q.respuestaCorrecta !== 'boolean')
        pErrors.push('verdadero_falso: respuestaCorrecta debe ser booleano o null');
      if (typeof q.explicacion !== 'string')
        pErrors.push('verdadero_falso: explicacion debe ser string');
    }

    if (q.tipo === 'corta' || q.tipo === 'desarrollo') {
      if (typeof q.respuestaModelo !== 'string')
        pErrors.push(`${q.tipo}: respuestaModelo debe ser string (puede estar vacío)`);
      if (!Array.isArray(q.criteriosCorreccion))
        pErrors.push(`${q.tipo}: criteriosCorreccion debe ser array`);
    }

    if (q.tipo === 'practica') {
      if (typeof q.solucionOrientativa !== 'string')
        pErrors.push('practica: solucionOrientativa debe ser string (puede estar vacía)');
      if (!Array.isArray(q.criteriosCorreccion))
        pErrors.push('practica: criteriosCorreccion debe ser array');
    }

    if (pErrors.length) errors.push(`${label}: ${pErrors.join('; ')}`);
  });

  return errors;
}

function computeStats(preguntas) {
  const byTipo = {};
  const byOrigen = {};
  const byTema = {};
  let revisionCount = 0;
  let verificadasCount = 0;

  preguntas.forEach(q => {
    byTipo[q.tipo] = (byTipo[q.tipo] || 0) + 1;
    byOrigen[q.origen] = (byOrigen[q.origen] || 0) + 1;
    const tema = q.temaPrincipalId || '?';
    byTema[tema] = (byTema[tema] || 0) + 1;
    if (q.requiereRevision) revisionCount++;
    if (q.verificada) verificadasCount++;
  });

  return { byTipo, byOrigen, byTema, revisionCount, verificadasCount, total: preguntas.length };
}

export default function ImportQuestionsPage() {
  const [banco, setBanco] = useState(null);
  const [asignaturaId, setAsignaturaId] = useState(null);
  const [errores, setErrores] = useState([]);
  const [stats, setStats] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | preview | confirming | publishing | done
  const [publishResult, setPublishResult] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const publishedInSession = useRef(new Set());

  const available = localAdminService.isAvailable();

  const existingCount = useMemo(() => {
    if (!asignaturaId) return 0;
    return publicLibrary.getQuestions(asignaturaId).length;
  }, [asignaturaId]);

  const subjectLabel = useMemo(() => {
    if (!asignaturaId) return '';
    const s = publicLibrary.getSubjects().find(s => s.id === asignaturaId);
    return s ? s.abreviatura : asignaturaId.toUpperCase();
  }, [asignaturaId]);

  const handleFile = (data) => {
    setBanco(null);
    setAsignaturaId(null);
    setErrores([]);
    setStats(null);
    setPhase('idle');
    setPublishResult(null);
    setPublishError(null);

    if (!data) return;

    let preguntas;
    if (Array.isArray(data)) {
      preguntas = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.preguntas)) {
      preguntas = data.preguntas;
    } else {
      setErrores(['El archivo debe ser un array de preguntas o un objeto con el campo "preguntas".']);
      return;
    }

    const errs = validateBanco(preguntas);
    if (errs.length > 0) {
      setErrores(errs);
      return;
    }

    const asigId = preguntas[0]?.asignaturaId;
    setBanco(preguntas);
    setAsignaturaId(asigId);
    setStats(computeStats(preguntas));
    setPhase('preview');
  };

  const handlePublicarClick = () => {
    const needsConfirm = existingCount > 0 || publishedInSession.current.has(asignaturaId);
    if (needsConfirm) {
      setPhase('confirming');
    } else {
      doPublicar();
    }
  };

  const doPublicar = async () => {
    setPhase('publishing');
    setPublishError(null);
    try {
      const result = await localAdminService.publicarBancoPreguntas(asignaturaId, banco);
      publishedInSession.current.add(asignaturaId);
      setPublishResult(result);
      setPhase('done');
    } catch (e) {
      setPublishError(e.message);
      setPhase('preview');
    }
  };

  return (
    <div className="mgmt-page">
      <div className="mgmt-breadcrumb">
        <Link to="/gestion">Administración</Link>
        <span> / </span>
        <span>Publicar banco de preguntas</span>
      </div>

      <div className="mgmt-header">
        <div>
          <h1>Publicar banco de preguntas</h1>
          <p className="mgmt-subtitle">Importa un banco JSON y publícalo en la biblioteca local</p>
        </div>
      </div>

      {!available && (
        <div className="mgmt-draft-notice">
          <span className="mgmt-notice-icon">⚠</span>
          <span>La publicación de archivos solo está disponible durante el desarrollo local (<code>npm run dev</code>). En producción esta función no está disponible.</span>
        </div>
      )}

      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Subir banco de preguntas</h3>
        <p className="mgmt-section-desc">
          Acepta formato A (array directo) o formato B (objeto con campo <code>preguntas</code>).
          Ejemplo: <code>casi-banco-preguntas.json</code>
        </p>
        <FileUploader
          onData={handleFile}
          label="Subir JSON de banco de preguntas"
          hint="Array de preguntas o { asignaturaId, preguntas: [...] }"
        />
        {errores.length > 0 && (
          <div className="import-errors">
            {errores.slice(0, 10).map((e, i) => <p key={i} className="mgmt-error">⚠ {e}</p>)}
            {errores.length > 10 && <p className="mgmt-error">… y {errores.length - 10} errores más</p>}
          </div>
        )}
      </div>

      {phase !== 'idle' && stats && (
        <>
          <div className="mgmt-section">
            <h3 className="mgmt-section-title">Resumen del banco</h3>

            <div className="banco-preview-header">
              <span className="banco-asignatura-badge">{subjectLabel}</span>
              <span className="banco-total">{stats.total} preguntas</span>
            </div>

            <div className="banco-stats-grid">
              <div className="banco-stats-group">
                <div className="banco-stats-group-title">Por tipo</div>
                {VALID_TIPOS.map(tipo => (
                  <div key={tipo} className="banco-stats-row">
                    <span className="banco-stats-label">{TIPO_LABELS[tipo]}</span>
                    <span className="banco-stats-val">{stats.byTipo[tipo] || 0}</span>
                  </div>
                ))}
              </div>

              <div className="banco-stats-group">
                <div className="banco-stats-group-title">Por origen</div>
                {Object.entries(stats.byOrigen).map(([origen, count]) => (
                  <div key={origen} className="banco-stats-row">
                    <span className="banco-stats-label">{ORIGEN_LABELS[origen] || origen}</span>
                    <span className="banco-stats-val">{count}</span>
                  </div>
                ))}
              </div>

              <div className="banco-stats-group">
                <div className="banco-stats-group-title">Por tema principal</div>
                {Object.entries(stats.byTema)
                  .sort(([a], [b]) => {
                    const na = a.match(/^tema-(\d+)$/)?.[1];
                    const nb = b.match(/^tema-(\d+)$/)?.[1];
                    if (na && nb) return parseInt(na) - parseInt(nb);
                    return a.localeCompare(b);
                  })
                  .map(([tema, count]) => (
                    <div key={tema} className="banco-stats-row">
                      <span className="banco-stats-label">{tema}</span>
                      <span className="banco-stats-val">{count}</span>
                    </div>
                  ))}
              </div>

              <div className="banco-stats-group">
                <div className="banco-stats-group-title">Estado</div>
                <div className="banco-stats-row">
                  <span className="banco-stats-label">Requieren revisión</span>
                  <span className="banco-stats-val">{stats.revisionCount}</span>
                </div>
                <div className="banco-stats-row">
                  <span className="banco-stats-label">Verificadas</span>
                  <span className="banco-stats-val">{stats.verificadasCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mgmt-section">
            <h3 className="mgmt-section-title">
              Primeras {Math.min(10, banco.length)} preguntas
            </h3>
            <div className="banco-preview-table">
              {banco.slice(0, 10).map((q, i) => (
                <div key={i} className="banco-preview-row">
                  <span className="banco-preview-id">{q.id}</span>
                  <span className="qbank-tipo">{TIPO_LABELS[q.tipo] || q.tipo}</span>
                  <span className="banco-preview-tema">{q.temaPrincipalId}</span>
                  <span className="qbank-origen">{ORIGEN_LABELS[q.origen] || q.origen}</span>
                  <span className="banco-preview-enunciado">
                    {q.enunciado?.slice(0, 80)}{q.enunciado?.length > 80 ? '…' : ''}
                  </span>
                  {q.requiereRevision && <span className="banco-badge-revision">revisión</span>}
                  {q.verificada && <span className="banco-badge-verificada">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {phase === 'confirming' && (
        <div className="banco-confirm-warning">
          <p>
            Ya existe un banco de preguntas para <strong>{subjectLabel}</strong>.
            Si continúas, se reemplazará el archivo actual.
          </p>
          <div className="banco-confirm-actions">
            <button className="btn btn-primary" onClick={doPublicar}>
              Confirmar y reemplazar
            </button>
            <button className="btn btn-ghost" onClick={() => setPhase('preview')}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {publishError && (
        <div className="import-status error">✗ {publishError}</div>
      )}

      {phase === 'done' && publishResult && (
        <div className="import-status success">
          <p><strong>Banco de preguntas publicado en la biblioteca local.</strong></p>
          <div className="import-pub-path">
            Archivo actualizado:<br />
            <code>{publishResult.path}</code>
          </div>
          <div className="import-pub-steps">
            Para que tus compañeros vean las preguntas:
            <ol>
              <li>Ejecuta <code>npm run build</code>.</li>
              <li>Haz commit.</li>
              <li>Publica la nueva versión.</li>
            </ol>
          </div>
          {!publishResult.existed && (
            <div className="import-hmr-notice">
              Reinicia <code>npm run dev</code> para que el nuevo banco aparezca en la aplicación.
            </div>
          )}
        </div>
      )}

      <div className="mgmt-save-bar">
        {phase === 'preview' && available && (
          <button className="btn btn-primary" onClick={handlePublicarClick}>
            Publicar banco en biblioteca local
          </button>
        )}
        {phase === 'publishing' && (
          <button className="btn btn-primary" disabled>Publicando…</button>
        )}
        <Link to="/gestion" className="btn btn-ghost">Volver</Link>
      </div>
    </div>
  );
}
