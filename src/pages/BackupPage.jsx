import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import './ManagementPage.css';

const USER_KEYS = ['studyhub_user_progress', 'studyhub_user_simulations'];
const ADMIN_KEYS = ['studyhub_admin_draft_contents', 'studyhub_admin_draft_questions'];

function loadKey(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function hasData(key) { return loadKey(key) !== null; }

function exportKeys(keys, filename) {
  const data = {};
  keys.forEach(k => { const v = loadKey(k); if (v !== null) data[k] = v; });
  if (!Object.keys(data).length) { alert('No hay datos para exportar.'); return; }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function importKeys(data, keys, onDone) {
  if (typeof data !== 'object' || Array.isArray(data)) { alert('Archivo no válido'); return; }
  const valid = keys.filter(k => data[k] !== undefined);
  if (!valid.length) { alert('El archivo no contiene claves reconocidas.'); return; }
  valid.forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
  onDone();
}

export default function BackupPage() {
  const [importUser, setImportUser] = useState(null);
  const [importAdmin, setImportAdmin] = useState(null);
  const [msg, setMsg] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mgmt-page">
      <div className="mgmt-breadcrumb">
        <Link to="/gestion">Administración</Link>
        <span> / </span>
        <span>Exportar / Backup</span>
      </div>
      <div className="mgmt-header">
        <div>
          <h1>💾 Exportar / Backup</h1>
          <p className="mgmt-subtitle">La biblioteca pública está versionada en Git. Aquí solo se gestiona el progreso personal y los borradores.</p>
        </div>
      </div>

      {/* Progreso personal */}
      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Progreso personal</h3>
        <p className="backup-desc">Tests realizados, simulacros, temas vistos y preguntas falladas.</p>
        <div className="backup-keys-list">
          {USER_KEYS.map(k => (
            <li key={k} className={hasData(k) ? 'has-data' : 'no-data'}>
              {hasData(k) ? '✓' : '○'} {k}
            </li>
          ))}
        </div>
        <div className="backup-btn-row">
          <button className="btn btn-primary"
            onClick={() => exportKeys(USER_KEYS, `studyhub-progreso-${today}.json`)}>
            ⬇ Exportar progreso
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <FileUploader onData={setImportUser} label="Restaurar progreso" hint="Archivo exportado desde aquí" />
          {importUser && (
            <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}
              onClick={() => {
                if (!confirm('¿Restaurar progreso? El actual se sobreescribirá.')) return;
                importKeys(importUser, USER_KEYS, () => { setMsg('Progreso restaurado.'); setImportUser(null); });
              }}>
              ⬆ Restaurar
            </button>
          )}
        </div>
      </div>

      {/* Borradores admin */}
      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Borradores locales</h3>
        <p className="backup-desc">Contenidos y preguntas importados para probar antes de publicar.</p>
        <div className="backup-keys-list">
          {ADMIN_KEYS.map(k => (
            <li key={k} className={hasData(k) ? 'has-data' : 'no-data'}>
              {hasData(k) ? '✓' : '○'} {k}
            </li>
          ))}
        </div>
        <div className="backup-btn-row">
          <button className="btn btn-primary"
            onClick={() => exportKeys(ADMIN_KEYS, `studyhub-borradores-${today}.json`)}>
            ⬇ Exportar borradores
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <FileUploader onData={setImportAdmin} label="Restaurar borradores" hint="Archivo exportado desde aquí" />
          {importAdmin && (
            <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}
              onClick={() => {
                if (!confirm('¿Restaurar borradores? Los actuales se sobreescribirán.')) return;
                importKeys(importAdmin, ADMIN_KEYS, () => { setMsg('Borradores restaurados.'); setImportAdmin(null); });
              }}>
              ⬆ Restaurar
            </button>
          )}
        </div>
      </div>

      {/* Zona peligrosa */}
      <div className="mgmt-section">
        <h3 className="mgmt-section-title" style={{ color: 'var(--danger)' }}>Limpiar datos locales</h3>
        <p className="backup-desc">Solo afecta a tu navegador. La biblioteca pública en el repositorio no se modifica.</p>
        <div className="backup-btn-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <button className="btn btn-danger-ghost"
            onClick={() => {
              if (!confirm('¿Borrar tu progreso personal (tests, simulacros, temas vistos)?')) return;
              USER_KEYS.forEach(k => localStorage.removeItem(k));
              setMsg('Progreso personal borrado.');
            }}>
            🗑 Borrar mi progreso personal
          </button>
          <button className="btn btn-danger-ghost"
            onClick={() => {
              if (!confirm('¿Borrar todos los borradores locales de Gestión?')) return;
              ADMIN_KEYS.forEach(k => localStorage.removeItem(k));
              setMsg('Borradores borrados.');
            }}>
            🗑 Borrar borradores locales
          </button>
          <button className="btn btn-danger-ghost"
            onClick={() => {
              if (!confirm('⚠ ¿Borrar TODOS los datos locales? Esto también borra el flag de reset, lo que provocará una limpieza completa en la próxima recarga.')) return;
              Object.keys(localStorage).filter(k => k.startsWith('studyhub_')).forEach(k => localStorage.removeItem(k));
              sessionStorage.removeItem('studyhub_mgmt');
              setMsg('Todos los datos locales borrados. Recarga la página.');
            }}>
            🗑 Borrar todos los datos locales
          </button>
        </div>
      </div>

      {msg && <div className="import-status success">✓ {msg}</div>}

      <div className="mgmt-save-bar">
        <Link to="/gestion" className="btn btn-ghost">Volver</Link>
      </div>
    </div>
  );
}
