'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  Shield, 
  Settings, 
  Building2, 
  Clock, 
  Zap, 
  Mail, 
  Webhook,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('departments')

  // Sample data for departments
  const departments = [
    { id: 1, name: 'Suporte Técnico', description: 'Suporte técnico geral', isActive: true },
    { id: 2, name: 'Comercial', description: 'Vendas e pré-vendas', isActive: true },
    { id: 3, name: 'Desenvolvimento', description: 'Desenvolvimento de software', isActive: true },
    { id: 4, name: 'Financeiro', description: 'Questões financeiras', isActive: false }
  ]

  const slaRules = [
    { 
      id: 1, 
      name: 'SLA Padrão', 
      department: 'Suporte Técnico', 
      priority: 'Média', 
      firstResponse: 2, 
      resolution: 24, 
      isActive: true 
    },
    { 
      id: 2, 
      name: 'SLA Crítico', 
      department: 'Suporte Técnico', 
      priority: 'Crítica', 
      firstResponse: 0.5, 
      resolution: 4, 
      isActive: true 
    },
    { 
      id: 3, 
      name: 'SLA Comercial', 
      department: 'Comercial', 
      priority: 'Alta', 
      firstResponse: 1, 
      resolution: 8, 
      isActive: true 
    }
  ]

  const automationRules = [
    {
      id: 1,
      name: 'Auto-assignment Suporte',
      trigger: 'Novo ticket',
      condition: 'Categoria = Suporte',
      action: 'Atribuir ao próximo agente disponível',
      isActive: true
    },
    {
      id: 2,
      name: 'Escalação SLA',
      trigger: 'SLA próximo do vencimento',
      condition: 'Tempo restante < 2 horas',
      action: 'Notificar supervisor',
      isActive: true
    },
    {
      id: 3,
      name: 'Resposta Automática',
      trigger: 'Ticket criado por email',
      condition: 'Horário comercial',
      action: 'Enviar confirmação de recebimento',
      isActive: false
    }
  ]

  const integrations = [
    { id: 1, name: 'Slack', type: 'Chat', status: 'Conectado', lastSync: '2 min atrás' },
    { id: 2, name: 'WhatsApp Business', type: 'Chat', status: 'Conectado', lastSync: '5 min atrás' },
    { id: 3, name: 'Salesforce', type: 'CRM', status: 'Desconectado', lastSync: '1 dia atrás' },
    { id: 4, name: 'Jira', type: 'DevOps', status: 'Conectado', lastSync: '10 min atrás' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Administração do Sistema</h1>
          <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
            <TabsTrigger value="sla">SLA</TabsTrigger>
            <TabsTrigger value="automation">Automação</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Departamentos</h2>
              <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
                <Plus className="h-4 w-4 mr-2" />
                Novo Departamento
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <Card key={dept.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-base">{dept.name}</CardTitle>
                      <p className="text-sm text-gray-600">{dept.description}</p>
                    </div>
                    <Badge variant={dept.isActive ? "default" : "secondary"}>
                      {dept.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={dept.isActive} />
                        <Label>Ativo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sla" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Regras de SLA</h2>
              <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
                <Plus className="h-4 w-4 mr-2" />
                Nova Regra SLA
              </Button>
            </div>
            
            <div className="space-y-4">
              {slaRules.map((rule) => (
                <Card key={rule.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge variant="outline">{rule.department}</Badge>
                          <Badge variant="outline">{rule.priority}</Badge>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>Primeira resposta: {rule.firstResponse}h</span>
                          <span>Resolução: {rule.resolution}h</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={rule.isActive} />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Automações</h2>
              <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
                <Plus className="h-4 w-4 mr-2" />
                Nova Automação
              </Button>
            </div>
            
            <div className="space-y-4">
              {automationRules.map((rule) => (
                <Card key={rule.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Trigger:</strong> {rule.trigger}</p>
                          <p><strong>Condição:</strong> {rule.condition}</p>
                          <p><strong>Ação:</strong> {rule.action}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={rule.isActive} />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Integrações</h2>
              <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
                <Plus className="h-4 w-4 mr-2" />
                Nova Integração
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <p className="text-sm text-gray-600">{integration.type}</p>
                    </div>
                    <Badge variant={integration.status === 'Conectado' ? "default" : "secondary"}>
                      {integration.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Última sync: {integration.lastSync}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Permissões do Sistema</h2>
              <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
                <Plus className="h-4 w-4 mr-2" />
                Nova Permissão
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Cliente', 'Consultoria', 'Agente', 'Gestor', 'Administrador'].map((role) => (
                <Card key={role}>
                  <CardHeader>
                    <CardTitle className="text-base">{role}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Visualizar tickets', 'Criar tickets', 'Editar tickets', 'Deletar tickets', 'Gerenciar usuários'].map((permission) => (
                        <div key={permission} className="flex items-center justify-between">
                          <Label className="text-sm">{permission}</Label>
                          <Switch />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome da Empresa</Label>
                    <Input defaultValue="DWU" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email de Suporte</Label>
                    <Input defaultValue="support@dwu.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Fuso Horário</Label>
                    <Select defaultValue="america/sao_paulo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america/sao_paulo">América/São Paulo</SelectItem>
                        <SelectItem value="america/new_york">América/Nova York</SelectItem>
                        <SelectItem value="europe/london">Europa/Londres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Notificações por Email</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Notificações Push</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Alertas de SLA</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Relatórios Automáticos</Label>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}