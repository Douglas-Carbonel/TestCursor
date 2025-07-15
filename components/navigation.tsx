
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Wrench, 
  Ticket, 
  Users, 
  Shield, 
  Settings,
  ChevronDown,
  Database,
  Zap,
  Clock,
  MessageSquare,
  Share,
  BookOpen,
  Palette,
  Plus,
  Layout,
  List,
  UserCheck,
  Users2,
  Building2,
  ShieldCheck,
  Key,
  User,
  Accessibility
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: BarChart3,
    description: 'Relatórios e métricas'
  },
  { 
    name: 'Ferramentas', 
    icon: Wrench,
    submenu: [
      { name: 'Base de Conhecimento', href: '/knowledge-base', icon: BookOpen },
      { name: 'Integrações', href: '/integrations', icon: Share },
      { name: 'Gatilhos', href: '/triggers', icon: Zap },
      { name: 'SLA', href: '/sla', icon: Clock },
      { name: 'Visual (Site)', href: '/site-config', icon: Palette },
      { name: 'Horário de Atendimento', href: '/business-hours', icon: Clock },
      { name: 'Respostas Automáticas', href: '/auto-responses', icon: MessageSquare },
      { name: 'Regras de Encaminhamento', href: '/routing-rules', icon: Share }
    ]
  },
  { 
    name: 'Chamados', 
    icon: Ticket,
    submenu: [
      { name: 'Novo Chamado', href: '/tickets/new', icon: Plus },
      { name: 'Kanban', href: '/kanban', icon: Layout },
      { name: 'Lista de Chamados', href: '/tickets', icon: List }
    ]
  },
  { 
    name: 'Usuários', 
    icon: Users,
    submenu: [
      { name: 'Colaboradores', href: '/users/staff', icon: UserCheck },
      { name: 'Grupos', href: '/users/groups', icon: Users2 },
      { name: 'Clientes', href: '/users/customers', icon: Building2 },
      { name: 'Setores', href: '/users/departments', icon: Building2 }
    ]
  },
  { 
    name: 'Perfis', 
    icon: Shield,
    submenu: [
      { name: 'Perfis de Usuário', href: '/profiles', icon: ShieldCheck },
      { name: 'Permissões', href: '/permissions', icon: Key },
      { name: 'Autorizações', href: '/authorizations', icon: Shield }
    ]
  },
  { 
    name: 'Configuração', 
    icon: Settings,
    submenu: [
      { name: 'Dados do Usuário', href: '/config/user-data', icon: User },
      { name: 'Acessibilidade', href: '/config/accessibility', icon: Accessibility }
    ]
  }
]

export default function Navigation() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const isMenuOpen = (menuName: string) => openMenus.includes(menuName)

  const isActiveSubmenuItem = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const hasActiveSubmenuItem = (submenu: any[]) => {
    return submenu.some(item => isActiveSubmenuItem(item.href))
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-dwu-orange">
            HelpDesk Pro
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const hasSubmenu = 'submenu' in item
            const isMenuActive = hasSubmenu && hasActiveSubmenuItem(item.submenu)
            const isOpen = isMenuOpen(item.name)

            if (!hasSubmenu) {
              // Single menu item
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-dwu-orange-light text-dwu-orange-dark"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            }

            // Menu with submenu
            return (
              <li key={item.name}>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isMenuActive
                      ? "bg-dwu-orange-light text-dwu-orange-dark"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isOpen ? "rotate-180" : ""
                    )} 
                  />
                </button>
                
                {isOpen && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {item.submenu.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isActive = isActiveSubmenuItem(subItem.href)
                      
                      return (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                              isActive
                                ? "bg-dwu-orange text-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            )}
                          >
                            <SubIcon className="h-3 w-3" />
                            <span>{subItem.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          <Link
            href="/account"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <User className="h-4 w-4" />
            <span>Minha Conta</span>
          </Link>
          <Link
            href="/logout"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Sair</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
