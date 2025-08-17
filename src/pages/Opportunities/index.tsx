import { useState } from "react";
import { useOpportunities } from "../../hooks/useOpportunities";
import { OpportunitiesTable } from "../../components/Opportunities";
import { EmptyState } from "../../ui/EmptyState";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { Target } from "lucide-react";
import { Opportunity } from "../../services/OpportunityService";

export function OpportunitiesPage() {
  const {
    filteredOpportunities,
    loading,
    error,
    updateOpportunity,
    removeOpportunity,
    getTotalValue,
    getWeightedValue,
  } = useOpportunities();
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  const handleOpportunityClick = (opportunityId: string) => {
    const opportunity =
      filteredOpportunities.find((o) => o.id === opportunityId) || null;
    setSelectedOpportunity(opportunity);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Erro ao carregar oportunidades
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Oportunidades</h2>
        <p className="text-gray-600 mt-2">
          Acompanhe suas oportunidades de negócio
        </p>
      </div>

      {filteredOpportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">
              Total de Oportunidades
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {filteredOpportunities.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(getTotalValue())}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">
              Valor Ponderado
            </h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(getWeightedValue())}
            </p>
          </div>
        </div>
      )}

      {filteredOpportunities.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhuma oportunidade criada"
          description="Converta seus leads qualificados em oportunidades para começar."
        />
      ) : (
        <div className="bg-white shadow rounded-lg">
          <OpportunitiesTable
            opportunities={filteredOpportunities}
            onOpportunityClick={handleOpportunityClick}
            selectedOpportunityId={selectedOpportunity?.id}
          />
        </div>
      )}
    </div>
  );
}
