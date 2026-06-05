import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import GestionGuard from './components/GestionGuard';
import DashboardPage from './pages/DashboardPage';
import SubjectPage from './pages/SubjectPage';
import TopicPage from './pages/TopicPage';
import ExamSimulationPage from './pages/ExamSimulationPage';
import ExamResolvePage from './pages/ExamResolvePage';
import ManagementPage from './pages/ManagementPage';
import ImportContentPage from './pages/ImportContentPage';
import ImportQuestionsPage from './pages/ImportQuestionsPage';
import QuestionBankPage from './pages/QuestionBankPage';
import BackupPage from './pages/BackupPage';
import PreviewPage from './pages/PreviewPage';
import EditPage from './pages/EditPage';
import './index.css';
import './App.css';
import ExamPage from './pages/ExamPage'
import ExamPartPage from './pages/ExamPartPage'

// ─── Limpieza única de versión anterior ──────────────────────────────────────
(function performOneTimeReset() {
  if (localStorage.getItem('studyhub_public_v1_reset_done')) return;
  Object.keys(localStorage)
    .filter(k => k.startsWith('studyhub_'))
    .forEach(k => localStorage.removeItem(k));
  sessionStorage.removeItem('studyhub_mgmt');
  localStorage.setItem('studyhub_public_v1_reset_done', '1');
})();

const G = ({ children }) => <GestionGuard>{children}</GestionGuard>;

export default function App() {
  return (
    <HashRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            {/* Vista pública */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/asignatura/:asignaturaId" element={<SubjectPage />} />
            <Route path="/asignatura/:asignaturaId/tema/:temaId" element={<TopicPage />} />
            <Route path="/simulacro/:asignaturaId" element={<ExamSimulationPage />} />
            <Route path="/simulacro/:asignaturaId/resolver" element={<ExamResolvePage />} />

            {/* Administración local */}
            <Route path="/gestion" element={<ManagementPage />} />
            <Route path="/gestion/importar/tema" element={<G><ImportContentPage /></G>} />
            <Route path="/gestion/importar/preguntas" element={<G><ImportQuestionsPage /></G>} />
            <Route path="/gestion/banco-preguntas" element={<G><QuestionBankPage /></G>} />
            <Route path="/gestion/biblioteca" element={<G><BackupPage /></G>} />
            <Route path="/gestion/previsualizar/:asignaturaId/:temaId" element={<G><PreviewPage /></G>} />
            <Route path="/gestion/editar/:asignaturaId/:temaId" element={<G><EditPage /></G>} />
            <Route path="/asignatura/:asignaturaId/examen" element={<ExamPage />} />
            <Route path="/asignatura/:asignaturaId/examen/:parteId" element={<ExamPartPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
