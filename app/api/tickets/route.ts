import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        customer: true,
        assignee: true,
        comments: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, priority, category, customerId } = body

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        category,
        customerId,
        status: 'open'
      },
      include: {
        customer: true,
        assignee: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}