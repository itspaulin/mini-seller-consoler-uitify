import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../../ui/Layout/Layout";
import { Dashboard } from "../../pages/Dashboard";
import { LeadsPage } from "../../pages/Leads";
import { OpportunitiesPage } from "../../pages/Opportunities";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
