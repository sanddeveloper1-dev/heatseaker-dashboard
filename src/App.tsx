import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import Dashboard from '../Pages/Dashboard';
import Logs from '../Pages/Logs';
import Statistics from '../Pages/Statistics';
import ApiTest from '../Pages/ApiTest';
import Races from '../Pages/Races';
import RaceDetail from '../Pages/RaceDetail';
import Documentation from '../Pages/Documentation';

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  
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
