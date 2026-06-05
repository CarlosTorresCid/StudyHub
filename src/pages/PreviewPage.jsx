import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { draftService } from '../services/draftService';
import { publicLibrary } from '../lib/publicLibrary';
import FlashcardsTab from '../components/FlashcardsTab';
import './TopicPage.css';
import './PreviewPage.css';

const TABS = [
  { id: 'apuntes', label: '📖 Apuntes' },
  { id: 'resumen', label: '⚡ Resumen' },
  { id: 'conceptos', label: '🔑 Conceptos' },
  { id: 'flashcards', label: '🃏 Flashcards' },
];

export default function PreviewPage() {
  const { asignaturaId, temaId } = useParams();
  const [tab, setTab] = useState('apuntes');

  const subject = publicLibrary.getSubject(asignaturaId);
  const content = draftService.getDraftContent(asignaturaId, temaId);
  const paths = draftService.getPublicationPaths(asignaturaId, temaId);

  if (!content) {
    return (
      <div className="mgmt-page">
        <div className="preview-banner draft">BORRADOR LOCAL</div>
        <div className="page-error" style={{ flexDirection: 'column', gap: 12 }}>
          <p>No hay borrador para <strong>{asignaturaId} / {temaId}</strong>.</p>
          <Link to="/gestion" className="btn btn-ghost">← Volver a Administración</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-page preview-wrapper">
      {/* Banner de borrador — siempre visible */}
      <div className="preview-banner draft">
        ⚠ BORRADOR LOCAL — Este contenido todavía no está publicado y no es visible para tus compañeros.
      </div>

      <div className="preview-actions">
        <Link to="/gestion" className="btn btn-ghost btn-sm">← Administración</Link>
        <button className="btn btn-primary btn-sm"
          onClick={() => draftService.exportContent(asignaturaId, temaId)}>
          ⬇ Exportar JSON
        </button>
      </div>

      <div className="preview-paths">
        <span>📂 Para publicar: exporta el JSON y guárdalo en <code>{paths.contenido}</code></span>
        <span style={{ fontSize: 11 }}>No es necesario editar <code>configuracion.json</code>. El tema aparecerá automáticamente tras el build.</span>
      </div>

      <div className="topic-breadcrumb">
        <span style={{ color: subject?.color }}>{subject?.abreviatura || asignaturaId}</span>
        <span> / </span>
        <span>{content.temaId}</span>
      </div>

      <div className="topic-header">
        <h1>{content.titulo}</h1>
      </div>

      <div className="topic-tabs">
        {TABS.map(t => {
          if (t.id === 'flashcards' && !content?.flashcards?.length) return null;
          return (
            <button key={t.id}
              className={`topic-tab ${tab === t.id ? 'active' : ''}`}
              style={{ '--subject-color': subject?.color || 'var(--accent)' }}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="topic-content">
        {tab === 'apuntes' && (
          content.apuntes
            ? <ApuntesTab apuntes={content.apuntes} />
            : <p className="empty-msg">Sin apuntes en este borrador.</p>
        )}
        {tab === 'resumen' && (
          content.resumen?.length > 0
            ? <ul className="resumen-list">{content.resumen.map((r, i) => <li key={i}>{r}</li>)}</ul>
            : <p className="empty-msg">Sin resumen en este borrador.</p>
        )}
        {tab === 'conceptos' && (
          content.conceptosClave?.length > 0
            ? <div className="conceptos-grid">
                {content.conceptosClave.map((c, i) => (
                  <div key={i} className="concepto-card">
                    <div className="concepto-term">{c.termino}</div>
                    <div className="concepto-def">{c.definicion}</div>
                  </div>
                ))}
              </div>
            : <p className="empty-msg">Sin conceptos en este borrador.</p>
        )}
        {tab === 'flashcards' && content.flashcards?.length > 0 && (
          <FlashcardsTab flashcards={content.flashcards} />
        )}
      </div>
    </div>
  );
}

function ApuntesTab({ apuntes }) {
  return (
    <div className="apuntes">
      {apuntes.introduccion && <p className="apuntes-intro">{apuntes.introduccion}</p>}
      {apuntes.secciones?.map((sec, i) => (
        <div key={i} className="apuntes-section">
          <h3>{sec.titulo}</h3>
          <div className="apuntes-content">{renderContent(sec.contenido)}</div>
        </div>
      ))}
    </div>
  );
}

function renderContent(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const html = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    if (line.startsWith('- '))
      return <li key={i} dangerouslySetInnerHTML={{ __html: html.slice(2) }} />;
    return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}
