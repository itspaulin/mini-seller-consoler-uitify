import HttpClient from "./utils/HttpClient";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: "new" | "contacted" | "qualified";
}

export interface UpdateLeadData {
  email?: string;
  status?: Lead["status"];
}

class LeadsService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient("");
  }

  async getAll(): Promise<Lead[]> {
    return this.httpClient.get<Lead[]>("/data/leads.json");
  }

  async getById(id: string): Promise<Lead | null> {
    const leads = await this.getAll();
    return leads.find((lead) => lead.id === id) || null;
  }

  async update(id: string, data: UpdateLeadData): Promise<Lead> {
    return this.httpClient.put<Lead>(`/api/leads/${id}`, {
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.httpClient.delete(`/api/leads/${id}`);
  }

  async create(data: Omit<Lead, "id">): Promise<Lead> {
    return this.httpClient.post<Lead>("/api/leads", {
      body: data,
    });
  }

  filterBySearch(leads: Lead[], search: string): Lead[] {
    if (!search.trim()) return leads;

    const searchLower = search.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower)
    );
  }

  filterByStatus(leads: Lead[], status: Lead["status"] | ""): Lead[] {
    if (!status) return leads;
    return leads.filter((lead) => lead.status === status);
  }

  sortByScore(leads: Lead[], order: "asc" | "desc" = "desc"): Lead[] {
    return [...leads].sort((a, b) => {
      const modifier = order === "desc" ? -1 : 1;
      return (a.score - b.score) * modifier;
    });
  }

  sortByName(leads: Lead[], order: "asc" | "desc" = "asc"): Lead[] {
    return [...leads].sort((a, b) => {
      const modifier = order === "desc" ? -1 : 1;
      return a.name.localeCompare(b.name) * modifier;
    });
  }
}

export default new LeadsService();
