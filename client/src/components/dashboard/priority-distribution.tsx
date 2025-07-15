import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PriorityDistribution() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const priorityColors = {
    critical: "bg-red-500",
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const priorityLabels = {
    critical: "Crítica",
    high: "Alta",
    medium: "Média",
    low: "Baixa",
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Prioridade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Prioridade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats?.byPriority?.map((item: any) => (
            <div key={item.priority} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${priorityColors[item.priority as keyof typeof priorityColors] || 'bg-gray-500'}`} />
                <span className="text-sm text-gray-600">
                  {priorityLabels[item.priority as keyof typeof priorityLabels] || item.priority}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.count}</span>
            </div>
          )) || (
            <p className="text-center text-gray-500 py-4">Nenhum dado disponível</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
