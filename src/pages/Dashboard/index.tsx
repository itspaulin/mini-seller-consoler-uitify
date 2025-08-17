import { useLeads } from "../../hooks/useLeads";
import { useOpportunities } from "../../hooks/useOpportunities";
import { BarChart3, Users, Target, DollarSign } from "lucide-react";

function StatCard({ title, value, icon: Icon, change, changeType }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
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
    </div>
  );
}

export function Dashboard() {
  const { leads } = useLeads();
  const { opportunities } = useOpportunities();

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">
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
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Leads por Status
          </h3>
          <div className="space-y-3">
            {["new", "contacted", "qualified"].map((status) => {
              const count = leads.filter(
                (lead) => lead.status === status
              ).length;
              const percentage =
                totalLeads > 0 ? (count / totalLeads) * 100 : 0;

              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-sm font-medium text-gray-700">
                    {status === "new"
                      ? "Novo"
                      : status === "contacted"
                      ? "Contatado"
                      : "Qualificado"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Leads por Score
          </h3>
          <div className="space-y-3">
            {leads
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((lead, index) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {lead.score}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
