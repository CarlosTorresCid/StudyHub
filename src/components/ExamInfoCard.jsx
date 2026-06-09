import './ExamInfoCard.css';

export default function ExamInfoCard({ info }) {
  if (!info) return null;

  return (
    <section className="exam-info-card">
      {info.estructura?.length > 0 && (
        <div className="exam-info-block">
          <div className="exam-info-title">
            <span>🧩</span>
            <strong>Estructura</strong>
          </div>
          <ul className="exam-info-list">
            {info.estructura.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {info.penalizacionTest && (
        <div className="exam-info-block">
          <div className="exam-info-title">
            <span>⚠️</span>
            <strong>Penalización tipo test</strong>
          </div>
          <p className="exam-info-text">{info.penalizacionTest}</p>
        </div>
      )}

      {info.funcionamientoGeneral?.length > 0 && (
        <div className="exam-info-block">
          <div className="exam-info-title">
            <span>💡</span>
            <strong>Cómo funciona el examen</strong>
          </div>
          <ul className="exam-info-list">
            {info.funcionamientoGeneral.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}