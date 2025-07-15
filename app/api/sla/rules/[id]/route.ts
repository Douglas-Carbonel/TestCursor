
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const ruleId = parseInt(params.id)

    const rule = await prisma.sLA.update({
      where: { id: ruleId },
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
    console.error('Error updating SLA rule:', error)
    return NextResponse.json({ error: 'Failed to update SLA rule' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ruleId = parseInt(params.id)

    await prisma.sLA.delete({
      where: { id: ruleId }
    })

    return NextResponse.json({ message: 'SLA rule deleted successfully' })
  } catch (error) {
    console.error('Error deleting SLA rule:', error)
    return NextResponse.json({ error: 'Failed to delete SLA rule' }, { status: 500 })
  }
}
