'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { TicketWithRelations } from '@/lib/types'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('All Tickets')

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesFilter = true
    switch (activeFilter) {
      case 'New':
        matchesFilter = ticket.status === 'open'
        break
      case 'On-Going':
        matchesFilter = ticket.status === 'in_progress'
        break
      case 'Resolved':
        matchesFilter = ticket.status === 'resolved'
        break
      case 'All Tickets':
      default:
        matchesFilter = true
    }
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-orange-100 text-orange-600'
      case 'in_progress': return 'bg-yellow-100 text-yellow-600'
      case 'resolved': return 'bg-green-100 text-green-600'
      case 'closed': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      case 'medium':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      case 'low':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'open': return 'New Tickets'
      case 'in_progress': return 'On-Going Tickets'
      case 'resolved': return 'Resolved Tickets'
      case 'closed': return 'Closed'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `Posted at ${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}`
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tickets</h1>
        
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for tickets"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Select Priority</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">This Week</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              New Ticket
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-8 border-b border-gray-200">
          {['All Tickets', 'New', 'On-Going', 'Resolved'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeFilter === filter
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {filter}
              {filter !== 'All Tickets' && (
                <div className="inline-flex items-center ml-2">
                  <div className={`w-2 h-2 rounded-full ${
                    filter === 'New' ? 'bg-orange-500' :
                    filter === 'On-Going' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getPriorityIcon(ticket.priority)}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Ticket# {new Date().getFullYear()}-CS{ticket.id.toString().padStart(3, '0')}
                  </h3>
                  <h4 className="text-base font-medium text-gray-900 mb-2">
                    {ticket.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {ticket.customer?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{ticket.customer?.name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className="text-xs text-gray-500">
                  {formatDate(ticket.createdAt)}
                </span>
                <Link href={`/tickets/${ticket.id}`}>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    Open Ticket
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No tickets found
          </div>
          <p className="text-gray-400 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}