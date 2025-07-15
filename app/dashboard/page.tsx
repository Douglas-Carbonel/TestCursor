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
  customer?: {
    name: string
    company?: string
  }
  slaStatus?: 'within' | 'warning' | 'breached'
}

interface SLAMetrics {
  withinSLA: number
  atRisk: number
  breached: number
  averageResponseTime: number
  averageResolutionTime: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<TicketStats | null>(null)
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([])
  const [slaMetrics, setSlaMetrics] = useState<SLAMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedConsultancy, setSelectedConsultancy] = useState<string>('all')

  useEffect(() => {
    fetchStats()
    fetchRecentTickets()
    fetchSLAMetrics()
  }, [selectedConsultancy])

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
      const url = selectedConsultancy === 'all' 
        ? '/api/tickets?limit=5' 
        : `/api/tickets?limit=5&consultancy=${selectedConsultancy}`
      const response = await fetch(url)
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

  const fetchSLAMetrics = async () => {
    try {
      const url = selectedConsultancy === 'all' 
        ? '/api/tickets/sla' 
        : `/api/tickets/sla?consultancy=${selectedConsultancy}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setSlaMetrics(data)
      }
    } catch (error) {
      console.error('Error fetching SLA metrics:', error)
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 mb-2">Open tickets</span>
              <span className="text-3xl font-bold text-gray-900 mb-1">{stats?.open || 52}</span>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>15% Up from last hour</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 mb-2">New Tickets</span>
              <span className="text-3xl font-bold text-gray-900 mb-1">{stats?.total || 36}</span>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>15% Up from last hour</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 mb-2">In Process Tickets</span>
              <span className="text-3xl font-bold text-gray-900 mb-1">{stats?.inProgress || 41}</span>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>15% Up from last hour</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 mb-2">Closed Tickets</span>
              <span className="text-3xl font-bold text-gray-900 mb-1">{stats?.closed || 45}</span>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>15% Up from last hour</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Stats */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Target Stats</CardTitle>
            <select className="text-sm text-dwu-orange border-none bg-transparent">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="50" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
                  <circle cx="64" cy="64" r="50" stroke="#10b981" strokeWidth="8" strokeDasharray="314" strokeDashoffset="157" fill="transparent" strokeLinecap="round" />
                  <circle cx="64" cy="64" r="50" stroke="#ef4444" strokeWidth="8" strokeDasharray="314" strokeDashoffset="78" fill="transparent" strokeLinecap="round" />
                  <circle cx="64" cy="64" r="50" stroke="#f59e0b" strokeWidth="8" strokeDasharray="314" strokeDashoffset="0" fill="transparent" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">259</div>
                    <div className="text-sm text-gray-500">Tickets</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>New Tickets</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Open Tickets</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Closed Tickets</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Online */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Member online</CardTitle>
            <button className="text-sm text-dwu-orange">View All</button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-dwu-orange rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">ET</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Emma Thompson</div>
                    <div className="text-xs text-gray-500">Customer representative</div>
                  </div>
                </div>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">NJ</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Noah Johnson</div>
                    <div className="text-xs text-gray-500">Service supervisor</div>
                  </div>
                </div>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">SM</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Sophia Martinez</div>
                    <div className="text-xs text-gray-500">Client relations officer</div>
                  </div>
                </div>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">OB</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Oliver Brown</div>
                    <div className="text-xs text-gray-500">Support team leader</div>
                  </div>
                </div>
                <button className="text-gray-400">•••</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Tickets Table */}
        <Card className="bg-white border border-gray-200 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Latest Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Ticket ID</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Name</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Subject</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Created</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">Loading...</td>
                    </tr>
                  ) : recentTickets.length > 0 ? (
                    recentTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">ABC{ticket.id.toString().padStart(2, '0')}</td>
                        <td className="py-3 text-sm text-gray-900">Liam Smith</td>
                        <td className="py-3 text-sm text-gray-500">liam@gmail.com</td>
                        <td className="py-3 text-sm text-gray-900">{ticket.title}</td>
                        <td className="py-3 text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} ago
                        </td>
                        <td className="py-3">
                          <Badge 
                            className={`text-xs ${
                              ticket.status === 'open' ? 'bg-blue-100 text-blue-600' :
                              ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-600' :
                              ticket.status === 'resolved' ? 'bg-green-100 text-green-600' :
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {ticket.status === 'open' ? 'New' :
                             ticket.status === 'in_progress' ? 'Open' :
                             ticket.status === 'resolved' ? 'In Progress' : 'Closed'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">No tickets found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}