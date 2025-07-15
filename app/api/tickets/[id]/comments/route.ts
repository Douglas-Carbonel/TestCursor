import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { content, userId, isInternal } = body

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        ticketId: parseInt(params.id),
        isInternal: isInternal || false
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}