'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Search, 
  MessageSquare, 
  Mail, 
  Zap, 
  Save,
  X
} from 'lucide-react'

interface Template {
  id: string
  name: string
  subject?: string
  content: string
  type: 'quick_reply' | 'auto_response' | 'email_template'
  category: string
  isActive: boolean
  usageCount: number
  createdAt: string
  createdBy: string
}

const initialTemplates: Template[] = [
  {
    id: '1',
    name: 'Confirmação de Recebimento',
    subject: 'Ticket Recebido - #{ticket_number}',
    content: 'Olá {customer_name},\n\nSeu ticket foi recebido com sucesso e está sendo analisado pela nossa equipe.\n\nNúmero do ticket: #{ticket_number}\nStatus: Em análise\n\nEm breve entraremos em contato.\n\nAtenciosamente,\nEquipe de Suporte',
    type: 'auto_response',
    category: 'Geral',
    isActive: true,
    usageCount: 145,
    createdAt: '2025-01-10',
    createdBy: 'Admin'
  },
  {
    id: '2',
    name: 'Solicitação de Informações',
    content: 'Olá,\n\nPara prosseguir com a análise do seu ticket, precisamos de algumas informações adicionais:\n\n- Descreva os passos que levaram ao problema\n- Informe a versão do sistema que está usando\n- Anexe prints ou logs, se possível\n\nAguardo seu retorno.\n\nAtenciosamente,\n{agent_name}',
    type: 'quick_reply',
    category: 'Técnico',
    isActive: true,
    usageCount: 89,
    createdAt: '2025-01-08',
    createdBy: 'Maria Santos'
  },
  {
    id: '3',
    name: 'Resolução de Problema',
    content: 'Olá {customer_name},\n\nSeu problema foi resolvido com sucesso!\n\nResumo da solução:\n{solution_summary}\n\nCaso tenha alguma dúvida, fique à vontade para entrar em contato.\n\nAtenciosamente,\n{agent_name}',
    type: 'quick_reply',
    category: 'Resolução',
    isActive: true,
    usageCount: 67,
    createdAt: '2025-01-05',
    createdBy: 'Pedro Oliveira'
  },
  {
    id: '4',
    name: 'Escalonamento para Supervisor',
    subject: 'Ticket Escalonado - #{ticket_number}',
    content: 'Prezado supervisor,\n\nO ticket #{ticket_number} foi escalonado para sua análise.\n\nMotivo: {escalation_reason}\nCliente: {customer_name}\nDescrição: {ticket_description}\n\nPor favor, priorize a análise deste caso.\n\nAtenciosamente,\n{agent_name}',
    type: 'email_template',
    category: 'Escalonamento',
    isActive: true,
    usageCount: 23,
    createdAt: '2025-01-03',
    createdBy: 'Ana Souza'
  }
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [showNewTemplate, setShowNewTemplate] = useState(false)

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'quick_reply' as const,
    category: 'Geral'
  })

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || template.type === selectedType
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quick_reply': return <MessageSquare className="h-4 w-4" />
      case 'auto_response': return <Zap className="h-4 w-4" />
      case 'email_template': return <Mail className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quick_reply': return 'Resposta Rápida'
      case 'auto_response': return 'Resposta Automática'
      case 'email_template': return 'Template Email'
      default: return type
    }
  }

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      ))
      setEditingTemplate(null)
    } else {
      // Create new template
      const template: Template = {
        id: Date.now().toString(),
        ...newTemplate,
        isActive: true,
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Current User'
      }
      setTemplates([...templates, template])
      setNewTemplate({
        name: '',
        subject: '',
        content: '',
        type: 'quick_reply',
        category: 'Geral'
      })
      setShowNewTemplate(false)
    }
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
  }

  const handleCopyTemplate = (template: Template) => {
    navigator.clipboard.writeText(template.content)
    alert('Template copiado para a área de transferência!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Templates e Respostas Rápidas</h1>
          <Button 
            className="bg-dwu-orange hover:bg-dwu-orange-dark"
            onClick={() => setShowNewTemplate(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="quick_reply">Resposta Rápida</SelectItem>
              <SelectItem value="auto_response">Resposta Automática</SelectItem>
              <SelectItem value="email_template">Template Email</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Geral">Geral</SelectItem>
              <SelectItem value="Técnico">Técnico</SelectItem>
              <SelectItem value="Resolução">Resolução</SelectItem>
              <SelectItem value="Escalonamento">Escalonamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* New/Edit Template Modal */}
        {(showNewTemplate || editingTemplate) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {editingTemplate ? 'Editar Template' : 'Novo Template'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setEditingTemplate(null)
                    setShowNewTemplate(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Template</Label>
                    <Input
                      id="name"
                      value={editingTemplate?.name || newTemplate.name}
                      onChange={(e) => editingTemplate 
                        ? setEditingTemplate({...editingTemplate, name: e.target.value})
                        : setNewTemplate({...newTemplate, name: e.target.value})
                      }
                      placeholder="Nome do template"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={editingTemplate?.type || newTemplate.type}
                      onValueChange={(value: any) => editingTemplate
                        ? setEditingTemplate({...editingTemplate, type: value})
                        : setNewTemplate({...newTemplate, type: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick_reply">Resposta Rápida</SelectItem>
                        <SelectItem value="auto_response">Resposta Automática</SelectItem>
                        <SelectItem value="email_template">Template Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={editingTemplate?.category || newTemplate.category}
                    onChange={(e) => editingTemplate
                      ? setEditingTemplate({...editingTemplate, category: e.target.value})
                      : setNewTemplate({...newTemplate, category: e.target.value})
                    }
                    placeholder="Categoria"
                  />
                </div>

                {((editingTemplate?.type === 'email_template') || 
                  (newTemplate.type === 'email_template')) && (
                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={editingTemplate?.subject || newTemplate.subject}
                      onChange={(e) => editingTemplate
                        ? setEditingTemplate({...editingTemplate, subject: e.target.value})
                        : setNewTemplate({...newTemplate, subject: e.target.value})
                      }
                      placeholder="Assunto do email"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={editingTemplate?.content || newTemplate.content}
                    onChange={(e) => editingTemplate
                      ? setEditingTemplate({...editingTemplate, content: e.target.value})
                      : setNewTemplate({...newTemplate, content: e.target.value})
                    }
                    placeholder="Conteúdo do template..."
                    rows={8}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Variáveis disponíveis: {'{customer_name}'}, {'{ticket_number}'}, {'{agent_name}'}, {'{ticket_description}'}
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingTemplate(null)
                      setShowNewTemplate(false)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-dwu-orange hover:bg-dwu-orange-dark"
                    onClick={handleSaveTemplate}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Templates List */}
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(template.type)}
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <Badge variant="outline">{getTypeLabel(template.type)}</Badge>
                      <Badge variant="secondary">{template.category}</Badge>
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    {template.subject && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Assunto:</strong> {template.subject}
                      </p>
                    )}
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {template.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Usado {template.usageCount} vezes</span>
                      <span>Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span>Por {template.createdBy}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
                <p className="text-gray-600">Tente ajustar sua pesquisa ou criar um novo template</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}