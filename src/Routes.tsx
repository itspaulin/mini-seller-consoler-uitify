import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../src/pages/Dashboard";
import { LeadsPage } from "../src/pages/Leads";
import { OpportunitiesPage } from "../src/pages/Opportunities";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leads" element={<LeadsPage />} />
      <Route path="/opportunities" element={<OpportunitiesPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
