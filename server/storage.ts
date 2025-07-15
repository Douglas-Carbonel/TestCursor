import { users, tickets, comments, type User, type InsertUser, type Ticket, type InsertTicket, type Comment, type InsertComment, type TicketWithRelations } from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and, or, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  getAgents(): Promise<User[]>;

  // Ticket operations
  getTicket(id: number): Promise<TicketWithRelations | undefined>;
  getTickets(filters?: {
    status?: string;
    priority?: string;
    assigneeId?: number;
    customerId?: number;
    search?: string;
  }): Promise<TicketWithRelations[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket>;
  deleteTicket(id: number): Promise<void>;
  getTicketStats(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    byPriority: { priority: string; count: number }[];
  }>;

  // Comment operations
  getTicketComments(ticketId: number): Promise<(Comment & { user: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.name);
  }

  async getAgents(): Promise<User[]> {
    return await db.select().from(users).where(or(eq(users.role, "agent"), eq(users.role, "admin"))).orderBy(users.name);
  }

  async getTicket(id: number): Promise<TicketWithRelations | undefined> {
    const [ticket] = await db
      .select()
      .from(tickets)
      .leftJoin(users, eq(tickets.customerId, users.id))
      .leftJoin(users, eq(tickets.assigneeId, users.id))
      .where(eq(tickets.id, id));

    if (!ticket) return undefined;

    const ticketComments = await this.getTicketComments(id);

    return {
      ...ticket.tickets,
      customer: ticket.users!,
      assignee: ticket.users || undefined,
      comments: ticketComments,
    };
  }

  async getTickets(filters?: {
    status?: string;
    priority?: string;
    assigneeId?: number;
    customerId?: number;
    search?: string;
  }): Promise<TicketWithRelations[]> {
    let query = db
      .select({
        ticket: tickets,
        customer: users,
        assignee: users,
      })
      .from(tickets)
      .leftJoin(users, eq(tickets.customerId, users.id))
      .leftJoin(users, eq(tickets.assigneeId, users.id));

    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(tickets.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(tickets.priority, filters.priority));
    }
    if (filters?.assigneeId) {
      conditions.push(eq(tickets.assigneeId, filters.assigneeId));
    }
    if (filters?.customerId) {
      conditions.push(eq(tickets.customerId, filters.customerId));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(tickets.title, `%${filters.search}%`),
          ilike(tickets.description, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(desc(tickets.createdAt));

    return result.map((row) => ({
      ...row.ticket,
      customer: row.customer!,
      assignee: row.assignee || undefined,
      comments: [], // Will be loaded separately if needed
    }));
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const [ticket] = await db
      .insert(tickets)
      .values(insertTicket)
      .returning();
    return ticket;
  }

  async updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket> {
    const [ticket] = await db
      .update(tickets)
      .set({ ...ticketData, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return ticket;
  }

  async deleteTicket(id: number): Promise<void> {
    await db.delete(tickets).where(eq(tickets.id, id));
  }

  async getTicketStats(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    byPriority: { priority: string; count: number }[];
  }> {
    const [totalResult] = await db.select({ count: count() }).from(tickets);
    const [openResult] = await db.select({ count: count() }).from(tickets).where(eq(tickets.status, "open"));
    const [inProgressResult] = await db.select({ count: count() }).from(tickets).where(eq(tickets.status, "in_progress"));
    const [resolvedResult] = await db.select({ count: count() }).from(tickets).where(eq(tickets.status, "resolved"));
    const [closedResult] = await db.select({ count: count() }).from(tickets).where(eq(tickets.status, "closed"));

    const priorityStats = await db
      .select({ priority: tickets.priority, count: count() })
      .from(tickets)
      .groupBy(tickets.priority);

    return {
      total: totalResult.count,
      open: openResult.count,
      inProgress: inProgressResult.count,
      resolved: resolvedResult.count,
      closed: closedResult.count,
      byPriority: priorityStats.map((stat) => ({
        priority: stat.priority,
        count: stat.count,
      })),
    };
  }

  async getTicketComments(ticketId: number): Promise<(Comment & { user: User })[]> {
    const result = await db
      .select()
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.ticketId, ticketId))
      .orderBy(comments.createdAt);

    return result.map((row) => ({
      ...row.comments,
      user: row.users!,
    }));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }
}

export const storage = new DatabaseStorage();
