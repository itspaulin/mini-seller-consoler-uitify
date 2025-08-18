import HttpClient from "./utils/HttpClient";
import { Lead } from "./LeadsService";

export interface Opportunity {
  id: string;
  name: string;
  stage:
    | "qualification"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  amount?: number;
  accountName: string;
  createdAt: string;
  leadId?: string;
  closeDate?: string;
  probability?: number;
}

export interface CreateOpportunityData {
  name: string;
  stage: Opportunity["stage"];
  amount?: number;
  accountName: string;
  leadId?: string;
  closeDate?: string;
  probability?: number;
}

export interface UpdateOpportunityData {
  name?: string;
  stage?: Opportunity["stage"];
  amount?: number;
  closeDate?: string;
  probability?: number;
}

class OpportunitiesService {
  private httpClient: HttpClient;
  private readonly STORAGE_KEY = "opportunities";

  constructor() {
    this.httpClient = new HttpClient("");
  }

  private getOpportunitiesFromStorage(): Opportunity[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erro ao carregar oportunidades do localStorage:", error);
      return [];
    }
  }

  private saveOpportunitiesToStorage(opportunities: Opportunity[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(opportunities));
    } catch (error) {
      console.error("Erro ao salvar oportunidades no localStorage:", error);
    }
  }

  async getAll(): Promise<Opportunity[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.getOpportunitiesFromStorage();
    } catch (error) {
      console.error("Erro ao buscar oportunidades:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Opportunity | null> {
    const opportunities = await this.getAll();
    return opportunities.find((opp) => opp.id === id) || null;
  }

  async create(data: CreateOpportunityData): Promise<Opportunity> {
    const opportunity: Opportunity = {
      id: `OPP${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      stage: data.stage,
      amount: data.amount,
      accountName: data.accountName,
      createdAt: new Date().toISOString(),
      leadId: data.leadId,
      closeDate: data.closeDate,
      probability: data.probability || this.getDefaultProbability(data.stage),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const opportunities = this.getOpportunitiesFromStorage();
      opportunities.push(opportunity);
      this.saveOpportunitiesToStorage(opportunities);

      console.log("Oportunidade criada:", opportunity);
      return opportunity;
    } catch (error) {
      console.error("Erro ao criar oportunidade:", error);
      throw error;
    }
  }

  async update(id: string, data: UpdateOpportunityData): Promise<Opportunity> {
    try {
      const opportunities = this.getOpportunitiesFromStorage();
      const index = opportunities.findIndex((opp) => opp.id === id);

      if (index === -1) {
        throw new Error(`Oportunidade com ID ${id} não encontrada`);
      }

      const updatedOpportunity = {
        ...opportunities[index],
        ...data,

        probability: data.stage
          ? data.probability || this.getDefaultProbability(data.stage)
          : opportunities[index].probability,
      };

      opportunities[index] = updatedOpportunity;
      this.saveOpportunitiesToStorage(opportunities);

      await new Promise((resolve) => setTimeout(resolve, 200));

      return updatedOpportunity;
    } catch (error) {
      console.error("Erro ao atualizar oportunidade:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const opportunities = this.getOpportunitiesFromStorage();
      const filteredOpportunities = opportunities.filter(
        (opp) => opp.id !== id
      );
      this.saveOpportunitiesToStorage(filteredOpportunities);

      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Erro ao deletar oportunidade:", error);
      throw error;
    }
  }

  createFromLead(
    lead: Lead,
    additionalData?: Partial<CreateOpportunityData>
  ): CreateOpportunityData {
    return {
      name: additionalData?.name || `${lead.name} - ${lead.company}`,
      stage: additionalData?.stage || "qualification",
      amount: additionalData?.amount,
      accountName: lead.company,
      leadId: lead.id,
      closeDate: additionalData?.closeDate,
      probability: additionalData?.probability,
    };
  }

  private getDefaultProbability(stage: Opportunity["stage"]): number {
    const probabilities: Record<Opportunity["stage"], number> = {
      qualification: 10,
      proposal: 25,
      negotiation: 60,
      "closed-won": 100,
      "closed-lost": 0,
    };

    return probabilities[stage];
  }

  getStageColor(stage: Opportunity["stage"]): string {
    const colors: Record<Opportunity["stage"], string> = {
      qualification: "bg-blue-100 text-blue-800",
      proposal: "bg-yellow-100 text-yellow-800",
      negotiation: "bg-orange-100 text-orange-800",
      "closed-won": "bg-green-100 text-green-800",
      "closed-lost": "bg-red-100 text-red-800",
    };

    return colors[stage];
  }

  getStageLabel(stage: Opportunity["stage"]): string {
    const labels: Record<Opportunity["stage"], string> = {
      qualification: "Qualificação",
      proposal: "Proposta",
      negotiation: "Negociação",
      "closed-won": "Fechado - Ganho",
      "closed-lost": "Fechado - Perdido",
    };

    return labels[stage];
  }

  filterByStage(
    opportunities: Opportunity[],
    stage: Opportunity["stage"] | ""
  ): Opportunity[] {
    if (!stage) return opportunities;
    return opportunities.filter((opp) => opp.stage === stage);
  }

  sortByAmount(
    opportunities: Opportunity[],
    order: "asc" | "desc" = "desc"
  ): Opportunity[] {
    return [...opportunities].sort((a, b) => {
      const modifier = order === "desc" ? -1 : 1;
      const amountA = a.amount || 0;
      const amountB = b.amount || 0;
      return (amountA - amountB) * modifier;
    });
  }

  sortByCreatedDate(
    opportunities: Opportunity[],
    order: "asc" | "desc" = "desc"
  ): Opportunity[] {
    return [...opportunities].sort((a, b) => {
      const modifier = order === "desc" ? -1 : 1;
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return (dateA - dateB) * modifier;
    });
  }

  getTotalValue(opportunities: Opportunity[]): number {
    return opportunities.reduce((total, opp) => total + (opp.amount || 0), 0);
  }

  getWeightedValue(opportunities: Opportunity[]): number {
    return opportunities.reduce((total, opp) => {
      const amount = opp.amount || 0;
      const probability = opp.probability || 0;
      return total + (amount * probability) / 100;
    }, 0);
  }

  getConversionRate(totalLeads: number, totalOpportunities: number): number {
    if (totalLeads === 0) return 0;
    return (totalOpportunities / totalLeads) * 100;
  }

  async clearAll(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar oportunidades:", error);
    }
  }

  async hasOpportunities(): Promise<boolean> {
    const opportunities = await this.getAll();
    return opportunities.length > 0;
  }
}

export default new OpportunitiesService();
