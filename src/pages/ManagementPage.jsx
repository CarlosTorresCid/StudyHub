import { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import './ManagementPage.css';

const PIN = '1234';

// Mensaje de producción — la administración requiere entorno local
function ProductionMessage() {
  return (
    <div className="mgmt-production">
      <div className="mgmt-production-card">
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <h2>Administración no disponible</h2>
        <p>
          La administración de contenidos solo está disponible cuando StudyHub
          se ejecuta en local sobre el proyecto.
        </p>
        <p>La versión publicada es de solo lectura.</p>
        <Link to="/" className="btn btn-ghost" style={{ marginTop: 16 }}>← Volver al inicio</Link>
      </div>
    </div>
  );
}

export default function ManagementPage() {
  // En producción: mostrar mensaje sin PIN
  if (!import.meta.env.DEV) return <ProductionMessage />;

  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('studyhub_mgmt') === '1');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === PIN) {
      sessionStorage.setItem('studyhub_mgmt', '1');
      setUnlocked(true);
    } else {
      setPinError('PIN incorrecto');
      setPin('');
    }
  };

  if (!unlocked) {
    return (
      <div className="mgmt-lock">
        <div className="mgmt-lock-card">
          <div className="mgmt-lock-icon">🔒</div>
          <h2>Administración local</h2>
          <p>Introduce el PIN para acceder</p>
          <form onSubmit={handleUnlock} className="mgmt-lock-form">
            <input className="form-input" type="password" placeholder="PIN"
              value={pin} onChange={e => { setPin(e.target.value); setPinError(''); }} autoFocus />
            {pinError && <p className="mgmt-error">{pinError}</p>}
            <button className="btn btn-primary" type="submit">Acceder</button>
          </form>
        </div>
      </div>
    );
  }

  const subjects = publicLibrary.getSubjects();
  const totalTopics = subjects.reduce((s, sub) => s + sub.temas.length, 0);

  return (
    <div className="mgmt-page">
      <div className="mgmt-header">
        <div>
          <h1>⚙️ Administración local</h1>
          <p className="mgmt-subtitle">
            {totalTopics} tema{totalTopics !== 1 ? 's' : ''} publicado{totalTopics !== 1 ? 's' : ''} en la biblioteca local
          </p>
        </div>
      </div>

      <div className="mgmt-draft-notice">
        <span className="mgmt-notice-icon">💡</span>
        <span>
          Los cambios aquí solo afectan a tu copia local del proyecto.
          Para publicarlos para tus compañeros: <strong>git add · git commit · git push · deploy</strong>.
        </span>
      </div>

      <div className="mgmt-actions-bar">
        <Link to="/gestion/importar/tema" className="btn btn-primary">⬆ Importar tema</Link>
        <Link to="/gestion/importar/preguntas" className="btn btn-ghost">⬆ Importar preguntas</Link>
        <Link to="/gestion/banco-preguntas" className="btn btn-ghost">❓ Banco de preguntas</Link>
        <Link to="/gestion/biblioteca" className="btn btn-ghost">💾 Backup</Link>
      </div>

      <div className="mgmt-subjects">
        <h2>Temas publicados en la biblioteca local</h2>
        <div className="mgmt-subject-list">
          {subjects.map(subject => (
            <div key={subject.id} className="mgmt-subject-card"
              style={{ '--subject-color': subject.color }}>
              <div className="mgmt-subject-header">
                <span className="mgmt-subject-icon">{subject.icono}</span>
                <div>
                  <div className="mgmt-subject-abrev">{subject.abreviatura}</div>
                  <div className="mgmt-subject-name">{subject.nombre}</div>
                </div>
              </div>

              {subject.temas.length === 0 ? (
                <div className="mgmt-no-topics">
                  Sin temas publicados todavía.
                  <Link to="/gestion/importar/tema" className="mgmt-no-topics-link"> Importar →</Link>
                </div>
              ) : (
                <div className="mgmt-topic-list">
                  {subject.temas.map(tema => {
                    const filePath = `src/data/public/${subject.id}/temas/${tema.id}-contenido.json`;
                    return (
                      <div key={tema.id} className="mgmt-topic-row">
                        <div className="mgmt-topic-info">
                          <span className="mgmt-topic-id">{tema.id}</span>
                          <span className="mgmt-topic-title">{tema.titulo}</span>
                          <span className="mgmt-topic-path">{filePath}</span>
                        </div>
                        <div className="mgmt-topic-actions">
                          <Link to={`/asignatura/${subject.id}/tema/${tema.id}`}
                            className="btn btn-ghost btn-sm" target="_blank" rel="noopener">
                            Ver
                          </Link>
                          <Link to={`/gestion/editar/${subject.id}/${tema.id}`}
                            className="btn btn-primary btn-sm">
                            Editar
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
