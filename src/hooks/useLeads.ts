import { useState, useEffect, useCallback } from "react";
import LeadsService, { Lead, UpdateLeadData } from "../services/LeadsService";

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  updateLead: (leadId: string, updates: UpdateLeadData) => Promise<void>;
  removeLead: (leadId: string) => void;
  refetch: () => Promise<void>;
  createLead: (data: Omit<Lead, "id">) => Promise<Lead>;
  filteredLeads: Lead[];
  setFilters: (filters: LeadFilters) => void;
  filters: LeadFilters;
}

interface LeadFilters {
  search: string;
  status: Lead["status"] | "";
  sortBy: "score" | "name";
  sortOrder: "asc" | "desc";
}

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({
    search: "",
    status: "",
    sortBy: "score",
    sortOrder: "desc",
  });

  const loadLeads = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await LeadsService.getAll();
      setLeads(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLead = async (
    leadId: string,
    updates: UpdateLeadData
  ): Promise<void> => {
    try {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, ...updates } : lead
        )
      );

      await LeadsService.update(leadId, updates);
    } catch (error) {
      await loadLeads();
      throw error;
    }
  };

  const createLead = async (data: Omit<Lead, "id">): Promise<Lead> => {
    try {
      const newLead = await LeadsService.create(data);
      setLeads((prev) => [newLead, ...prev]);
      return newLead;
    } catch (error) {
      throw error;
    }
  };

  const removeLead = (leadId: string): void => {
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
  };

  const filteredLeads = useState(() => {
    let filtered = leads;

    filtered = LeadsService.filterBySearch(filtered, filters.search);

    filtered = LeadsService.filterByStatus(filtered, filters.status);

    if (filters.sortBy === "score") {
      filtered = LeadsService.sortByScore(filtered, filters.sortOrder);
    } else if (filters.sortBy === "name") {
      filtered = LeadsService.sortByName(filtered, filters.sortOrder);
    }

    return filtered;
  })[0];

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return {
    leads,
    loading,
    error,
    updateLead,
    removeLead,
    refetch: loadLeads,
    createLead,
    filteredLeads,
    setFilters,
    filters,
  };
}
