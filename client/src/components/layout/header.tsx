import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Plus } from "lucide-react";
import TicketModal from "@/components/ticket/ticket-modal";

const getPageTitle = (location: string) => {
  switch (location) {
    case "/":
      return { title: "Dashboard", subtitle: "Visão geral dos chamados" };
    case "/tickets":
      return { title: "Chamados", subtitle: "Gerenciar todos os chamados" };
    case "/new-ticket":
      return { title: "Novo Chamado", subtitle: "Criar um novo chamado" };
    case "/users":
      return { title: "Usuários", subtitle: "Gerenciar usuários do sistema" };
    default:
      return { title: "Dashboard", subtitle: "Visão geral dos chamados" };
  }
};

export default function Header() {
  const [location] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, subtitle } = getPageTitle(location);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar chamados..."
                className="w-64 pl-10"
              />
            </div>
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            {/* New Ticket Button */}
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Chamado</span>
            </Button>
          </div>
        </div>
      </header>

      <TicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
