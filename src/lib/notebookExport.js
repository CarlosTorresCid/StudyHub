// src/lib/notebookExport.js
//
// Genera y descarga notebooks Jupyter (.ipynb) reales a partir de una lista
// de celdas { type: 'markdown' | 'code', source }. El archivo resultante es
// autocontenido y puede abrirse en Jupyter Notebook/JupyterLab fuera de
// StudyHub.

const NOTEBOOK_METADATA = {
  kernelspec: {
    display_name: 'Python 3',
    language: 'python',
    name: 'python3',
  },
  language_info: {
    name: 'python',
    version: '3.x',
  },
};

// nbformat espera `source` como array de líneas, cada una terminada en '\n'
// salvo (opcionalmente) la última.
function toSourceLines(text) {
  const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n');
  return lines.map((line, index) => (index < lines.length - 1 ? `${line}\n` : line));
}

function buildCell({ type, source }) {
  if (type === 'markdown') {
    return {
      cell_type: 'markdown',
      metadata: {},
      source: toSourceLines(source),
    };
  }

  return {
    cell_type: 'code',
    execution_count: null,
    metadata: {},
    outputs: [],
    source: toSourceLines(source),
  };
}

// Construye el JSON nbformat a partir de una lista de celdas.
export function createIpynbFromCells(cells = []) {
  return {
    cells: cells.map(buildCell),
    metadata: NOTEBOOK_METADATA,
    nbformat: 4,
    nbformat_minor: 5,
  };
}

// Genera el .ipynb a partir de las celdas y lanza la descarga en el navegador.
export function downloadIpynb({ cells, filename }) {
  const notebook = createIpynbFromCells(cells);

  const blob = new Blob([JSON.stringify(notebook, null, 2)], {
    type: 'application/x-ipynb+json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
