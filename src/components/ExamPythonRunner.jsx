import { useEffect, useMemo, useState } from 'react';
import { loadPyodide } from 'pyodide';
import './ExamPythonRunner.css';

// ── Singletons globales ───────────────────────────────────────────────────────
let pyodideInstancePromise = null;
let envReadyPromise = null;

async function getPyodideInstance() {
  if (!pyodideInstancePromise) {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    pyodideInstancePromise = loadPyodide({ indexURL: `${cleanBase}pyodide/` });
  }
  return pyodideInstancePromise;
}

// ── Salida con saltos de línea correctos ──────────────────────────────────────
function appendOutput(setOutput, text) {
  setOutput(prev => {
    const normalized = String(text ?? '');
    if (!normalized) return prev;
    const tail = normalized.endsWith('\n') ? '' : '\n';
    return `${prev}${normalized}${tail}`;
  });
}

// ── Nombre de archivo seguro ──────────────────────────────────────────────────
function safeFileName(name = 'dataset.csv') {
  return String(name)
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_');
}

// ── Código inicial limpio ─────────────────────────────────────────────────────
function getDefaultCode(question) {
  const enunciado = question?.enunciado;
  const commentLine = enunciado
    ? `# Pregunta: ${enunciado.slice(0, 120).replace(/\n/g, ' ')}${enunciado.length > 120 ? '…' : ''}\n\n`
    : '';
  return `${commentLine}print(df.head())
`;
}

// ── Fetch CSV con fallback ────────────────────────────────────────────────────
async function fetchCsvText(resource) {
  const candidates = [
    resource.url,
    resource.path ? `/${resource.path}` : null,
  ].filter(Boolean);

  let lastError = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return { text: await res.text(), url };
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(
    `No se pudo cargar el CSV. Último error: ${lastError?.message || 'desconocido'}`
  );
}

// ── Estado del indicador ──────────────────────────────────────────────────────
const STATUS = {
  idle:    { label: 'Listo',            cls: 'nb-dot--idle' },
  loading: { label: 'Cargando…',        cls: 'nb-dot--loading' },
  running: { label: 'Ejecutando…',      cls: 'nb-dot--running' },
  done:    { label: 'Completado',       cls: 'nb-dot--done' },
  error:   { label: 'Error',            cls: 'nb-dot--error' },
};

// ── Componente ────────────────────────────────────────────────────────────────
export default function ExamPythonRunner({
  resources = [],
  target = '',
  question = null,
  compact = false,
  initialCodeOverride = null,
  largeLayout = false,
}) {
  const primaryCsv = resources?.[0] || null;

  const initialCode = useMemo(
    () => initialCodeOverride ?? getDefaultCode(question),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question?.id, initialCodeOverride]
  );

  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle');
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(!compact);

  // Si cambia el modelo/pregunta (y por tanto el código inicial), actualizamos
  // la celda y limpiamos la salida de la ejecución anterior.
  useEffect(() => {
    setCode(initialCode);
    setOutput('');
    setStatus('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const canRun =
    !!primaryCsv?.url &&
    code.trim().length > 0 &&
    status !== 'loading' &&
    status !== 'running';

  const st = STATUS[status] || STATUS.idle;

  // ── Ejecución ───────────────────────────────────────────────────────────────
  async function handleRun() {
    if (!primaryCsv) return;
    try {
      setOutput('');
      setStatus('loading');

      const pyodide = await getPyodideInstance();

      pyodide.setStdout({ batched: text => appendOutput(setOutput, text) });
      pyodide.setStderr({ batched: text => appendOutput(setOutput, text) });

      // Carga de paquetes e imports: solo una vez, global
      if (!envReadyPromise) {
        appendOutput(setOutput, 'Cargando paquetes…\n');
        envReadyPromise = (async () => {
          await pyodide.loadPackage([
            'numpy',
            'pandas',
            'scipy',
            'scikit-learn',
            'joblib',
            'threadpoolctl',
          ]);
          await pyodide.runPythonAsync(`
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report
print("Paquetes cargados correctamente.")
`);
        })();
      }

      await envReadyPromise;
      setIsReady(true);

      // CSV → siempre se recarga para tener df limpio
      appendOutput(setOutput, `Cargando CSV: ${primaryCsv.nombre}\n`);
      const { text, url } = await fetchCsvText(primaryCsv);
      const filename = safeFileName(primaryCsv.nombre);
      const virtualPath = `/tmp/${filename}`;

      pyodide.FS.mkdirTree('/tmp');
      pyodide.FS.writeFile(virtualPath, text, { encoding: 'utf8' });

      pyodide.globals.set('csv_path', virtualPath);
      pyodide.globals.set('csv_url', url);
      pyodide.globals.set('csv_name', primaryCsv.nombre);
      pyodide.globals.set('target', target || '');

      await pyodide.runPythonAsync(`
import pandas as pd
df = pd.read_csv(csv_path)
print("CSV cargado correctamente como df.")
print("Archivo:", csv_name)
print("Ruta virtual:", csv_path)
print("Filas y columnas:", df.shape)
`);

      setStatus('running');
      appendOutput(setOutput, '\nEjecutando código…\n\n');

      await pyodide.runPythonAsync(code);

      setStatus('done');
    } catch (err) {
      setStatus('error');
      appendOutput(setOutput, `\nERROR:\n${err.message || String(err)}\n`);
    }
  }

  function resetCell() {
    setCode(initialCode);
    setOutput('');
    setStatus('idle');
  }

  // ── Modo compacto cerrado ───────────────────────────────────────────────────
  if (compact && !isOpen) {
    return (
      <section className="exam-python-runner exam-python-runner--compact">
        <button
          type="button"
          className="exam-python-toggle"
          onClick={() => setIsOpen(true)}
        >
          🐍 Resolver con Python
        </button>
      </section>
    );
  }

  // ── Celda abierta ───────────────────────────────────────────────────────────
  return (
    <section className={`exam-python-runner nb-cell${compact ? ' exam-python-runner--compact-open' : ''}${largeLayout ? ' exam-python-runner--large' : ''}`}>

      {/* Barra superior de la celda */}
      <div className="nb-cell-bar">
        <div className="nb-cell-info">
          <span className="nb-cell-lang">🐍 Python</span>
          {primaryCsv && (
            <span className="nb-cell-env">
              CSV: <strong>{primaryCsv.nombre}</strong>
              {' · '}df disponible
              {target && <> · target: <strong>{target}</strong></>}
              {' · '}pd, np, sklearn
            </span>
          )}
        </div>

        <div className="exam-python-header-actions">
          <span className="nb-status-badge">
            <span className={`nb-dot ${st.cls}`} />
            {st.label}
          </span>

          {compact && (
            <button
              type="button"
              className="exam-python-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Área de entrada */}
      <div className="nb-input-area">
        <div className="nb-gutter nb-gutter--in">In</div>
        <textarea
          className="nb-editor"
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Fila de botones */}
      <div className="nb-run-row">
        <button
          type="button"
          className="nb-run-btn"
          onClick={handleRun}
          disabled={!canRun}
        >
          ▶ Ejecutar
        </button>

        <button
          type="button"
          className="nb-reset-btn"
          onClick={resetCell}
        >
          ↺ Reiniciar celda
        </button>

        {!isReady && (
          <span className="nb-hint">
            La primera ejecución puede tardar unos segundos.
          </span>
        )}
      </div>

      {/* Área de salida */}
      {output && (
        <div className="nb-output-area">
          <div className="nb-gutter nb-gutter--out">Out</div>
          <pre className="nb-output">{output}</pre>
        </div>
      )}

    </section>
  );
}
