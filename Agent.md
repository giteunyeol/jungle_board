# Agent Context: AI Board Project

## Purpose

This project is a personal assignment to build an AI-powered board application.
The goal is to implement the frontend, backend, database, and AI application features directly, not as a team project.

The assignment focuses on using commercial LLMs to build a real service-level AI web application, based on prior experience studying and building LLM models.

## Selected Tech Stack

Frontend:

- React
- TypeScript
- Vite
- Zustand
- React Query

Backend:

- NestJS
- TypeScript
- TypeORM

Database:

- PostgreSQL

Planned AI-related technologies:

- Commercial LLM API
- RAG
- MCP
- AI Agent with function calling and loop/state control

## Current Project Structure

Expected structure:

```txt
Board/
  frontend/
  backend/
  Agent.md
```

Frontend runs with:

```bash
npm run dev
```

Backend runs with:

```bash
npm run start:dev
```

PostgreSQL runs as a background service through Homebrew.

## Assignment Requirements

### Required User Features

- Sign up
- Login
- Post CRUD
- Comments
- Tags
- Pagination
- Search

### Required AI Features

- RAG-based feature
- MCP-based feature
- AI Agent-based feature

## RAG Requirements

RAG connects private or internal data with an LLM.

Things to consider:

- Data source integration
- Embedding model suitable for the chosen LLM
- Vector DB choice
- Possible vector DB options:
  - Pinecone
  - FAISS
  - ChromaDB
  - PostgreSQL pgvector
- Possible RAG frameworks:
  - LangChain
  - LlamaIndex
  - Haystack

Possible feature ideas:

- Similar post recommendation and summary
- Knowledge-base Q&A bot
- Duplicate post prevention alert
- Board history trend report
- Multilingual knowledge search and translation

## MCP Requirements

MCP lets an LLM call external systems.

Things to consider:

- MCP server implementation
- JSON-RPC request/response handling
- At least one real external service integration
- API key and permission management strategy

Possible feature ideas:

- Real-time external data posting
- Local file analysis and sharing
- Internal system integration board
- Smart media embedding from URLs
- Automatic DB normalization and tagging

## AI Agent Requirements

The agent should manage a reasoning loop where it chooses and executes tools.

Things to consider:

- Function calling
- Memory/state management
- LangGraph or similar structure
- Infinite loop prevention
- Error handling

Possible feature ideas:

- Autonomous moderator
- Debate/discussion mediator
- Personalized content curator
- Content expansion assistant
- Event/campaign planning agent

## Submission Requirements

Required deliverables:

- Program source code
- README.md

README.md should include:

1. Project overview
2. Main implemented features
3. Overall architecture
4. AI feature architecture and technology details
   - RAG
   - MCP
   - Agent
5. Demo
   - At least one screenshot
6. Retrospective, limitations, and improvement ideas

## Current Development Plan

Build the project step by step in this order:

1. Set up frontend and backend project structure
2. Connect NestJS backend to PostgreSQL
3. Implement User entity
4. Implement sign up and login
5. Implement JWT authentication
6. Connect React auth screens to backend APIs
7. Implement posts CRUD
8. Implement comments
9. Implement tags
10. Implement pagination
11. Implement search
12. Implement RAG feature
13. Implement MCP feature
14. Implement AI Agent feature
15. Write README and capture demo screenshot

## Already Completed

- React frontend project created with Vite
- NestJS backend project created
- PostgreSQL installed and started
- PostgreSQL database named `board` created
- TypeORM-related packages installed:
  - `@nestjs/typeorm`
  - `typeorm`
  - `pg`
- `TypeOrmModule.forRoot` configured in `backend/src/app.module.ts`
- User entity creation started at `backend/src/users/user.entity.ts`

## Learning Style / Collaboration Notes

Explain one step at a time.

For each command or code block, explain:

- What it does
- Why it is needed
- What should happen after running it

Avoid giving too many future steps at once.

The user is learning React, NestJS, PostgreSQL, TypeORM, and TypeScript concepts while implementing the project.

