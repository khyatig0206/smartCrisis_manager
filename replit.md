# Crisis Manager Emergency Alert System

## Overview

Crisis Manager is a full-stack emergency alert application built with React frontend and Express backend. The system allows users to trigger emergency alerts through multiple methods (keyboard shortcuts, voice commands, or manual buttons) and automatically notifies emergency contacts. The application features a dark theme with a modern UI, built using shadcn/ui components and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom crisis management theme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple
- **Development**: TSX for TypeScript execution in development

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type safety across frontend/backend
- **Database Configuration**: Environment-based with `DATABASE_URL`
- **Migration Management**: Drizzle Kit for schema migrations

## Key Components

### Database Schema
- **Users**: Basic authentication with username/password
- **Emergency Contacts**: Multiple contacts per user with relationship info
- **Alert Logs**: Complete audit trail of all emergency alerts
- **User Settings**: Customizable AI behavior, themes, and preferences

### Emergency Alert System
- **Trigger Methods**: 
  - Keyboard shortcuts (rapid key presses)
  - Voice commands ("help me", "emergency")
  - Manual button activation
- **Location Services**: Browser geolocation integration
- **Alert Dispatch**: Automated notification to emergency contacts
- **Status Tracking**: Real-time alert status monitoring

### User Interface
- **Dashboard**: Central hub with system status and emergency controls
- **Settings Sections**: Modular configuration for AI, gestures, automation, etc.
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Dark Theme**: Crisis-focused color scheme with accent colors

## Data Flow

1. **Alert Triggering**: User activates emergency through keyboard, voice, or button
2. **Location Capture**: System automatically captures GPS coordinates
3. **Contact Notification**: Alert sent to all configured emergency contacts
4. **Audit Logging**: Complete record of alert details and status
5. **Status Updates**: Real-time feedback to user on alert delivery

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Components**: Extensive Radix UI component library
- **Utilities**: date-fns, class-variance-authority, clsx
- **Development**: Vite plugins for error overlay and debugging

### Backend Dependencies
- **Core**: Express.js, TypeScript execution (tsx)
- **Database**: Drizzle ORM, Neon Database client, PostgreSQL session store
- **Build**: esbuild for production bundling
- **Validation**: Zod schema validation shared between client/server

### Development Tools
- **shadcn/ui**: Component library with New York style variant
- **Tailwind CSS**: Utility-first styling with custom theme
- **PostCSS**: CSS processing with autoprefixer
- **TypeScript**: Full type safety across the stack

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: `npm run dev` with hot reloading via Vite
- **Production**: `npm run build && npm run start`
- **Database**: Requires `DATABASE_URL` environment variable

### Replit Integration
- **Auto-deployment**: Configured for Replit's autoscale deployment
- **Port Configuration**: Development on 5000, production on 80
- **Module Requirements**: Node.js 20, web server, PostgreSQL 16

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 22, 2025. Initial setup