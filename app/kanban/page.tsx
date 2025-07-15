
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter, Search, Plus, User, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface KanbanTicket {
  id: number
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  customer: {
    name: string
    company?: string
  }
  assignee?: {
    name: string
  }
  createdAt: string
  updatedAt: string
}

const statusColumns = [
  { id: 'open', title: 'Abertos', color: 'bg-blue-500' },
  { id: 'in_progress', title: 'Em Andamento', color: 'bg-yellow-500' },
  { id: 'resolved', title: 'Resolvidos', color: 'bg-green-500' },
  { id: 'closed', title: 'Fechados', color: 'bg-gray-500' }
]

export default function KanbanPage() {
  const [tickets, setTickets] = useState<KanbanTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    assignee: '',
    consultancy: ''
  })

  useEffect(() => {
    fetchTickets()
  }, [filters])

  const fetchTickets = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
      
      const response = await fetch(`/api/tickets?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || data)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTicketStatus = async (ticketId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchTickets() // Refresh tickets
      }
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTicketsByStatus = (status: string) => {
    return tickets.filter(ticket => ticket.status === status)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Kanban - Equipe de Suporte</h1>
          <Link href="/tickets/new">
            <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
              <Plus className="h-4 w-4 mr-2" />
              Novo Ticket
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar tickets..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={filters.priority}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
              >
                <option value="">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="consultancy">Consultoria</Label>
              <Select
                value={filters.consultancy}
                onValueChange={(value) => setFilters(prev => ({ ...prev, consultancy: value }))}
              >
                <option value="">Todas</option>
                <option value="TechCorp">TechCorp</option>
                <option value="DataSoft">DataSoft</option>
                <option value="CloudSys">CloudSys</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignee">Responsável</Label>
              <Select
                value={filters.assignee}
                onValueChange={(value) => setFilters(prev => ({ ...prev, assignee: value }))}
              >
                <option value="">Todos</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Santos">Maria Santos</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statusColumns.map(column => (
          <div key={column.id} className="bg-white rounded-lg shadow-sm">
            <div className={`${column.color} text-white p-4 rounded-t-lg`}>
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-sm opacity-90">
                {getTicketsByStatus(column.id).length} tickets
              </span>
            </div>
            
            <div className="p-4 space-y-3 min-h-[500px]">
              {getTicketsByStatus(column.id).map(ticket => (
                <Card 
                  key={ticket.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => window.location.href = `/tickets/${ticket.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{ticket.title}</h4>
                      <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs`}>
                        {ticket.priority === 'high' ? 'Alta' : 
                         ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {ticket.customer.company || ticket.customer.name}
                      </div>
                      
                      {ticket.assignee && (
                        <div className="flex items-center text-xs text-gray-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {ticket.assignee.name}
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    {/* Drag and drop functionality can be added here */}
                    <div className="mt-3 flex gap-1">
                      {statusColumns.map(status => (
                        <button
                          key={status.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            updateTicketStatus(ticket.id, status.id)
                          }}
                          className={`px-2 py-1 rounded text-xs ${
                            ticket.status === status.id 
                              ? `${status.color} text-white` 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {status.title}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
