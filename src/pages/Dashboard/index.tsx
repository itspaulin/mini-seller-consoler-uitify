import { useLeads } from "../../hooks/useLeads";
import { useOpportunities } from "../../hooks/useOpportunities";
import { BarChart3, Users, Target, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeType?: "positive" | "negative";
}

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
            {change && (
              <p
                className={`text-sm ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Lead {
  id: string;
  name: string;
  company: string;
  status: "new" | "contacted" | "qualified";
  score: number;
}

interface Opportunity {
  id: string;
  // Adicione outras propriedades conforme necessário
}

export function Dashboard() {
  const { leads }: { leads: Lead[] } = useLeads();
  const { opportunities }: { opportunities: Opportunity[] } =
    useOpportunities();

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "qualified"
  ).length;
  const totalOpportunities = opportunities.length;
  const averageScore =
    totalLeads > 0
      ? Math.round(
          leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads
        )
      : 0;

  const statusLabels = {
    new: "Novo",
    contacted: "Contatado",
    qualified: "Qualificado",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Visão geral do seu pipeline de vendas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Leads"
          value={totalLeads}
          icon={Users}
          change="+12% este mês"
          changeType="positive"
        />
        <StatCard
          title="Leads Qualificados"
          value={qualifiedLeads}
          icon={Target}
          change="+8% este mês"
          changeType="positive"
        />
        <StatCard
          title="Oportunidades"
          value={totalOpportunities}
          icon={DollarSign}
          change="+25% este mês"
          changeType="positive"
        />
        <StatCard
          title="Score Médio"
          value={averageScore}
          icon={BarChart3}
          change="+3 pontos"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(["new", "contacted", "qualified"] as const).map((status) => {
                const count = leads.filter(
                  (lead) => lead.status === status
                ).length;
                const percentage =
                  totalLeads > 0 ? (count / totalLeads) * 100 : 0;

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {statusLabels[status]}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Leads por Score</CardTitle>
            <CardDescription>Os 5 leads com maior pontuação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((lead, index) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.company}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      {lead.score}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
