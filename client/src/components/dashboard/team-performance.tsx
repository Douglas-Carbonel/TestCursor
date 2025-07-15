import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

export default function TeamPerformance() {
  const { data: agents, isLoading } = useQuery({
    queryKey: ["/api/agents"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance da Equipe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents?.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Nenhum agente encontrado</p>
          ) : (
            agents?.map((agent: any) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">-</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
