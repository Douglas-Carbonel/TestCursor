
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, isActive } = body
    const departmentId = parseInt(params.id)

    const department = await prisma.department.update({
      where: { id: departmentId },
      data: {
        name,
        description,
        isActive
      }
    })

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const departmentId = parseInt(params.id)

    // Check if department has associated tickets or SLAs
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        _count: {
          select: {
            tickets: true,
            slas: true
          }
        }
      }
    })

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    if (department._count.tickets > 0 || department._count.slas > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department with associated tickets or SLAs' }, 
        { status: 400 }
      )
    }

    await prisma.department.delete({
      where: { id: departmentId }
    })

    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 })
  }
}
