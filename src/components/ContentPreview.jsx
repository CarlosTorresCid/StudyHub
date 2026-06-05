import './ContentPreview.css';

export default function ContentPreview({ data, type = 'content' }) {
  if (!data) return null;

  if (type === 'questions') {
    const questions = Array.isArray(data) ? data : [];
    const byTipo = questions.reduce((acc, q) => {
      acc[q.tipo] = (acc[q.tipo] || 0) + 1;
      return acc;
    }, {});
    return (
      <div className="preview">
        <div className="preview-header">Vista previa — Preguntas detectadas</div>
        <div className="preview-stats">
          <span className="preview-stat"><strong>{questions.length}</strong> preguntas en total</span>
          {Object.entries(byTipo).map(([tipo, count]) => (
            <span key={tipo} className="preview-stat">{count} {tipo}</span>
          ))}
        </div>
        {questions.slice(0, 3).map((q, i) => (
          <div key={i} className="preview-question">
            <span className="preview-q-tipo">{q.tipo}</span>
            <span className="preview-q-text">{q.enunciado?.slice(0, 100)}{q.enunciado?.length > 100 ? '…' : ''}</span>
          </div>
        ))}
        {questions.length > 3 && (
          <p className="preview-more">… y {questions.length - 3} más</p>
        )}
      </div>
    );
  }

  return (
    <div className="preview">
      <div className="preview-header">Vista previa — Contenido detectado</div>
      <div className="preview-stats">
        {data.titulo && <span className="preview-stat"><strong>{data.titulo}</strong></span>}
        {data.apuntes?.secciones?.length > 0 && (
          <span className="preview-stat">📖 {data.apuntes.secciones.length} secciones de apuntes</span>
        )}
        {data.resumen?.length > 0 && (
          <span className="preview-stat">⚡ {data.resumen.length} puntos de resumen</span>
        )}
        {data.conceptosClave?.length > 0 && (
          <span className="preview-stat">🔑 {data.conceptosClave.length} conceptos clave</span>
        )}
        {data.flashcards?.length > 0 && (
          <span className="preview-stat">🃏 {data.flashcards.length} flashcards</span>
        )}
      </div>
      <div className="preview-meta">
        <span>Asignatura: <strong>{data.asignaturaId}</strong></span>
        <span>Tema: <strong>{data.temaId}</strong></span>
      </div>
    </div>
  );
}
