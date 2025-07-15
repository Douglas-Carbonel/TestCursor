import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketForm from "@/components/ticket/ticket-form";
import { useLocation } from "wouter";

export default function NewTicket() {
  const [, navigate] = useLocation();

  const handleSuccess = () => {
    navigate("/tickets");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Chamado</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
