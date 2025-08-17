import { useOpportunities } from "../../hooks/useOpportunities";
import { OpportunitiesTable } from "../../components/opportunities/OpportunitiesTable";
import { EmptyState } from "../../ui/EmptyState";
import { Target } from "lucide-react";

export function OpportunitiesPage() {
  const { opportunities } = useOpportunities();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Oportunidades</h2>
        <p className="text-gray-600 mt-2">
          Acompanhe suas oportunidades de negócio
        </p>
      </div>

      {opportunities.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhuma oportunidade criada"
          description="Converta seus leads qualificados em oportunidades para começar."
        />
      ) : (
        <div className="bg-white shadow rounded-lg">
          <OpportunitiesTable opportunities={opportunities} />
        </div>
      )}
    </div>
  );
}
