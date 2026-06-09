import { NavLink, Link, useParams } from 'react-router-dom';
import asignaturas from '../data/public/asignaturas.json';
import './Sidebar.css';

// La lista de asignaturas es estática: siempre las 6 del repositorio.
// No se necesita estado reactivo porque la lista nunca cambia en runtime.
export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { asignaturaId } = useParams();

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú">×</button>

      <Link to="/" className="sidebar-logo" onClick={onClose} aria-label="Ir al inicio">
        <span className="sidebar-logo-icon">📚</span>
        <span className="sidebar-logo-text">StudyHub</span>
      </Link>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar-home ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <span>🏠</span> Inicio
        </NavLink>

        <div className="sidebar-section-title">Asignaturas</div>

        {asignaturas.map(a => (
          <NavLink
            key={a.id}
            to={`/asignatura/${a.id}`}
            className={({ isActive }) => `sidebar-item ${isActive || asignaturaId === a.id ? 'active' : ''}`}
            style={{ '--subject-color': a.color }}
            onClick={onClose}
          >
            <span className="sidebar-item-dot" />
            <span className="sidebar-item-label">
              <span className="sidebar-item-abrev">{a.abreviatura}</span>
              <span className="sidebar-item-nombre">{a.nombre}</span>
            </span>
          </NavLink>
        ))}

        {import.meta.env.DEV && (
          <>
            <div className="sidebar-section-title sidebar-section-spacer">Admin</div>
            <NavLink
              to="/gestion"
              className={({ isActive }) => `sidebar-home sidebar-mgmt ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span>🔒</span> Administración
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
