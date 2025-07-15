'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Ticket, Users, Settings, Bell, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Chamados', href: '/tickets', icon: Ticket },
  { name: 'Usuários', href: '/users', icon: Users },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                HelpDesk Pro
              </span>
            </Link>

            <div className="flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href === '/tickets' && pathname.startsWith('/tickets'))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                    )}
                  >
                    <Icon className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{item.name}</span>
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 rounded-xl transition-all duration-300">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 rounded-xl transition-all duration-300 relative">
              <Bell className="h-5 w-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bem-vindo, <span className="font-medium text-gray-900 dark:text-white">Usuário</span>
              </div>
              <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 rounded-xl transition-all duration-300">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}