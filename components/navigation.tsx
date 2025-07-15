'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Ticket, Users, Settings, Bell, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Officals', href: '/officials', icon: Settings },
  { name: 'Site Settings', href: '/settings', icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Ticket className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            TICKET LEAD
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <button className="p-1">
            <Bell className="h-4 w-4 text-gray-500" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Welcome! John Smith</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">AR</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Alex Robert</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href === '/tickets' && pathname.startsWith('/tickets'))

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}