import { Lead } from "../../../services/LeadsService";

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick: (leadId: string) => void;
  selectedLeadId?: string;
}

export function LeadsTable({
  leads,
  onLeadClick,
  selectedLeadId,
}: LeadsTableProps) {
  const getStatusBadge = (status: Lead["status"]) => {
    const statusStyles = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      qualified: "bg-green-100 text-green-800",
    };

    const statusLabels = {
      new: "Novo",
      contacted: "Contatado",
      qualified: "Qualificado",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {statusLabels[status]}
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 font-semibold";
    if (score >= 60) return "text-yellow-600 font-semibold";
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
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onLeadClick(lead.id)}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedLeadId === lead.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{lead.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{lead.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-600">{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-600">{lead.source}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={getScoreColor(lead.score)}>{lead.score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(lead.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
