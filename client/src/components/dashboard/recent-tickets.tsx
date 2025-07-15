import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TicketCard from "@/components/ticket/ticket-card";
import { Link } from "wouter";
import type { TicketWithRelations } from "@shared/schema";

export default function RecentTickets() {
  const { data: tickets, isLoading } = useQuery<TicketWithRelations[]>({
    queryKey: ["/api/tickets"],
  });

  const recentTickets = tickets?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chamados Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chamados Recentes</CardTitle>
          <Link href="/tickets">
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTickets.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum chamado encontrado</p>
          ) : (
            recentTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
