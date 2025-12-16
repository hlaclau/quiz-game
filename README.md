# quiz-game

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Elysia** - Type-safe, high-performance framework
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```
## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:
```bash
bun run db:push
```


Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).







## Project Structure

```
quiz-game/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Start)
│   └── server/      # Backend API (Elysia)
├── packages/
│   ├── auth/        # Authentication configuration & logic
│   ├── config/      # Configuration files
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Biome formatting and linting

Database Schema for dbdiagram.io:
```
// ==========================================
// AUTHENTICATION TABLES (Better Auth)
// ==========================================

Table user {
  id text [pk]
  name text [not null]
  email text [not null, unique]
  email_verified boolean [not null, default: false]
  image text
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table session {
  id text [pk]
  expires_at timestamp [not null]
  token text [not null, unique]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
  ip_address text
  user_agent text
  user_id text [not null, ref: > user.id]

  indexes {
    user_id
  }
}

Table account {
  id text [pk]
  account_id text [not null]
  provider_id text [not null]
  user_id text [not null, ref: > user.id]
  access_token text
  refresh_token text
  id_token text
  access_token_expires_at timestamp
  refresh_token_expires_at timestamp
  scope text
  password text
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]

  indexes {
    user_id
  }
}

Table verification {
  id text [pk]
  identifier text [not null]
  value text [not null]
  expires_at timestamp [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]

  indexes {
    identifier
  }
}

// ==========================================
// QUIZ TABLES
// ==========================================

Table theme {
  id text [pk]
  name text [not null, unique]
  description text
  color text [note: 'Hex color for UI display']
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table tag {
  id text [pk]
  name text [not null, unique]
  created_at timestamp [not null, default: `now()`]
}

Table question {
  id text [pk]
  content text [not null, note: 'The question text']
  explanation text [note: 'Optional explanation for the correct answer']
  difficulty int [note: '1=easy, 2=medium, 3=hard']
  theme_id text [not null, ref: > theme.id]
  author_id text [not null, ref: > user.id]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]

  indexes {
    theme_id
    author_id
  }
}

Table answer {
  id text [pk]
  content text [not null]
  is_correct boolean [not null, default: false]
  question_id text [not null, ref: > question.id]
  created_at timestamp [not null, default: `now()`]

  indexes {
    question_id
  }
}

Table question_tag {
  question_id text [not null, ref: > question.id]
  tag_id text [not null, ref: > tag.id]

  indexes {
    (question_id, tag_id) [pk]
  }
}

// ==========================================
// TABLE GROUPS (for visual organization)
// ==========================================

TableGroup authentication {
  user
  session
  account
  verification
}

TableGroup quiz {
  theme
  tag
  question
  answer
  question_tag
}
```