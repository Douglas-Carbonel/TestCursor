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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by</span>
            <select className="text-sm text-dwu-orange border-none bg-transparent">
              <option>Date</option>
              <option>Priority</option>
              <option>Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Latest Tickets Card */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Latest Tickets</h2>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Ticket ID</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Subject</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Created</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td>
                  </tr>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 text-sm text-gray-900">
                        <Link href={`/tickets/${ticket.id}`} className="hover:text-dwu-orange-dark">
                          ABC{ticket.id.toString().padStart(2, '0')}
                        </Link>
                      </td>
                      <td className="py-4 text-sm text-gray-900">Liam Smith</td>
                      <td className="py-4 text-sm text-gray-500">liam@gmail.com</td>
                      <td className="py-4 text-sm text-gray-900">{ticket.title}</td>
                      <td className="py-4 text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} ago
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                            ticket.status === 'open' ? 'bg-blue-400' :
                            ticket.status === 'in_progress' ? 'bg-yellow-400' :
                            ticket.status === 'resolved' ? 'bg-green-400' :
                            'bg-gray-400'
                          }`}></span>
                          {ticket.status === 'open' ? 'New' :
                           ticket.status === 'in_progress' ? 'Open' :
                           ticket.status === 'resolved' ? 'In Progress' : 'Close'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">No tickets found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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