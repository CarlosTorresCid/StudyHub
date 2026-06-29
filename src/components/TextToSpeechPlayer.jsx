import { useState, useEffect, useCallback } from 'react';
import './TextToSpeechPlayer.css';

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

const RATES = [
  { value: 0.8, label: '0.8x' },
  { value: 1,   label: '1x'   },
  { value: 1.2, label: '1.2x' },
  { value: 1.5, label: '1.5x' },
  { value: 2,   label: '2x'   },
];

export default function TextToSpeechPlayer({ text, title = 'Leer tema' }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'playing' | 'paused'
  const [rate, setRate] = useState(1);

  // Detener al desmontar
  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, []);

  // Detener y resetear al cambiar de tema
  useEffect(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setStatus('idle');
    }
  }, [text]);

  const handlePlay = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');
    window.speechSynthesis.speak(utterance);
    setStatus('playing');
  }, [text, rate]);

  const handlePause = () => {
    window.speechSynthesis.pause();
    setStatus('paused');
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setStatus('playing');
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setStatus('idle');
  };

  if (!isSupported) {
    return <p className="tts-unsupported">Tu navegador no soporta lectura en voz alta.</p>;
  }

  return (
    <div className="tts-player">
      <div className="tts-controls">
        {status === 'idle' && (
          <button type="button" className="tts-button tts-play" onClick={handlePlay}>
            🔊 {title}
          </button>
        )}
        {status === 'playing' && (
          <>
            <button type="button" className="tts-button tts-pause" onClick={handlePause}>
              ⏸ Pausar
            </button>
            <button type="button" className="tts-button tts-stop" onClick={handleStop}>
              ⏹ Detener
            </button>
          </>
        )}
        {status === 'paused' && (
          <>
            <button type="button" className="tts-button tts-resume" onClick={handleResume}>
              ▶ Reanudar
            </button>
            <button type="button" className="tts-button tts-stop" onClick={handleStop}>
              ⏹ Detener
            </button>
          </>
        )}
        <select
          className="tts-rate-select"
          value={rate}
          onChange={e => setRate(Number(e.target.value))}
          aria-label="Velocidad de lectura"
        >
          {RATES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
