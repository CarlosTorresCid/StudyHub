import { useMemo, useState } from 'react';
import ExamPythonRunner from './ExamPythonRunner';
import {
  getNotebookCodeForModel,
  getExportableNotebookCellsForModel,
  AAMD_NOTEBOOK_MODEL_CONFIG,
} from '../lib/examNotebookTemplates';
import { downloadIpynb } from '../lib/notebookExport';
import './ModelNotebookRunner.css';

// ── Notebook de resolución completa de un modelo de examen ────────────────────
export default function ModelNotebookRunner({
  asignaturaId,
  modeloId,
  resources = [],
  target = '',
}) {
  const [isOpen, setIsOpen] = useState(false);

  const code = useMemo(
    () => getNotebookCodeForModel({ asignaturaId, modeloId, target }),
    [asignaturaId, modeloId, target]
  );

  // Para los modelos de AAMD, AAMD_NOTEBOOK_MODEL_CONFIG es la fuente de
  // verdad del nombre del CSV principal (y de las predicciones, si las
  // hay). Esto evita depender del orden de `resources`, que en 'simulacro'
  // trae primero el CSV de predicciones.
  const modelConfig = asignaturaId === 'aamd' ? AAMD_NOTEBOOK_MODEL_CONFIG[modeloId] : null;

  const csvFilename =
    modelConfig?.csvFilename || resources?.[0]?.nombre || resources?.[0]?.filename || 'dataset.csv';
  const predictionsFilename = modelConfig?.predictionsFilename;

  const handleDownload = () => {
    const cells = getExportableNotebookCellsForModel({
      asignaturaId,
      modeloId,
      target,
      csvFilename,
    });

    downloadIpynb({
      cells,
      filename: `${asignaturaId}-${modeloId}-resolucion.ipynb`,
    });
  };

  return (
    <section className="model-notebook">
      <div className="model-notebook-intro">
        <h3 className="model-notebook-title">Notebook de resolución del modelo</h3>
        <p className="model-notebook-subtitle">
          Ejecuta el código completo para obtener las respuestas del test.
        </p>
      </div>

      <div className="model-notebook-actions">
        {!isOpen && (
          <button
            type="button"
            className="model-notebook-toggle"
            onClick={() => setIsOpen(true)}
          >
            🐍 Abrir notebook de resolución completa
          </button>
        )}

        <button
          type="button"
          className="model-notebook-download-btn"
          onClick={handleDownload}
          title={
            predictionsFilename
              ? `Descarga un notebook .ipynb autocontenido. Coloca también ${csvFilename} y ${predictionsFilename} en la misma carpeta.`
              : `Descarga un notebook .ipynb autocontenido. Coloca también ${csvFilename} en la misma carpeta.`
          }
        >
          ⬇ Descargar notebook .ipynb
        </button>
      </div>

      {isOpen && (
        <>
          <ExamPythonRunner
            resources={resources}
            target={target}
            initialCodeOverride={code}
            largeLayout
          />
          <button
            type="button"
            className="model-notebook-close"
            onClick={() => setIsOpen(false)}
          >
            Cerrar notebook
          </button>
        </>
      )}
    </section>
  );
}
