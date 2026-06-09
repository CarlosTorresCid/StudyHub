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

const EMPTY_FILTERS = {
  origen: '',
  parteExamenId: '',
  tipo: '',
  searchText: '',
};

export default function QuestionFilter({ filters, onChange, partes = [] }) {
  const currentFilters = {
    ...EMPTY_FILTERS,
    ...filters,
  };

  const set = (key, value) => {
    onChange({
      ...currentFilters,
      [key]: value,
    });
  };

  const toggle = (key, value) => {
    const current = currentFilters[key];
    set(key, current === value ? '' : value);
  };

  const hasActiveFilters =
    currentFilters.origen ||
    currentFilters.parteExamenId ||
    currentFilters.tipo ||
    currentFilters.searchText;

  return (
    <div className="q-filter">
      <div className="q-filter-group">
        <span className="q-filter-label">Buscar</span>

        <input
          type="text"
          className="q-filter-input"
          placeholder="Buscar por palabra clave..."
          value={currentFilters.searchText}
          onChange={e => set('searchText', e.target.value)}
        />
      </div>

      <div className="q-filter-group">
        <span className="q-filter-label">Origen</span>

        <div className="q-filter-pills">
          {ORIGENES.map(o => (
            <button
              key={o.value}
              type="button"
              className={`q-filter-pill ${currentFilters.origen === o.value ? 'active' : ''}`}
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
                type="button"
                className={`q-filter-pill ${currentFilters.parteExamenId === p.id ? 'active' : ''}`}
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
              type="button"
              className={`q-filter-pill ${
                currentFilters.tipo === t.value || currentFilters.tipo === t.label ? 'active' : ''
              }`}
              onClick={() => toggle('tipo', t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="q-filter-clear"
          onClick={() => onChange(EMPTY_FILTERS)}
        >
          Limpiar filtros ×
        </button>
      )}
    </div>
  );
}