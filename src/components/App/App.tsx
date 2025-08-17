import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../../ui/Layout/Layout";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Leads from "../../pages/Leads/Leads";
import Opportunities from "../../pages/Opportunities/Opportunities";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/opportunities" element={<Opportunities />} />

          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
