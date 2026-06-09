import './ExamPartIntro.css';

export default function ExamPartIntro({ explicacion }) {
  if (!explicacion) return null;

  return (
    <section className="exam-part-intro">
      {explicacion.titulo && (
        <div className="exam-part-intro-title">{explicacion.titulo}</div>
      )}
      {explicacion.resumen && (
        <p className="exam-part-intro-resumen">{explicacion.resumen}</p>
      )}
      {explicacion.instrucciones?.length > 0 && (
        <ul className="exam-part-intro-list">
          {explicacion.instrucciones.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
