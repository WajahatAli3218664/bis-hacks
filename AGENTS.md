# AGENTS.md - Todo App Development Guide

## Purpose
This project uses **Spec-Driven Development** with Claude Code. All implementations must follow the specs in `/specs` folder.

## Project Structure
```
/specs/overview.md - Project overview
/specs/features/ - Feature specifications
/specs/api/ - API endpoint specs
/specs/database/ - Database schema
/specs/ui/ - UI component specs
/frontend - Next.js app (Purple theme)
/backend - FastAPI server
```

## Development Workflow
1. Read relevant spec from `/specs`
2. Implement according to spec
3. Follow purple theme (#9333EA)
4. Test functionality
5. Update spec if requirements change

## Tech Stack Rules
- **Frontend**: Next.js 15 App Router, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI, SQLModel, Neon PostgreSQL
- **Auth**: Better Auth with JWT
- **AI**: OpenAI Agents SDK, MCP SDK, ChatKit
- **Theme**: Purple (#9333EA) as primary color

## Code Standards
- Use TypeScript for frontend
- Use async/await for all async operations
- Follow REST API conventions
- All database queries through SQLModel
- Purple theme throughout UI
- Smooth animations and transitions

## Phase 2 Requirements
- Task CRUD with REST API
- User authentication
- Purple-themed responsive UI
- Neon PostgreSQL database

## Phase 3 Requirements
- AI chatbot interface (ChatKit)
- MCP server with 5 tools
- Natural language task management
- Stateless chat endpoint
- Conversation persistence

## Agent Behavior
- Always reference spec files
- Follow purple theme strictly
- Implement only what specs define
- Ask for clarification if spec is unclear
- Update specs if requirements change
