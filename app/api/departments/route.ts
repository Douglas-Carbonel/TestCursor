
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            tickets: true,
            slas: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, isActive } = body

    const department = await prisma.department.create({
      data: {
        name,
        description,
        isActive
      }
    })

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 })
  }
}
