import { useState } from "react";
import { useLeads } from "../../hooks/useLeads";
import { useOpportunities } from "../../hooks/useOpportunities";
import { useUrlParams } from "../../hooks/useUrlParams";
import { LeadsFilters } from "../../components/Leads/LeadsFilters";
import { LeadsTable } from "../../components/Leads/LeadsTable";
import { LeadDetailPanel } from "../../components/Leads/LeadDetailPanel";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { EmptyState } from "../../ui/EmptyState";
import { Users } from "lucide-react";
import { Lead } from "../../services/LeadsService";

export function LeadsPage() {
  const [urlParams, setUrlParams] = useUrlParams();
  const { leads, loading, error, updateLead, removeLead } = useLeads();
  const { addOpportunity } = useOpportunities();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        !urlParams.search ||
        lead.name.toLowerCase().includes(urlParams.search.toLowerCase()) ||
        lead.company.toLowerCase().includes(urlParams.search.toLowerCase());

      const matchesStatus =
        !urlParams.status || lead.status === urlParams.status;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const { sortBy, sortOrder } = urlParams;
      const modifier = sortOrder === "desc" ? -1 : 1;

      if (sortBy === "score") {
        return (a.score - b.score) * modifier;
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * modifier;
      }

      return 0;
    });

  const handleConvertLead = async (lead) => {
    try {
      await addOpportunity(lead);
      removeLead(lead.id);
      setSelectedLead(null);
    } catch (error) {
      console.error("Error converting lead:", error);
    }
  };

  const handleLeadClick = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId) || null;
    setSelectedLead(lead);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar leads</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Leads</h2>
        <p className="text-gray-600 mt-2">Gerencie e qualifique seus leads</p>
      </div>

      <LeadsFilters filters={urlParams} onFiltersChange={setUrlParams} />

      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum lead encontrado"
          description="Não encontramos leads que correspondam aos seus filtros."
        />
      ) : (
        <div className="bg-white shadow rounded-lg">
          <LeadsTable
            leads={filteredLeads}
            onLeadClick={handleLeadClick}
            selectedLeadId={selectedLead?.id}
          />
        </div>
      )}

      <LeadDetailPanel
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={updateLead}
        onConvert={handleConvertLead}
      />
    </div>
  );
}
