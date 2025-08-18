import { useState, useEffect } from "react";
import { useOpportunities } from "../../hooks/useOpportunities";
import { OpportunitiesTable } from "../../components/Opportunities";
import { EmptyState } from "../../ui/EmptyState";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { Target, RefreshCw } from "lucide-react";
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
    refreshOpportunities,
    stageFilter,
    setStageFilter,
    searchTerm,
    setSearchTerm,
  } = useOpportunities();

  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Força um refresh quando a página é visitada
  useEffect(() => {
    // Verifica se chegou de uma conversão recente (pode ser implementado via query params)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("refresh") === "true") {
      refreshOpportunities();
      // Remove o parâmetro da URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [refreshOpportunities]);

  const handleOpportunityClick = (opportunityId: string) => {
    const opportunity =
      filteredOpportunities.find((o) => o.id === opportunityId) || null;
    setSelectedOpportunity(opportunity);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOpportunities();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Erro ao carregar oportunidades
          </h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Oportunidades</h2>
          <p className="text-gray-600 mt-2">
            Acompanhe suas oportunidades de negócio
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {filteredOpportunities.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nome da oportunidade ou conta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Estágio
              </label>
              <select
                value={stageFilter}
                onChange={(e) =>
                  setStageFilter(e.target.value as Opportunity["stage"] | "")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os estágios</option>
                <option value="qualification">Qualificação</option>
                <option value="proposal">Proposta</option>
                <option value="negotiation">Negociação</option>
                <option value="closed-won">Fechada - Ganha</option>
                <option value="closed-lost">Fechada - Perdida</option>
              </select>
            </div>
          </div>
        </div>
      )}

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
          title="Nenhuma oportunidade encontrada"
          description={
            searchTerm || stageFilter
              ? "Tente ajustar os filtros ou criar uma nova oportunidade."
              : "Converta seus leads qualificados em oportunidades para começar."
          }
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
