
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        status: {
          in: ['open', 'in_progress']
        }
      },
      include: {
        sla: true,
        comments: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 1
        }
      }
    })

    const slaStatuses = tickets.map(ticket => {
      const createdAt = new Date(ticket.createdAt)
      const now = new Date()
      const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

      let status: 'within' | 'warning' | 'breached' = 'within'
      let responseTimeRemaining = 0
      let resolutionTimeRemaining = 0

      if (ticket.sla) {
        const responseThreshold = ticket.sla.firstResponseTime / 60 // convert to hours
        const resolutionThreshold = ticket.sla.resolutionTime / 60 // convert to hours
        
        // Response time status
        if (!ticket.firstResponseAt) {
          responseTimeRemaining = Math.max(0, responseThreshold - hoursSinceCreated)
          if (hoursSinceCreated >= responseThreshold) {
            status = 'breached'
          } else if (hoursSinceCreated >= responseThreshold * 0.8) {
            status = 'warning'
          }
        }

        // Resolution time status
        resolutionTimeRemaining = Math.max(0, resolutionThreshold - hoursSinceCreated)
        if (hoursSinceCreated >= resolutionThreshold && ticket.status !== 'resolved') {
          status = 'breached'
        } else if (hoursSinceCreated >= resolutionThreshold * 0.8 && ticket.status !== 'resolved') {
          if (status !== 'breached') status = 'warning'
        }
      }

      return {
        ticketId: ticket.id,
        status,
        responseTimeRemaining: Math.round(responseTimeRemaining * 60), // convert back to minutes
        resolutionTimeRemaining: Math.round(resolutionTimeRemaining * 60), // convert back to minutes
        isPaused: false, // TODO: implement pause functionality
        pauseReason: undefined
      }
    })

    return NextResponse.json(slaStatuses)
  } catch (error) {
    console.error('Error fetching SLA status:', error)
    return NextResponse.json({ error: 'Failed to fetch SLA status' }, { status: 500 })
  }
}
