import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/unauthorized", element: _jsx(Unauthorized, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/tasks", element: _jsx(ProtectedRoute, { children: _jsx(Tasks, {}) }) }), _jsx(Route, { path: "/projects", element: _jsx(ProtectedRoute, { allowedRoles: ['team_lead', 'manager', 'project_manager', 'delivery_manager', 'client_manager', 'admin'], children: _jsx(Projects, {}) }) }), _jsx(Route, { path: "/teams", element: _jsx(ProtectedRoute, { allowedRoles: ['team_lead', 'manager', 'project_manager', 'delivery_manager', 'admin'], children: _jsx(Teams, {}) }) }), _jsx(Route, { path: "/sow", element: _jsx(ProtectedRoute, { allowedRoles: ['manager', 'project_manager', 'delivery_manager', 'client_manager', 'admin'], children: _jsx(SOW, {}) }) }), _jsx(Route, { path: "/leaves", element: _jsx(ProtectedRoute, { children: _jsx(Leaves, {}) }) }), _jsx(Route, { path: "/time-logs", element: _jsx(ProtectedRoute, { children: _jsx(TimeLogs, {}) }) }), _jsx(Route, { path: "/users", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(Users, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
export default App;
