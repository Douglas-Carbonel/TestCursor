'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Download, Filter, Calendar, FileText, TrendingUp, Clock, Target, Users } from 'lucide-react'

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedAgent, setSelectedAgent] = useState('all')

  // Sample data for charts
  const ticketsByDay = [
    { day: '01/01', created: 12, resolved: 8, sla: 85 },
    { day: '02/01', created: 15, resolved: 12, sla: 80 },
    { day: '03/01', created: 8, resolved: 10, sla: 95 },
    { day: '04/01', created: 18, resolved: 15, sla: 78 },
    { day: '05/01', created: 14, resolved: 16, sla: 90 },
    { day: '06/01', created: 10, resolved: 12, sla: 92 },
    { day: '07/01', created: 16, resolved: 14, sla: 88 }
  ]

  const ticketsByCategory = [
    { name: 'Suporte Técnico', value: 45, color: '#f97316' },
    { name: 'Comercial', value: 25, color: '#3b82f6' },
    { name: 'Desenvolvimento', value: 20, color: '#10b981' },
    { name: 'Outros', value: 10, color: '#f59e0b' }
  ]

  const agentPerformance = [
    { agent: 'João Silva', resolved: 45, avgTime: 2.5, sla: 95 },
    { agent: 'Maria Santos', resolved: 38, avgTime: 3.2, sla: 88 },
    { agent: 'Pedro Costa', resolved: 42, avgTime: 2.8, sla: 92 },
    { agent: 'Ana Oliveira', resolved: 35, avgTime: 3.5, sla: 85 }
  ]

  const slaMetrics = [
    { metric: 'SLA Geral', value: '89%', trend: '+2%', color: 'text-green-600' },
    { metric: 'Tempo Médio 1ª Resposta', value: '2.3h', trend: '-0.5h', color: 'text-green-600' },
    { metric: 'Tempo Médio Resolução', value: '24.5h', trend: '+1.2h', color: 'text-red-600' },
    { metric: 'Satisfação Cliente', value: '4.2/5', trend: '+0.1', color: 'text-green-600' }
  ]

  const exportReport = (format: string) => {
    // Simulate report export
    alert(`Relatório exportado em ${format.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Dashboards</h1>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sla">SLA</TabsTrigger>
            <TabsTrigger value="custom">Personalizado</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tickets Resolvidos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,089</div>
                  <p className="text-xs text-muted-foreground">
                    +8% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.5h</div>
                  <p className="text-xs text-muted-foreground">
                    -2.1h em relação ao período anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SLA Cumprido</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <p className="text-xs text-muted-foreground">
                    +2% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ticketsByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="created" fill="#f97316" name="Criados" />
                      <Bar dataKey="resolved" fill="#10b981" name="Resolvidos" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketsByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {ticketsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Agente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentPerformance.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-dwu-orange rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{agent.agent.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <div className="font-medium">{agent.agent}</div>
                          <div className="text-sm text-gray-500">{agent.resolved} tickets resolvidos</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{agent.avgTime}h tempo médio</div>
                        <Badge variant={agent.sla >= 90 ? "default" : "secondary"}>
                          {agent.sla}% SLA
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sla" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {slaMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className={`text-xs ${metric.color}`}>
                      {metric.trend} vs período anterior
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Evolução do SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ticketsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sla" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatório Personalizado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="support">Suporte</SelectItem>
                        <SelectItem value="sales">Comercial</SelectItem>
                        <SelectItem value="dev">Desenvolvimento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="agent">Agente</Label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="joao">João Silva</SelectItem>
                        <SelectItem value="maria">Maria Santos</SelectItem>
                        <SelectItem value="pedro">Pedro Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="period">Período</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
                    Gerar Relatório
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('excel')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}