import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TriangleAlert, Bug, HelpCircle, Settings } from "lucide-react";
import type { TicketWithRelations } from "@shared/schema";

interface TicketCardProps {
  ticket: TicketWithRelations;
  onClick?: () => void;
}

const priorityColors = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  critical: "priority-critical",
};

const statusColors = {
  open: "status-open",
  in_progress: "status-in_progress",
  resolved: "status-resolved",
  closed: "status-closed",
};

const statusLabels = {
  open: "Aberto",
  in_progress: "Em Andamento",
  resolved: "Resolvido",
  closed: "Fechado",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

const categoryIcons = {
  bug: Bug,
  feature: Settings,
  support: HelpCircle,
  question: HelpCircle,
};

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const Icon = ticket.category ? categoryIcons[ticket.category as keyof typeof categoryIcons] : TriangleAlert;

  return (
    <Card 
      className="hover:bg-gray-50 cursor-pointer transition-colors" 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              ticket.priority === "high" || ticket.priority === "critical" ? "bg-red-100" : 
              ticket.priority === "medium" ? "bg-yellow-100" : "bg-blue-100"
            )}>
              <Icon className={cn(
                "h-5 w-5",
                ticket.priority === "high" || ticket.priority === "critical" ? "text-red-600" : 
                ticket.priority === "medium" ? "text-yellow-600" : "text-blue-600"
              )} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{ticket.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{ticket.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
                </span>
                {ticket.assignee && (
                  <span className="text-xs text-gray-500">
                    Atribuído a: {ticket.assignee.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={cn("text-xs", priorityColors[ticket.priority as keyof typeof priorityColors])}>
              {priorityLabels[ticket.priority as keyof typeof priorityLabels]}
            </Badge>
            <Badge className={cn("text-xs", statusColors[ticket.status as keyof typeof statusColors])}>
              {statusLabels[ticket.status as keyof typeof statusLabels]}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
