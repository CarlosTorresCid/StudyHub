import { useState } from 'react';
import './FlashcardsTab.css';

export default function FlashcardsTab({ flashcards }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState([]);

  if (!flashcards?.length) return <p className="empty-msg">No hay flashcards para este tema.</p>;

  const card = flashcards[current];
  const progress = Math.round(((current) / flashcards.length) * 100);

  const next = () => {
    setFlipped(false);
    setTimeout(() => {
      if (current < flashcards.length - 1) setCurrent(c => c + 1);
      else setCurrent(0);
    }, 150);
  };

  const prev = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrent(c => Math.max(0, c - 1));
    }, 150);
  };

  const markDone = () => {
    if (!done.includes(current)) setDone([...done, current]);
    next();
  };

  return (
    <div className="flashcards">
      <div className="fc-progress-bar">
        <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="fc-counter">{current + 1} / {flashcards.length} · {done.length} completadas</div>

      <div className={`fc-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
        <div className="fc-card-inner">
          <div className="fc-front">
            <div className="fc-label">Pregunta</div>
            <div className="fc-text">{card.pregunta}</div>
            <div className="fc-hint">Toca para ver la respuesta</div>
          </div>
          <div className="fc-back">
            <div className="fc-label">Respuesta</div>
            <div className="fc-text">{card.respuesta}</div>
          </div>
        </div>
      </div>

      <div className="fc-actions">
        <button className="btn btn-ghost" onClick={prev} disabled={current === 0}>← Anterior</button>
        <button className="btn btn-ghost fc-done-btn" onClick={markDone}>✓ Sé esto</button>
        <button className="btn btn-ghost" onClick={next}>Siguiente →</button>
      </div>
    </div>
  );
}
