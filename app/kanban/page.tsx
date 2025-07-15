'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Search, Filter, Plus, Clock, AlertCircle, User, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Ticket {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  customer: string
  assignee?: string
  dueDate: string
  tags: string[]
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
}

const initialTickets: Ticket[] = [
  {
    id: '1',
    title: 'Login não funcionando',
    description: 'Usuário não consegue fazer login no sistema',
    priority: 'high',
    category: 'Técnico',
    customer: 'João Silva',
    assignee: 'Maria Santos',
    dueDate: '2025-01-16',
    tags: ['login', 'urgente'],
    status: 'open'
  },
  {
    id: '2',
    title: 'Relatório de vendas com erro',
    description: 'Relatório mensal não está gerando corretamente',
    priority: 'medium',
    category: 'Bug',
    customer: 'Ana Costa',
    assignee: 'Pedro Oliveira',
    dueDate: '2025-01-18',
    tags: ['relatório', 'vendas'],
    status: 'in_progress'
  },
  {
    id: '3',
    title: 'Nova funcionalidade solicitada',
    description: 'Cliente solicitou implementação de dashboard customizado',
    priority: 'low',
    category: 'Feature',
    customer: 'Carlos Pereira',
    dueDate: '2025-01-25',
    tags: ['dashboard', 'customização'],
    status: 'open'
  },
  {
    id: '4',
    title: 'Integração com CRM',
    description: 'Configurar integração com Salesforce',
    priority: 'medium',
    category: 'Integração',
    customer: 'Empresa ABC',
    assignee: 'Ana Souza',
    dueDate: '2025-01-20',
    tags: ['crm', 'salesforce'],
    status: 'in_progress'
  },
  {
    id: '5',
    title: 'Problema resolvido',
    description: 'Ticket que já foi resolvido',
    priority: 'low',
    category: 'Suporte',
    customer: 'Maria Silva',
    assignee: 'João Santos',
    dueDate: '2025-01-15',
    tags: ['resolvido'],
    status: 'resolved'
  }
]

export default function KanbanPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')

  const columns = [
    { id: 'open', title: 'Aberto', color: 'bg-red-100 border-red-200' },
    { id: 'in_progress', title: 'Em Andamento', color: 'bg-blue-100 border-blue-200' },
    { id: 'resolved', title: 'Resolvido', color: 'bg-green-100 border-green-200' },
    { id: 'closed', title: 'Fechado', color: 'bg-gray-100 border-gray-200' }
  ]

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
    const matchesAssignee = filterAssignee === 'all' || ticket.assignee === filterAssignee
    
    return matchesSearch && matchesPriority && matchesAssignee
  })

  const getTicketsByStatus = (status: string) => {
    return filteredTickets.filter(ticket => ticket.status === status)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    
    if (source.droppableId !== destination.droppableId) {
      // Moving ticket to different column
      const newTickets = tickets.map(ticket => {
        if (ticket.id === result.draggableId) {
          return { ...ticket, status: destination.droppableId as any }
        }
        return ticket
      })
      setTickets(newTickets)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Maria Santos">Maria Santos</SelectItem>
              <SelectItem value="Pedro Oliveira">Pedro Oliveira</SelectItem>
              <SelectItem value="Ana Souza">Ana Souza</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map(column => (
              <div key={column.id} className={`bg-white rounded-lg border-2 ${column.color} min-h-96`}>
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <Badge variant="outline">
                      {getTicketsByStatus(column.id).length}
                    </Badge>
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 space-y-3 min-h-80 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                    >
                      {getTicketsByStatus(column.id).map((ticket, index) => (
                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab ${snapshot.isDragging ? 'rotate-3 shadow-lg' : ''}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`} />
                                  <Badge variant="outline" className="text-xs">
                                    {ticket.category}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{new Date(ticket.dueDate).toLocaleDateString('pt-BR')}</span>
                                </div>
                              </div>
                              
                              <Link href={`/tickets/${ticket.id}`}>
                                <h4 className="font-medium text-gray-900 hover:text-dwu-orange cursor-pointer mb-2">
                                  {ticket.title}
                                </h4>
                              </Link>
                              
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {ticket.description}
                              </p>
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                {ticket.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{ticket.customer}</span>
                                </div>
                                {ticket.assignee && (
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {ticket.assignee.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-gray-500">{ticket.assignee}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}