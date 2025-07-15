
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
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 text-base">
            Bem-vindo ao seu painel de controle
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Chamados
              </CardTitle>
              <div className="p-2 bg-primary rounded-lg">
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
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.resolved || 0}
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Concluídos
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tickets */}
          <Card className="lg:col-span-2 bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">Chamados Recentes</CardTitle>
                  <CardDescription>
                    Últimos chamados criados no sistema
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="bg-white/50 dark:bg-gray-700/50">
                  <Link href="/tickets">
                    Ver Todos
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentTickets.length > 0 ? (
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors duration-300">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {ticket.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant="outline">
                          {formatStatus(ticket.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum chamado encontrado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse rapidamente as funcionalidades principais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start bg-primary hover:bg-primary/90 text-white">
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
    </div>
  )
}
