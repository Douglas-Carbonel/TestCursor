'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Ticket, 
  PlusCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowUpRight,
  Activity
} from 'lucide-react'

interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
}

interface RecentTicket {
  id: string
  title: string
  status: string
  priority: string
  createdAt: string
  assigneeId: string | null
}

export default function DashboardPage() {
  const [stats, setStats] = useState<TicketStats | null>(null)
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchRecentTickets()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tickets/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecentTickets = async () => {
    try {
      const response = await fetch('/api/tickets?limit=5')
      if (response.ok) {
        const data = await response.json()
        setRecentTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Error fetching recent tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500'
      case 'in_progress': return 'bg-yellow-500'
      case 'resolved': return 'bg-green-500'
      case 'closed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto'
      case 'in_progress': return 'Em Progresso'
      case 'resolved': return 'Resolvido'
      case 'closed': return 'Fechado'
      default: return status
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Chamados
            </CardTitle>
            <div className="p-2 bg-blue-600 rounded-lg">
              <Ticket className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.total || 0}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% este mês
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Chamados Abertos
            </CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.open || 0}
            </div>
            <div className="flex items-center text-xs text-orange-600 mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              Requer atenção
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Em Progresso
            </CardTitle>
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.inProgress || 0}
            </div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Em andamento
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Resolvidos
            </CardTitle>
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.resolved || 0}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completos
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Chamados Recentes
            </CardTitle>
            <CardDescription>
              Últimos chamados criados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="text-gray-500">Carregando...</div>
                </div>
              ) : recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`}></div>
                      <div>
                        <Link href={`/tickets/${ticket.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {ticket.title}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getPriorityColor(ticket.priority)} size="sm">
                            {ticket.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-500">Nenhum chamado encontrado</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/tickets">
                  <Ticket className="mr-2 h-4 w-4" />
                  Ver Todos os Chamados
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-50">
                <Link href="/tickets/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Novo Chamado
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-50">
                <Link href="/users">
                  <Users className="mr-2 h-4 w-4" />
                  Gerenciar Usuários
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}