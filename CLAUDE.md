# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Glimmer** is a modern React-based chat application with real-time messaging capabilities, built using TypeScript and Vite.

## Technology Stack

- **React 19.2.0** - UI library with modern hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library with Radix UI primitives
- **Socket.io-client** - Real-time WebSocket communication
- **Axios** - HTTP client with auth interceptors
- **TanStack Query** - Server state management

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production (runs TypeScript check + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Project Architecture

### Core Structure
- `src/components/` - Reusable UI components (shadcn/ui base components in `ui/` subdirectory)
- `src/contexts/` - React contexts (AuthContext for global auth state)
- `src/pages/` - Route components, each in their own subdirectory
- `src/services/` - API layer (axios.ts, apiService.ts, socketService.ts)
- `src/hooks/` - Custom React hooks (useSocketChat.ts for real-time chat)
- `src/lib/` - Utilities (clsx/tailwind-merge for className handling)

### Authentication Architecture
- JWT tokens stored in localStorage
- AuthContext manages login/logout state globally
- Axios interceptors automatically add Bearer tokens to API requests
- Automatic redirect to login on 401 responses

### Real-time Communication
- Socket.io integration for chat functionality
- Separate services for private messages and group rooms
- TypeScript interfaces define chat data structures

### Routing & Navigation
- React Router v7 for client-side routing
- File-based routing pattern in pages directory
- Sidebar navigation with responsive mobile support

## Path Aliases

Use `@/*` to reference the `src/` directory:
```typescript
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
```

## Key Implementation Details

### API Configuration
- Base URL configured in `src/services/axios.ts`
- All API calls go through the configured Axios instance with auth interceptors

### Component Styling
- Uses Class Variance Authority (CVA) for component variants
- Tailwind CSS for utility-first styling
- Consistent design system with shadcn/ui components

### State Management Pattern
- AuthContext for global authentication state
- TanStack Query for server state
- Local React state for UI-specific state

### Default Server
- Application expects backend server at `localhost:5000`
- Both REST API endpoints and Socket.io connection target this server