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

1. Finish backend baseline board APIs
2. Connect React auth screens to backend APIs
3. Connect React post list/detail/create/edit/delete screens
4. Connect comments, tags, pagination, and search UI
5. Implement RAG feature
6. Implement MCP feature
7. Implement AI Agent feature
8. Write README and capture demo screenshot

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
- GitHub repository connected and pushed to `https://github.com/giteunyeol/jungle_board.git`

Backend baseline completed:

- User entity and UsersModule/UsersService implemented
- AuthModule/AuthService/AuthController implemented
- Sign up API implemented:
  - `POST /auth/register`
  - Checks duplicate email
  - Hashes password with `bcrypt`
  - Stores `passwordHash`, not raw password
- Login API implemented:
  - `POST /auth/login`
  - Uses `findByEmailWithPasswordHash`
  - Compares raw password with `bcrypt.compare`
  - Returns JWT `accessToken` and basic user info
- Current user API implemented:
  - `GET /auth/me`
  - Reads `Authorization: Bearer <token>`
  - Verifies JWT
  - Looks up current user by `payload.sub`
  - Handles invalid token as `401 Unauthorized`
- `User.passwordHash` uses `@Column({ select: false })`
  - Prevents password hash from leaking in author responses
  - Login-specific query explicitly adds `passwordHash`

Post backend completed:

- Post entity implemented with:
  - `id`
  - `title`
  - `content`
  - `author`
  - `tags`
  - `createdAt`
  - `updatedAt`
- PostsModule/PostsService/PostsController implemented
- Post CRUD APIs implemented and tested:
  - `POST /posts`
  - `GET /posts`
  - `GET /posts/:id`
  - `PATCH /posts/:id`
  - `DELETE /posts/:id`
- Create/update/delete require JWT through `AuthService.me`
- Update/delete verify post author before modifying

Comments backend completed:

- Comment entity implemented with:
  - `id`
  - `content`
  - `author`
  - `post`
  - `createdAt`
  - `updatedAt`
- CommentsModule/CommentsService/CommentsController implemented
- Comment APIs implemented and tested:
  - `POST /comments/posts/:postId`
  - `GET /comments/posts/:postId`
  - `DELETE /comments/:id`
- Delete verifies comment author before deleting

Tags backend completed:

- Tag entity implemented with:
  - `id`
  - unique `name`
  - many-to-many relation with posts
- Post entity has `ManyToMany` tags relation with `@JoinTable`
- TagsModule/TagsService implemented
- `TagsService` includes:
  - `findOrCreateTag(name)`
  - `resolveTags(names)`
- Duplicate tag names are removed with `[...new Set(names)]`
- Posts can be created and updated with `tagNames`
- Existing tags are reused and missing tags are created

Pagination and search completed:

- `GET /posts?page=1&limit=10`
- Response shape:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "totalPages": 0
}
```

- `GET /posts?search=keyword`
  - Searches `title` and `content`
  - Uses PostgreSQL `ILIKE`
  - Uses safe query parameters, not raw string interpolation
- `GET /posts?tag=tagName`
  - Filters posts by tag name
- `GET /posts?search=keyword&tag=tagName`
  - Supports combined keyword search and tag filter
- For Korean query text in curl, use URL encoding:

```bash
curl -G "http://localhost:3000/posts" \
  --data-urlencode "search=태그"
```

Current recommended next step:

- Move to frontend integration:
  - Auth screens
  - Token storage
  - Post list/detail/create/edit/delete UI
  - Comments UI
  - Tag/search/pagination UI
- After frontend baseline works, add AI features:
  - RAG
  - MCP
  - AI Agent

## Learning Style / Collaboration Notes

Explain one step at a time.

For each command or code block, explain:

- What it does
- Why it is needed
- What should happen after running it

Avoid giving too many future steps at once.

The user is learning React, NestJS, PostgreSQL, TypeORM, and TypeScript concepts while implementing the project.
