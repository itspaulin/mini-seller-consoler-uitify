import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lead, UpdateLeadData } from "../../../services/LeadsService";
import OpportunityService from "../../../services/OpportunityService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Edit, Save, User } from "lucide-react";
import { Loader2 } from "lucide-react";

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
  const navigate = useNavigate();

  if (!lead) return null;

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
    setLoading(true);
    try {
      if (onConvert) {
        await onConvert(lead);
      } else {
        const opportunityData = OpportunityService.createFromLead(lead);
        await OpportunityService.create(opportunityData);
      }

      onClose();

      navigate("/opportunities?refresh=true");
    } catch (error) {
      console.error("Erro ao converter lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Lead["status"]) => {
    const statusConfig = {
      new: {
        label: "Novo",
        variant: "default" as const,
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      contacted: {
        label: "Contatado",
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      qualified: {
        label: "Qualificado",
        variant: "default" as const,
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Lead
          </DialogTitle>
          <DialogDescription>
            Visualize e edite as informações do lead
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nome</Label>
                  <div className="text-sm p-2 bg-muted rounded-md">
                    {lead.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Empresa</Label>
                  <div className="text-sm p-2 bg-muted rounded-md">
                    {lead.company}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email ?? lead.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                ) : (
                  <div className="text-sm p-2 bg-muted rounded-md">
                    {lead.email}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Origem</Label>
                  <div className="text-sm p-2 bg-muted rounded-md">
                    {lead.source}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Score</Label>
                  <div className="text-sm font-semibold p-2 bg-muted rounded-md">
                    {lead.score}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                {isEditing ? (
                  <Select
                    value={editData.status ?? lead.status}
                    onValueChange={(value) =>
                      setEditData({
                        ...editData,
                        status: value as Lead["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Novo</SelectItem>
                      <SelectItem value="contacted">Contatado</SelectItem>
                      <SelectItem value="qualified">Qualificado</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex">{getStatusBadge(lead.status)}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={loading} size="sm">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({});
                  }}
                  size="sm"
                  className="cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4 cursor-pointer" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                size="sm"
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4 " />
                Editar
              </Button>
            )}
          </div>

          {onConvert && !isEditing && (
            <Button
              onClick={handleConvert}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Convertendo...
                </>
              ) : (
                "Converter em Oportunidade"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
