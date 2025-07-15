import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/dashboard/stats-card";
import RecentTickets from "@/components/dashboard/recent-tickets";
import PriorityDistribution from "@/components/dashboard/priority-distribution";
import TeamPerformance from "@/components/dashboard/team-performance";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket, Clock, CheckCircle, Timer } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))
        ) : (
          <>
            <StatsCard
              title="Total de Chamados"
              value={stats?.total || 0}
              icon={Ticket}
              color="blue"
              trend={{
                value: "+12%",
                isPositive: true,
                label: "vs. mês anterior",
              }}
            />
            <StatsCard
              title="Em Andamento"
              value={stats?.inProgress || 0}
              icon={Clock}
              color="yellow"
              trend={{
                value: "-3%",
                isPositive: false,
                label: "vs. semana anterior",
              }}
            />
            <StatsCard
              title="Resolvidos"
              value={stats?.resolved || 0}
              icon={CheckCircle}
              color="green"
              trend={{
                value: "+18%",
                isPositive: true,
                label: "vs. mês anterior",
              }}
            />
            <StatsCard
              title="Tempo Médio"
              value="2.4h"
              icon={Timer}
              color="purple"
              trend={{
                value: "-0.5h",
                isPositive: true,
                label: "vs. mês anterior",
              }}
            />
          </>
        )}
      </div>

      {/* Recent Tickets and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTickets />
        </div>
        <div className="space-y-6">
          <PriorityDistribution />
          <TeamPerformance />
        </div>
      </div>
    </div>
  );
}
