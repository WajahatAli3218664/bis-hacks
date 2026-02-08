# AI Todo App - Hackathon Phase 2 & 3

AI-powered todo application with chatbot interface and beautiful purple theme.

## Features

### Phase 2 - Full-Stack Web App
- ✅ Task CRUD operations
- ✅ User authentication (Better Auth)
- ✅ Purple-themed responsive UI
- ✅ Neon PostgreSQL database

### Phase 3 - AI Chatbot
- ✅ Natural language task management
- ✅ OpenAI ChatKit interface
- ✅ MCP server with 5 tools
- ✅ Conversation persistence

## Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLModel, Neon PostgreSQL
- **Auth**: Better Auth with JWT
- **AI**: OpenAI Agents SDK, MCP SDK, ChatKit
- **Theme**: Purple (#9333EA)

## Setup

### Prerequisites
- Node.js 18+
- Python 3.13+
- Neon PostgreSQL account

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://...
GROQ_API_KEY=your_key
JWT_SECRET=your_secret
QDRANT_URL=your_url
QDRANT_API_KEY=your_key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_key
```

### Installation

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Usage

### Web Interface
1. Sign up / Login
2. Create tasks using the form
3. View, edit, delete tasks
4. Mark tasks as complete

### Chatbot Interface
1. Click on Chat tab
2. Type natural language commands:
   - "Add task to buy groceries"
   - "Show my pending tasks"
   - "Mark task 3 as complete"
   - "Delete the meeting task"

## Deployment

### Backend (Vercel)
```bash
cd backend
vercel --prod
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

## Specs
All specifications are in `/specs` folder:
- `/specs/overview.md` - Project overview
- `/specs/features/` - Feature specifications
- `/specs/api/` - API documentation
- `/specs/database/` - Database schema
- `/specs/ui/` - UI components

## Development
This project uses Spec-Driven Development with Claude Code. See `AGENTS.md` for guidelines.
