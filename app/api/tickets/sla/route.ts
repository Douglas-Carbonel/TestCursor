
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const consultancy = searchParams.get('consultancy')
    
    const whereClause = consultancy && consultancy !== 'all' 
      ? { customer: { company: consultancy } }
      : {}

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        customer: true,
        comments: {
          orderBy: { createdAt: 'asc' },
          take: 1
        }
      }
    })

    // Calculate SLA metrics
    const now = new Date()
    let withinSLA = 0
    let atRisk = 0
    let breached = 0
    let totalResponseTime = 0
    let totalResolutionTime = 0
    let responseTimes: number[] = []
    let resolutionTimes: number[] = []

    tickets.forEach(ticket => {
      const createdAt = new Date(ticket.createdAt)
      const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
      
      // SLA thresholds (hours)
      const slaThreshold = ticket.priority === 'high' ? 4 : 
                          ticket.priority === 'medium' ? 8 : 24
      const warningThreshold = slaThreshold * 0.8

      if (ticket.status === 'closed' || ticket.status === 'resolved') {
        const resolutionTime = ticket.updatedAt ? 
          (new Date(ticket.updatedAt).getTime() - createdAt.getTime()) / (1000 * 60 * 60) : 0
        resolutionTimes.push(resolutionTime)
        
        if (resolutionTime <= slaThreshold) {
          withinSLA++
        } else {
          breached++
        }
      } else {
        if (hoursSinceCreated <= warningThreshold) {
          withinSLA++
        } else if (hoursSinceCreated <= slaThreshold) {
          atRisk++
        } else {
          breached++
        }
      }

      // Response time (time to first comment)
      if (ticket.comments.length > 0) {
        const firstResponse = new Date(ticket.comments[0].createdAt)
        const responseTime = (firstResponse.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
        responseTimes.push(responseTime)
      }
    })

    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0

    const averageResolutionTime = resolutionTimes.length > 0 
      ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length 
      : 0

    return NextResponse.json({
      withinSLA,
      atRisk,
      breached,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      averageResolutionTime: Math.round(averageResolutionTime * 100) / 100
    })
  } catch (error) {
    console.error('Error fetching SLA metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch SLA metrics' }, { status: 500 })
  }
}
