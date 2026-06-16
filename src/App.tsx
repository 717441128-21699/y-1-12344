import { BrowserRouter as Router, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Alerts from './pages/Alerts';
import Approvals from './pages/Approvals';
import RouteManagement from './pages/Routes';
import Reports from './pages/Reports';
import Permissions from './pages/Permissions';

export default function App() {
  return (
    <Router>
      <RouterRoutes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/routes" element={<RouteManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/permissions" element={<Permissions />} />
        </Route>
      </RouterRoutes>
    </Router>
  );
}
