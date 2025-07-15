# HelpDesk Pro - Ticket Management System

## Overview

HelpDesk Pro is a comprehensive ticket management system built with Next.js 15, React 18, and PostgreSQL. The application provides a complete solution for managing support tickets with features for creating, tracking, and resolving customer issues. It includes a modern dashboard, user management, and a complete ticket lifecycle management system with DWU company branding.

## User Preferences

Preferred communication style: Simple, everyday language.
Technology stack: Next.js with React, PostgreSQL with Prisma ORM.
Design style: Clean modern layout with sidebar navigation and DWU orange color scheme (#f97316).

## Recent Changes (January 2025)

- ✅ Successfully migrated from Replit Agent to standard Replit environment
- ✅ Implemented modern sidebar navigation layout matching user requirements
- ✅ Applied DWU company branding with orange color scheme throughout interface
- ✅ Updated dashboard with Overview layout including stats cards, charts, and team member sections
- ✅ Redesigned tickets list page (Requests) with clean table layout
- ✅ Updated ticket detail page with reply form and DWU color scheme
- ✅ All pages now use consistent gray background and white card layouts

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 18 and TypeScript
- **Routing**: Next.js App Router with dynamic routes
- **State Management**: React state and Next.js server components
- **UI Components**: Radix UI with custom shadcn/ui components
- **Styling**: Tailwind CSS with dark mode support
- **API Integration**: Next.js API routes with fetch
- **Build Tool**: Next.js built-in compiler

### Backend Architecture
- **Runtime**: Next.js API routes (serverless functions)
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Prisma ORM
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Try-catch blocks with proper error responses

### Project Structure
The application follows a monorepo structure with clear separation of concerns:
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared types and schemas between frontend and backend

## Key Components

### Database Schema
The system uses three main entities:
- **Users**: Supports multiple roles (user, agent, admin) with authentication
- **Tickets**: Core entity with status tracking, priority levels, and assignment
- **Comments**: Threaded comments system with internal/external visibility

### Authentication & Authorization
- Role-based access control (user, agent, admin)
- Session-based authentication
- User management with secure password handling

### Ticket Management
- Full CRUD operations for tickets
- Status workflow: open → in_progress → resolved → closed
- Priority levels: low, medium, high, critical
- Category system: bug, feature, support, question
- Assignment system for agents
- Comment system with internal notes

### UI Components
- Responsive design with mobile-first approach
- Comprehensive component library using Radix UI primitives
- Dark mode support with CSS variables
- Toast notifications for user feedback
- Modal dialogs for forms and confirmations

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using fetch with TanStack Query
2. Express.js server handles requests with route-based controllers
3. Drizzle ORM manages database operations
4. Response data is cached and managed by React Query

### State Management
- Server state: Managed by TanStack Query with automatic caching
- Form state: React Hook Form with Zod validation
- UI state: React useState and useContext where needed

### Real-time Updates
- Polling-based updates through React Query
- Optimistic updates for better user experience

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **react-hook-form**: Form management
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Build Process
1. Frontend: Vite builds React app to `dist/public/`
2. Backend: esbuild bundles server code to `dist/`
3. Database: Drizzle migrations applied via `db:push`

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (development/production)
- Development uses local database, production uses hosted PostgreSQL

### Production Deployment
- Single Node.js server serving both API and static files
- Express serves React build from `dist/public/`
- API routes prefixed with `/api/`
- Database migrations run automatically on deployment

### Development Workflow
- `npm run dev`: Starts development server with hot reload
- `npm run build`: Creates production build
- `npm run start`: Runs production server
- `npm run db:push`: Applies database schema changes

The application is designed to be deployed on platforms like Replit, Heroku, or similar Node.js hosting services with PostgreSQL database support.