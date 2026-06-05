import { useState, useRef } from 'react';
import './FileUploader.css';

export default function FileUploader({ onData, label = 'Subir archivo JSON', hint }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');
  const inputRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setError('Solo se aceptan archivos .json');
      return;
    }
    setFilename(file.name);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        onData(parsed);
      } catch {
        setError('El archivo no contiene JSON válido');
      }
    };
    reader.readAsText(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const onFileChange = (e) => processFile(e.target.files[0]);

  const clear = () => {
    setFilename('');
    setError('');
    onData(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="file-uploader">
      <div
        className={`file-drop-zone ${dragging ? 'dragging' : ''} ${filename ? 'has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {filename ? (
          <div className="file-selected">
            <span className="file-icon">📄</span>
            <span className="file-name">{filename}</span>
            <button
              className="file-clear"
              onClick={(e) => { e.stopPropagation(); clear(); }}
              title="Quitar archivo"
            >×</button>
          </div>
        ) : (
          <div className="file-placeholder">
            <span className="file-upload-icon">⬆️</span>
            <span className="file-upload-label">{label}</span>
            <span className="file-upload-sub">Arrastra aquí o haz clic para seleccionar</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </div>
      {hint && <p className="file-hint">{hint}</p>}
      {error && <p className="file-error">⚠ {error}</p>}
    </div>
  );
}
