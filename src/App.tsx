import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Statistics from './pages/Statistics';
import ApiTest from './pages/ApiTest';
import Races from './pages/Races';
import RaceDetail from './pages/RaceDetail';
import Documentation from './pages/Documentation';

function AppRoutes() {
  const location = useLocation();

  // Extract page name from path
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/' || path === '/Dashboard') return 'Dashboard';
    if (path.startsWith('/RaceDetail')) return 'RaceDetail';
    return path.substring(1) || 'Dashboard';
  };

  const currentPageName = getPageName();

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Logs" element={<Logs />} />
        <Route path="/Statistics" element={<Statistics />} />
        <Route path="/ApiTest" element={<ApiTest />} />
        <Route path="/Races" element={<Races />} />
        <Route path="/RaceDetail" element={<RaceDetail />} />
        <Route path="/Documentation" element={<Documentation />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
