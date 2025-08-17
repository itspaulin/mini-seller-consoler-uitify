import React, { useState } from "react";
import { Lead, UpdateLeadData } from "../../../services/LeadsService";

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (leadId: string, data: UpdateLeadData) => Promise<void>;
  onConvert?: (lead: Lead) => Promise<void>;
}

export function LeadDetailPanel({
  lead,
  isOpen,
  onClose,
  onUpdate,
  onConvert,
}: LeadDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateLeadData>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen || !lead) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(lead.id, editData);
      setIsEditing(false);
      setEditData({});
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (onConvert) {
      setLoading(true);
      try {
        await onConvert(lead);
      } catch (error) {
        console.error("Erro ao converter lead:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Detalhes do Lead
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <div className="mt-1 text-sm text-gray-900">{lead.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Empresa
              </label>
              <div className="mt-1 text-sm text-gray-900">{lead.company}</div>
            </div>
          </div>

          {/* Email - Editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email ?? lead.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="mt-1 text-sm text-gray-900">{lead.email}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Origem
              </label>
              <div className="mt-1 text-sm text-gray-900">{lead.source}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Score
              </label>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {lead.score}
              </div>
            </div>
          </div>

          {/* Status - Editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            {isEditing ? (
              <select
                value={editData.status ?? lead.status}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    status: e.target.value as Lead["status"],
                  })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">Novo</option>
                <option value="contacted">Contatado</option>
                <option value="qualified">Qualificado</option>
              </select>
            ) : (
              <div className="mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : lead.status === "contacted"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {lead.status === "new"
                    ? "Novo"
                    : lead.status === "contacted"
                    ? "Contatado"
                    : "Qualificado"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({});
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Editar
              </button>
            )}
          </div>

          {onConvert && !isEditing && (
            <button
              onClick={handleConvert}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Convertendo..." : "Converter em Oportunidade"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
