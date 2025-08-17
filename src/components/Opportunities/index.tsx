import { Opportunity } from "../../services/OpportunityService";

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  onOpportunityClick?: (opportunityId: string) => void;
  selectedOpportunityId?: string;
}

export function OpportunitiesTable({
  opportunities,
  onOpportunityClick,
  selectedOpportunityId,
}: OpportunitiesTableProps) {
  const getStageBadge = (stage: Opportunity["stage"]) => {
    const stageStyles = {
      qualification: "bg-blue-100 text-blue-800",
      proposal: "bg-purple-100 text-purple-800",
      negotiation: "bg-orange-100 text-orange-800",
      "closed-won": "bg-green-100 text-green-800",
      "closed-lost": "bg-red-100 text-red-800",
    };

    const stageLabels = {
      qualification: "Qualificação",
      proposal: "Proposta",
      negotiation: "Negociação",
      "closed-won": "Fechada - Ganha",
      "closed-lost": "Fechada - Perdida",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${stageStyles[stage]}`}
      >
        {stageLabels[stage]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600 font-semibold";
    if (probability >= 50) return "text-yellow-600 font-semibold";
    if (probability >= 25) return "text-orange-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Probabilidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estágio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Criação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Fechamento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opportunity) => (
              <tr
                key={opportunity.id}
                onClick={() => onOpportunityClick?.(opportunity.id)}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedOpportunityId === opportunity.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {opportunity.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{opportunity.accountName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">
                    {opportunity.amount
                      ? formatCurrency(opportunity.amount)
                      : "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={getProbabilityColor(
                      opportunity.probability || 0
                    )}
                  >
                    {opportunity.probability || 0}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStageBadge(opportunity.stage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-600">
                    {formatDate(opportunity.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-600">
                    {opportunity.closeDate
                      ? formatDate(opportunity.closeDate)
                      : "-"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
