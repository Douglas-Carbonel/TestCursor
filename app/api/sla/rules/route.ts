
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rules = await prisma.sLA.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching SLA rules:', error)
    return NextResponse.json({ error: 'Failed to fetch SLA rules' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      departmentId,
      priority,
      customerType,
      firstResponseTime,
      resolutionTime,
      isActive,
      businessHoursOnly
    } = body

    const rule = await prisma.sLA.create({
      data: {
        name,
        description,
        departmentId,
        priority,
        customerType,
        firstResponseTime,
        resolutionTime,
        isActive,
        businessHoursOnly
      },
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error creating SLA rule:', error)
    return NextResponse.json({ error: 'Failed to create SLA rule' }, { status: 500 })
  }
}
