
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle, Edit, Trash2, Clock, AlertTriangle, CheckCircle, Target } from 'lucide-react'

interface SLARule {
  id: number
  name: string
  description: string
  departmentId: number | null
  priority: string[]
  customerType: string[]
  firstResponseTime: number
  resolutionTime: number
  isActive: boolean
  businessHoursOnly: boolean
  pauseConditions: string[]
  escalationRules: EscalationRule[]
  department?: {
    id: number
    name: string
  }
}

interface EscalationRule {
  id: string
  level: number
  triggerTime: number
  action: string
  targetUserId?: number
  targetDepartmentId?: number
}

interface Department {
  id: number
  name: string
}

interface SLAStatus {
  ticketId: number
  status: 'within' | 'warning' | 'breached'
  responseTimeRemaining: number
  resolutionTimeRemaining: number
  isPaused: boolean
  pauseReason?: string
}

export default function SLAPage() {
  const [activeTab, setActiveTab] = useState('rules')
  const [slaRules, setSlaRules] = useState<SLARule[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [slaStatuses, setSlaStatuses] = useState<SLAStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState<SLARule | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentId: 'all',
    priority: [] as string[],
    customerType: [] as string[],
    firstResponseTime: 120, // minutes
    resolutionTime: 1440, // minutes
    isActive: true,
    businessHoursOnly: true,
    pauseConditions: [] as string[],
    escalationRules: [] as EscalationRule[]
  })

  const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' }
  ]

  const customerTypeOptions = [
    { value: 'consultant', label: 'Consultoria' },
    { value: 'direct', label: 'Cliente Direto' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' }
  ]

  const pauseConditionOptions = [
    { value: 'waiting_customer', label: 'Aguardando Cliente' },
    { value: 'waiting_third_party', label: 'Aguardando Terceiros' },
    { value: 'pending_approval', label: 'Aguardando Aprovação' },
    { value: 'customer_testing', label: 'Cliente Testando' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [rulesRes, deptsRes, statusRes] = await Promise.all([
        fetch('/api/sla/rules'),
        fetch('/api/departments'),
        fetch('/api/sla/status')
      ])
      
      if (rulesRes.ok) {
        const rules = await rulesRes.json()
        setSlaRules(rules)
      }
      
      if (deptsRes.ok) {
        const depts = await deptsRes.json()
        setDepartments(depts)
      }
      
      if (statusRes.ok) {
        const statuses = await statusRes.json()
        setSlaStatuses(statuses)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingRule 
        ? `/api/sla/rules/${editingRule.id}` 
        : '/api/sla/rules'
      
      const method = editingRule ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        departmentId: formData.departmentId === 'all' ? null : parseInt(formData.departmentId)
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchData()
        setShowForm(false)
        setEditingRule(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving SLA rule:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      departmentId: 'all',
      priority: [],
      customerType: [],
      firstResponseTime: 120,
      resolutionTime: 1440,
      isActive: true,
      businessHoursOnly: true,
      pauseConditions: [],
      escalationRules: []
    })
  }

  const handleEdit = (rule: SLARule) => {
    setEditingRule(rule)
    setFormData({
      name: rule.name,
      description: rule.description,
      departmentId: rule.departmentId?.toString() || 'all',
      priority: rule.priority,
      customerType: rule.customerType,
      firstResponseTime: rule.firstResponseTime,
      resolutionTime: rule.resolutionTime,
      isActive: rule.isActive,
      businessHoursOnly: rule.businessHoursOnly,
      pauseConditions: [],
      escalationRules: []
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta regra de SLA?')) {
      try {
        const response = await fetch(`/api/sla/rules/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchData()
        }
      } catch (error) {
        console.error('Error deleting SLA rule:', error)
      }
    }
  }

  const pauseSLA = async (ticketId: number, reason: string) => {
    try {
      const response = await fetch(`/api/sla/pause`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId, reason }),
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error pausing SLA:', error)
    }
  }

  const resumeSLA = async (ticketId: number) => {
    try {
      const response = await fetch(`/api/sla/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId }),
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error resuming SLA:', error)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'within': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'breached': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSLAStatusIcon = (status: string) => {
    switch (status) {
      case 'within': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'breached': return <Target className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciamento de SLA
            </h1>
            <p className="text-gray-600 mt-1">
              Configure e monitore acordos de nível de serviço
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">Regras de SLA</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Regras de SLA</h2>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-dwu-orange hover:bg-dwu-orange-dark"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Regra SLA
              </Button>
            </div>

            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingRule ? 'Editar Regra SLA' : 'Nova Regra SLA'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome da Regra</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Setor</Label>
                        <Select 
                          value={formData.departmentId} 
                          onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um setor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os setores</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstResponse">Tempo de Primeira Resposta (minutos)</Label>
                        <Input
                          id="firstResponse"
                          type="number"
                          value={formData.firstResponseTime}
                          onChange={(e) => setFormData({ ...formData, firstResponseTime: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="resolution">Tempo de Resolução (minutos)</Label>
                        <Input
                          id="resolution"
                          type="number"
                          value={formData.resolutionTime}
                          onChange={(e) => setFormData({ ...formData, resolutionTime: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                        <Label>Ativo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.businessHoursOnly}
                          onCheckedChange={(checked) => setFormData({ ...formData, businessHoursOnly: checked })}
                        />
                        <Label>Apenas Horário Comercial</Label>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="bg-dwu-orange hover:bg-dwu-orange-dark">
                        {editingRule ? 'Atualizar' : 'Criar'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false)
                          setEditingRule(null)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {slaRules.map((rule) => (
                <Card key={rule.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">{rule.name}</h3>
                          {rule.department && (
                            <Badge variant="outline">{rule.department.name}</Badge>
                          )}
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                          {rule.businessHoursOnly && (
                            <Badge variant="outline">Horário Comercial</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>Primeira resposta: {formatTime(rule.firstResponseTime)}</span>
                          <span>Resolução: {formatTime(rule.resolutionTime)}</span>
                        </div>
                        {rule.description && (
                          <p className="text-sm text-gray-600 mt-2">{rule.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(rule.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Dentro do SLA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {slaStatuses.filter(s => s.status === 'within').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                    Em Alerta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {slaStatuses.filter(s => s.status === 'warning').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Target className="h-4 w-4 mr-2 text-red-600" />
                    SLA Violado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {slaStatuses.filter(s => s.status === 'breached').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {slaStatuses.map((status) => (
                    <div key={status.ticketId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={getSLAStatusColor(status.status)}>
                          {getSLAStatusIcon(status.status)}
                        </div>
                        <div>
                          <div className="font-medium">Ticket #{status.ticketId}</div>
                          <div className="text-sm text-gray-600">
                            Resposta: {formatTime(status.responseTimeRemaining)} restantes
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {status.isPaused ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resumeSLA(status.ticketId)}
                            className="text-green-600"
                          >
                            Retomar SLA
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => pauseSLA(status.ticketId, 'waiting_customer')}
                            className="text-orange-600"
                          >
                            Pausar SLA
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">SLA Cumprido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <p className="text-xs text-green-600">+2% vs mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Tempo Médio 1ª Resposta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3h</div>
                  <p className="text-xs text-green-600">-0.5h vs mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Tempo Médio Resolução</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.5h</div>
                  <p className="text-xs text-red-600">+1.2h vs mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Tickets Pausados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {slaStatuses.filter(s => s.isPaused).length}
                  </div>
                  <p className="text-xs text-gray-600">Aguardando cliente</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
