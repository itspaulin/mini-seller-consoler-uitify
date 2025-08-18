import { useState, useEffect } from "react";
import OpportunityService, {
  Opportunity,
  UpdateOpportunityData,
} from "../services/OpportunityService";
import { Lead } from "../services/LeadsService";

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<
    Opportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<Opportunity["stage"] | "">("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OpportunityService.getAll();
      setOpportunities(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar oportunidades"
      );
      console.error("Erro ao carregar oportunidades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...opportunities];

    if (stageFilter) {
      filtered = OpportunityService.filterByStage(filtered, stageFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (opp) =>
          opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.accountName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = OpportunityService.sortByCreatedDate(filtered, "desc");

    setFilteredOpportunities(filtered);
  }, [opportunities, stageFilter, searchTerm]);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const updateOpportunity = async (id: string, data: UpdateOpportunityData) => {
    try {
      const updatedOpportunity = await OpportunityService.update(id, data);
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? updatedOpportunity : opp))
      );
      return updatedOpportunity;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar oportunidade"
      );
      throw err;
    }
  };

  const removeOpportunity = async (id: string) => {
    try {
      await OpportunityService.delete(id);
      setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao remover oportunidade"
      );
      throw err;
    }
  };

  const createOpportunity = async (data: any) => {
    try {
      const newOpportunity = await OpportunityService.create(data);
      setOpportunities((prev) => [newOpportunity, ...prev]);
      return newOpportunity;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao criar oportunidade"
      );
      throw err;
    }
  };

  const addOpportunity = async (lead: Lead) => {
    try {
      const opportunityData = OpportunityService.createFromLead(lead);
      const newOpportunity = await OpportunityService.create(opportunityData);
      setOpportunities((prev) => [newOpportunity, ...prev]);
      return newOpportunity;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao converter lead em oportunidade"
      );
      throw err;
    }
  };

  const refreshOpportunities = () => {
    loadOpportunities();
  };

  const getTotalValue = () => {
    return OpportunityService.getTotalValue(filteredOpportunities);
  };

  const getWeightedValue = () => {
    return OpportunityService.getWeightedValue(filteredOpportunities);
  };

  const getStageStats = () => {
    const stats: Record<string, number> = {
      qualification: 0,
      proposal: 0,
      negotiation: 0,
      "closed-won": 0,
      "closed-lost": 0,
    };

    filteredOpportunities.forEach((opp) => {
      stats[opp.stage]++;
    });

    return stats;
  };

  const getConversionRate = (totalLeads: number) => {
    return OpportunityService.getConversionRate(
      totalLeads,
      opportunities.length
    );
  };

  return {
    opportunities,
    filteredOpportunities,
    loading,
    error,

    stageFilter,
    setStageFilter,
    searchTerm,
    setSearchTerm,

    updateOpportunity,
    removeOpportunity,
    createOpportunity,
    addOpportunity,
    refreshOpportunities,

    getTotalValue,
    getWeightedValue,
    getStageStats,
    getConversionRate,

    stageLabels: {
      qualification: "Qualificação",
      proposal: "Proposta",
      negotiation: "Negociação",
      "closed-won": "Fechada - Ganha",
      "closed-lost": "Fechada - Perdida",
    },
  };
}
