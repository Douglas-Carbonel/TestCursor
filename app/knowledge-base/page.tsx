'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, BookOpen, ThumbsUp, ThumbsDown, Eye, Edit, Trash2, Filter } from 'lucide-react'

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todas', count: 45 },
    { id: 'technical', name: 'Técnico', count: 18 },
    { id: 'billing', name: 'Faturamento', count: 12 },
    { id: 'account', name: 'Conta', count: 8 },
    { id: 'features', name: 'Funcionalidades', count: 7 }
  ]

  const articles = [
    {
      id: 1,
      title: 'Como configurar autenticação multifator (MFA)',
      category: 'Técnico',
      description: 'Guia completo para configurar MFA em sua conta',
      tags: ['segurança', 'mfa', 'configuração'],
      views: 1234,
      helpful: 89,
      notHelpful: 12,
      isPublic: true,
      lastUpdated: '2025-01-15'
    },
    {
      id: 2,
      title: 'Integração com sistemas CRM',
      category: 'Técnico',
      description: 'Como integrar o sistema com CRMs populares',
      tags: ['integração', 'crm', 'api'],
      views: 856,
      helpful: 67,
      notHelpful: 8,
      isPublic: false,
      lastUpdated: '2025-01-14'
    },
    {
      id: 3,
      title: 'Política de SLA e tempos de resposta',
      category: 'Faturamento',
      description: 'Entenda os níveis de SLA disponíveis',
      tags: ['sla', 'suporte', 'tempo'],
      views: 692,
      helpful: 45,
      notHelpful: 5,
      isPublic: true,
      lastUpdated: '2025-01-13'
    },
    {
      id: 4,
      title: 'Gerenciamento de usuários e permissões',
      category: 'Conta',
      description: 'Como gerenciar usuários e definir permissões',
      tags: ['usuários', 'permissões', 'admin'],
      views: 543,
      helpful: 38,
      notHelpful: 3,
      isPublic: true,
      lastUpdated: '2025-01-12'
    },
    {
      id: 5,
      title: 'Automatizações e regras de negócio',
      category: 'Funcionalidades',
      description: 'Como criar fluxos automatizados para tickets',
      tags: ['automação', 'regras', 'workflow'],
      views: 789,
      helpful: 56,
      notHelpful: 7,
      isPublic: false,
      lastUpdated: '2025-01-11'
    }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           article.category.toLowerCase() === categories.find(c => c.id === selectedCategory)?.name.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  const popularArticles = articles.sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h1>
          <Button className="bg-dwu-orange hover:bg-dwu-orange-dark">
            <Plus className="h-4 w-4 mr-2" />
            Novo Artigo
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar na base de conhecimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-dwu-orange hover:bg-dwu-orange-dark" : ""}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="articles">Artigos</TabsTrigger>
            <TabsTrigger value="popular">Mais Populares</TabsTrigger>
            <TabsTrigger value="manage">Gerenciar</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-dwu-orange cursor-pointer">
                          {article.title}
                        </h3>
                        <Badge variant={article.isPublic ? "default" : "secondary"}>
                          {article.isPublic ? 'Público' : 'Interno'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{article.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views} visualizações
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {article.helpful} úteis
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="h-4 w-4" />
                          {article.notHelpful} não úteis
                        </span>
                        <span>Atualizado em {new Date(article.lastUpdated).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
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

            {filteredArticles.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum artigo encontrado</h3>
                  <p className="text-gray-600">Tente ajustar sua pesquisa ou filtros</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Artigos Mais Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <div key={article.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-dwu-orange rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{article.title}</h4>
                        <p className="text-sm text-gray-600">{article.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{article.views} visualizações</div>
                        <div className="text-sm text-gray-500">{article.helpful} úteis</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total de artigos</span>
                      <span className="font-medium">{articles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Artigos públicos</span>
                      <span className="font-medium">{articles.filter(a => a.isPublic).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Artigos internos</span>
                      <span className="font-medium">{articles.filter(a => !a.isPublic).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total de visualizações</span>
                      <span className="font-medium">{articles.reduce((sum, a) => sum + a.views, 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <div key={category.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{category.name}</span>
                        <Badge variant="outline">{category.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-dwu-orange hover:bg-dwu-orange-dark">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Artigo
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Gerenciar Categorias
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Templates
                    </Button>
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