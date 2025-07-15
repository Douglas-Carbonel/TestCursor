import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        customer: true,
        assignee: true,
        comments: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, assigneeId, priority } = body

    const ticket = await prisma.ticket.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        ...(status && { status }),
        ...(assigneeId && { assigneeId }),
        ...(priority && { priority }),
        updatedAt: new Date()
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
    console.error('Error updating ticket:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}