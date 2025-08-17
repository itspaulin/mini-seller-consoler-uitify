import { useState, useEffect, useCallback } from "react";
import OpportunitiesService, {
  Opportunity,
  CreateOpportunityData,
  UpdateOpportunityData,
} from "../services/OpportunityService";
import { Lead } from "../services/LeadsService";

interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  addOpportunity: (data: CreateOpportunityData) => Promise<Opportunity>;
  addOpportunityFromLead: (
    lead: Lead,
    additionalData?: Partial<CreateOpportunityData>
  ) => Promise<Opportunity>;
  updateOpportunity: (
    id: string,
    data: UpdateOpportunityData
  ) => Promise<Opportunity>;
  removeOpportunity: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  filteredOpportunities: Opportunity[];
  setFilters: (filters: OpportunityFilters) => void;
  filters: OpportunityFilters;
  getTotalValue: () => number;
  getWeightedValue: () => number;
}

interface OpportunityFilters {
  stage: Opportunity["stage"] | "";
  sortBy: "amount" | "createdDate";
  sortOrder: "asc" | "desc";
}

export function useOpportunities(): UseOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OpportunityFilters>({
    stage: "",
    sortBy: "createdDate",
    sortOrder: "desc",
  });

  const loadOpportunities = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await OpportunitiesService.getAll();
      setOpportunities(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addOpportunity = async (
    data: CreateOpportunityData
  ): Promise<Opportunity> => {
    try {
      const newOpportunity = await OpportunitiesService.create(data);
      setOpportunities((prev) => [newOpportunity, ...prev]);
      return newOpportunity;
    } catch (error) {
      throw error;
    }
  };

  const addOpportunityFromLead = async (
    lead: Lead,
    additionalData?: Partial<CreateOpportunityData>
  ): Promise<Opportunity> => {
    try {
      const opportunityData = OpportunitiesService.createFromLead(
        lead,
        additionalData
      );
      return await addOpportunity(opportunityData);
    } catch (error) {
      throw error;
    }
  };

  const updateOpportunity = async (
    id: string,
    data: UpdateOpportunityData
  ): Promise<Opportunity> => {
    try {
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? { ...opp, ...data } : opp))
      );

      const updatedOpportunity = await OpportunitiesService.update(id, data);

      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? updatedOpportunity : opp))
      );

      return updatedOpportunity;
    } catch (error) {
      await loadOpportunities();
      throw error;
    }
  };

  const removeOpportunity = async (id: string): Promise<void> => {
    try {
      setOpportunities((prev) => prev.filter((opp) => opp.id !== id));

      await OpportunitiesService.delete(id);
    } catch (error) {
      await loadOpportunities();
      throw error;
    }
  };

  const filteredOpportunities = useState(() => {
    let filtered = opportunities;

    filtered = OpportunitiesService.filterByStage(filtered, filters.stage);

    if (filters.sortBy === "amount") {
      filtered = OpportunitiesService.sortByAmount(filtered, filters.sortOrder);
    } else if (filters.sortBy === "createdDate") {
      filtered = OpportunitiesService.sortByCreatedDate(
        filtered,
        filters.sortOrder
      );
    }

    return filtered;
  })[0];

  const getTotalValue = (): number => {
    return OpportunitiesService.getTotalValue(filteredOpportunities);
  };

  const getWeightedValue = (): number => {
    return OpportunitiesService.getWeightedValue(filteredOpportunities);
  };

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  return {
    opportunities,
    loading,
    error,
    addOpportunity,
    addOpportunityFromLead,
    updateOpportunity,
    removeOpportunity,
    refetch: loadOpportunities,
    filteredOpportunities,
    setFilters,
    filters,
    getTotalValue,
    getWeightedValue,
  };
}
