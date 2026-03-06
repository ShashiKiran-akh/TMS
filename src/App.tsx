import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Projects } from './pages/Projects';
import { Teams } from './pages/Teams';
import { SOW } from './pages/SOW';
import { Leaves } from './pages/Leaves';
import { TimeLogs } from './pages/TimeLogs';
import { Users } from './pages/Users';
import { Unauthorized } from './pages/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute allowedRoles={['team_lead', 'manager', 'project_manager', 'delivery_manager', 'client_manager', 'admin']}><Projects /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute allowedRoles={['team_lead', 'manager', 'project_manager', 'delivery_manager', 'admin']}><Teams /></ProtectedRoute>} />
          <Route path="/sow" element={<ProtectedRoute allowedRoles={['manager', 'project_manager', 'delivery_manager', 'client_manager', 'admin']}><SOW /></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute><Leaves /></ProtectedRoute>} />
          <Route path="/time-logs" element={<ProtectedRoute><TimeLogs /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
