import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import { questionService } from '../services/questionService';
import { examService } from '../services/examService';
import { progressService } from '../services/progressService';
import FlashcardsTab from '../components/FlashcardsTab';
import TestTab from '../components/TestTab';
import QuestionFilter from '../components/QuestionFilter';
import './TopicPage.css';

const TABS = [
  { id: 'apuntes', label: '📖 Apuntes' },
  { id: 'resumen', label: '⚡ Resumen' },
  { id: 'conceptos', label: '🔑 Conceptos' },
  { id: 'flashcards', label: '🃏 Flashcards' },
  { id: 'preguntas', label: '❓ Preguntas' },
];

export default function TopicPage() {
  const { asignaturaId, temaId } = useParams();
  const [tab, setTab] = useState('apuntes');
  const [questionFilters, setQuestionFilters] = useState({ origen: '', parteExamenId: '', tipo: '' });

  const subject = publicLibrary.getSubject(asignaturaId);
  const tema = subject?.temas?.find(t => t.id === temaId);
  const content = publicLibrary.getTemaContent(asignaturaId, temaId);

  useEffect(() => {
    if (tema) progressService.marcarTemaVisto(asignaturaId, temaId);
  }, [asignaturaId, temaId, tema]);

  if (!subject) return <div className="page-error">Asignatura no encontrada</div>;
  if (!tema) return (
    <div className="page-error" style={{ flexDirection: 'column', gap: 12 }}>
      <p>Este tema no está disponible todavía.</p>
      <Link to={`/asignatura/${asignaturaId}`} className="btn btn-ghost">← Volver a {subject.abreviatura}</Link>
    </div>
  );

  const bankQuestions = questionService.getByTema(asignaturaId, temaId);
  const bankFormatted = questionService.toTestTabFormat(bankQuestions);
  const applyFilter = (preguntas) => {
    if (!questionFilters.origen && !questionFilters.parteExamenId && !questionFilters.tipo) return preguntas;
    const filterList = (arr) => arr.filter(q => {
      if (questionFilters.origen && q.origen !== questionFilters.origen) return false;
      if (questionFilters.parteExamenId && q.parteExamenId !== questionFilters.parteExamenId) return false;
      if (questionFilters.tipo && q._tipo !== questionFilters.tipo && q.tipo !== questionFilters.tipo) return false;
      return true;
    });
    return {
      test: filterList(preguntas.test || []),
      verdaderoFalso: filterList(preguntas.verdaderoFalso || []),
      desarrollo: filterList(preguntas.desarrollo || []),
      practicas: filterList(preguntas.practicas || []),
    };
  };

  const filteredPreguntas = applyFilter(bankFormatted);
  const totalPreguntas = Object.values(bankFormatted).reduce((s, arr) => s + arr.length, 0);
  const partes = examService.getEstructura(asignaturaId);
  const realCount = bankQuestions.filter(q => q.origen === 'examen_real').length;

  return (
    <div className="topic-page">
      <div className="topic-breadcrumb">
        <Link to={`/asignatura/${asignaturaId}`} style={{ color: subject.color }}>
          {subject.abreviatura}
        </Link>
        <span> / </span>
        <span>Tema {tema.numero}</span>
      </div>

      <div className="topic-header">
        <h1>Tema {tema.numero}. {tema.titulo}</h1>
        {tema.importanciaExamen && (
          <span className={`badge badge-${tema.importanciaExamen}`}>
            Importancia: {tema.importanciaExamen}
          </span>
        )}
      </div>

      <div className="topic-tabs">
        {TABS.map(t => {
          if (t.id === 'flashcards' && !content?.flashcards?.length) return null;
          if (t.id === 'preguntas' && !totalPreguntas) return null;
          return (
            <button key={t.id}
              className={`topic-tab ${tab === t.id ? 'active' : ''}`}
              style={{ '--subject-color': subject.color }}
              onClick={() => setTab(t.id)}>
              {t.label}
              {t.id === 'preguntas' && totalPreguntas > 0 && (
                <span className="topic-tab-count">{totalPreguntas}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="topic-content">
        {tab === 'apuntes' && (
          content?.apuntes
            ? <ApuntesTab apuntes={content.apuntes} />
            : <EmptyContent msg="Los apuntes de este tema todavía no están publicados." />
        )}
        {tab === 'resumen' && (
          content?.resumen?.length > 0
            ? <ResumenTab resumen={content.resumen} />
            : <EmptyContent msg="El resumen de este tema todavía no está publicado." />
        )}
        {tab === 'conceptos' && (
          content?.conceptosClave?.length > 0
            ? <ConceptosTab conceptos={content.conceptosClave} />
            : <EmptyContent msg="Los conceptos clave de este tema todavía no están publicados." />
        )}
        {tab === 'flashcards' && content?.flashcards?.length > 0 && (
          <FlashcardsTab flashcards={content.flashcards} />
        )}
        {tab === 'preguntas' && (
          <>
            {(bankQuestions.length > 0 || partes.length > 0) && (
              <div className="topic-q-header">
                {bankQuestions.length > 0 && (
                  <div className="topic-q-badges">
                    {realCount > 0 && <span className="badge-real">📝 {realCount} examen real</span>}
                    {bankQuestions.length - realCount > 0 && (
                      <span className="badge-ia">🤖 {bankQuestions.length - realCount} generadas</span>
                    )}
                  </div>
                )}
                <QuestionFilter filters={questionFilters} onChange={setQuestionFilters} partes={partes} />
              </div>
            )}
            <TestTab
              key={JSON.stringify(questionFilters)}
              preguntas={filteredPreguntas}
              asignaturaId={asignaturaId}
              temaId={temaId}
            />
          </>
        )}
      </div>
    </div>
  );
}

function EmptyContent({ msg }) {
  return (
    <div className="topic-empty-content"><p>{msg}</p></div>
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

function ResumenTab({ resumen }) {
  return (
    <ul className="resumen-list">
      {resumen.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function ConceptosTab({ conceptos }) {
  return (
    <div className="conceptos-grid">
      {conceptos.map((c, i) => (
        <div key={i} className="concepto-card">
          <div className="concepto-term">{c.termino}</div>
          <div className="concepto-def">{c.definicion}</div>
        </div>
      ))}
    </div>
  );
}
