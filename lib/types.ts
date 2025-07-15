import { User, Ticket, Comment } from '@prisma/client'

export interface TicketWithRelations extends Ticket {
  customer: User
  assignee?: User | null
  comments: (Comment & { user: User })[]
}

export interface CommentWithUser extends Comment {
  user: User
}

export interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  byPriority: { priority: string; count: number }[]
}