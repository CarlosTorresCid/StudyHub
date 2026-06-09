import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { publicLibrary } from '../lib/publicLibrary';
import QuestionPracticeCard from '../components/QuestionPracticeCard';
import './ExamPartPage.css';

export default function ExamPartPage() {
  const { asignaturaId, parteId } = useParams();
  const subject = publicLibrary.getSubject(asignaturaId);
  const questions = publicLibrary.getQuestionBank(asignaturaId);

  // ── Hooks ──────────────────────────────────────────────
  const [selectedTema, setSelectedTema] = useState('todos');
  const [selectedGroup, setSelectedGroup] = useState('todos');
  const [selectedOrigen, setSelectedOrigen] = useState('todos');
  const [selectedRevision, setSelectedRevision] = useState('todos');
  const [searchText, setSearchText] = useState('');

  const examParts = useMemo(() => subject?.estructuraExamen || [], [subject]);
  const part = examParts.find(p => p.id === parteId) || { tipos: [] };

  const baseQuestions = useMemo(
    () => questions.filter(q => part.tipos.includes(q.tipo)),
    [questions, part]
  );

  const temaMap = useMemo(
    () => Object.fromEntries((subject.temas || []).map(t => [t.id, t])),
    [subject.temas]
  );

  const filteredQuestions = useMemo(
    () =>
      baseQuestions.filter(q => {
        // filtro por tema
        if (selectedTema !== 'todos') {
          const temas = q.temaIds?.length ? q.temaIds : [q.temaPrincipalId];
          if (!temas?.includes(selectedTema)) return false;
        }

        // filtro por grupo
        if (selectedGroup !== 'todos') {
          const grupo = q.grupoTematico || q.patronRelacionado || null;
          if (grupo !== selectedGroup) return false;
        }

        // filtro por origen
        if (selectedOrigen !== 'todos' && q.origen !== selectedOrigen) return false;

        // filtro por revisión
        if (selectedRevision === 'verificadas' && !q.verificada) return false;
        if (selectedRevision === 'pendientes' && q.verificada === true) return false;
        if (selectedRevision === 'revision' && !q.requiereRevision) return false;

        // filtro por palabra clave
        if (searchText?.trim()) {
          const search = searchText.toLowerCase().trim();
          const opcionesText = Array.isArray(q.opciones) ? q.opciones.join(' ') : '';
          const searchableText = [
            q.enunciado,
            q.respuesta,
            q.respuestaModelo,
            q.solucionOrientativa,
            q.explicacion,
            opcionesText,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          if (!searchableText.includes(search)) return false;
        }

        return true;
      }),
    [
      baseQuestions,
      selectedTema,
      selectedGroup,
      selectedOrigen,
      selectedRevision,
      searchText,
      part,
    ]
  );

  return (
    <div className="exam-part-page">
      <div className="exam-filters">
        <div className="exam-filters-row">
          {/* Buscador de palabras */}
          <input
            type="text"
            className="exam-filter-search"
            placeholder="Buscar palabra clave..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setSearchText(e.target.value); // refresca el filtro
              }
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // fuerza actualización del filtro
              setSearchText(searchText);
            }}
          >
            🔍 Buscar
          </button>

          {/* Select tema */}
          <select
            className="exam-filter-select"
            value={selectedTema}
            onChange={e => setSelectedTema(e.target.value)}
          >
            <option value="todos">Todos los temas</option>
            {subject.temas?.map(t => (
              <option key={t.id} value={t.id}>
                {t.titulo}
              </option>
            ))}
          </select>

          {/* Select origen */}
          <select
            className="exam-filter-select"
            value={selectedOrigen}
            onChange={e => setSelectedOrigen(e.target.value)}
          >
            <option value="todos">Todos los orígenes</option>
            <option value="examen_real">📝 Examen real</option>
            <option value="generada_ia">🤖 Generada IA</option>
            <option value="recopiladas">📚 Recopiladas</option>
          </select>

          {/* Select revisión */}
          <select
            className="exam-filter-select"
            value={selectedRevision}
            onChange={e => setSelectedRevision(e.target.value)}
          >
            <option value="todos">Todas</option>
            <option value="verificadas">Verificadas</option>
            <option value="pendientes">Pendientes</option>
            <option value="revision">Requiere revisión</option>
          </select>
        </div>
      </div>

      <div className="exam-part-list">
        {filteredQuestions.length === 0 ? (
          <div className="exam-filter-empty">
            <p>No hay preguntas con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredQuestions.map(q => (
            <QuestionPracticeCard key={q.id} question={q} />
          ))
        )}
      </div>

      <div className="exam-part-footer">
        <span className="exam-filter-count">
          {filteredQuestions.length} pregunta{filteredQuestions.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}