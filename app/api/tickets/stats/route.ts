import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [total, open, inProgress, resolved, closed, byPriority] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'open' } }),
      prisma.ticket.count({ where: { status: 'in_progress' } }),
      prisma.ticket.count({ where: { status: 'resolved' } }),
      prisma.ticket.count({ where: { status: 'closed' } }),
      prisma.ticket.groupBy({
        by: ['priority'],
        _count: {
          id: true
        }
      })
    ])

    const priorityStats = byPriority.reduce((acc, item) => {
      acc[item.priority] = item._count.id
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      total,
      open,
      inProgress,
      resolved,
      closed,
      byPriority: priorityStats
    })
  } catch (error) {
    console.error('Error fetching ticket stats:', error)
    return NextResponse.json({ error: 'Failed to fetch ticket stats' }, { status: 500 })
  }
}