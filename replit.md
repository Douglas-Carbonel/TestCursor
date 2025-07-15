# HelpDesk Pro - Ticket Management System

## Overview

HelpDesk Pro is a full-stack ticket management system built with React, Express.js, and PostgreSQL. The application provides a comprehensive solution for managing support tickets, with features for creating, tracking, and resolving customer issues. It includes a modern dashboard, user management, and a complete ticket lifecycle management system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware

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