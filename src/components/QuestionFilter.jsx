import './QuestionFilter.css';

const ORIGENES = [
  { value: 'examen_real', label: '📝 Examen real' },
  { value: 'generada_ia', label: '🤖 Generada IA' },
  { value: 'recopiladas', label: '📚 Recopilada' },
];

const TIPOS = [
  { value: 'test', label: 'Test' },
  { value: 'vf', label: 'V/F' },
  { value: 'verdaderoFalso', label: 'V/F' },
  { value: 'desarrollo', label: 'Desarrollo' },
  { value: 'practicas', label: 'Prácticas' },
  { value: 'sql', label: 'SQL' },
];

export default function QuestionFilter({ filters, onChange, partes = [] }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  const toggle = (key, value) => {
    const current = filters[key];
    set(key, current === value ? '' : value);
  };

  return (
    <div className="q-filter">
      <div className="q-filter-group">
        <span className="q-filter-label">Origen</span>
        <div className="q-filter-pills">
          {ORIGENES.map(o => (
            <button
              key={o.value}
              className={`q-filter-pill ${filters.origen === o.value ? 'active' : ''}`}
              onClick={() => toggle('origen', o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {partes.length > 0 && (
        <div className="q-filter-group">
          <span className="q-filter-label">Parte del examen</span>
          <div className="q-filter-pills">
            {partes.map(p => (
              <button
                key={p.id}
                className={`q-filter-pill ${filters.parteExamenId === p.id ? 'active' : ''}`}
                onClick={() => toggle('parteExamenId', p.id)}
              >
                {p.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="q-filter-group">
        <span className="q-filter-label">Tipo</span>
        <div className="q-filter-pills">
          {[...new Map(TIPOS.map(t => [t.label, t])).values()].map(t => (
            <button
              key={t.value}
              className={`q-filter-pill ${filters.tipo === t.value || filters.tipo === t.label ? 'active' : ''}`}
              onClick={() => toggle('tipo', t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {(filters.origen || filters.parteExamenId || filters.tipo) && (
        <button
          className="q-filter-clear"
          onClick={() => onChange({ origen: '', parteExamenId: '', tipo: '' })}
        >
          Limpiar filtros ×
        </button>
      )}
    </div>
  );
}
