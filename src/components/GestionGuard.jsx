import { Navigate } from 'react-router-dom';

// Protege las subrutas /gestion/* de dos formas:
// 1. En producción: redirige siempre a /gestion (que muestra mensaje de solo lectura).
// 2. En desarrollo: exige PIN activo en sessionStorage.
export default function GestionGuard({ children }) {
  if (!import.meta.env.DEV) {
    return <Navigate to="/gestion" replace />;
  }
  if (sessionStorage.getItem('studyhub_mgmt') !== '1') {
    return <Navigate to="/gestion" replace />;
  }
  return children;
}
