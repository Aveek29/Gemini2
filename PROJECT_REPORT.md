# Gemini Clone — Project Report

## Overview
A full-stack Google Gemini clone with authentication, real-time streaming chat, and AWS Amplify deployment. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Zustand.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| State | Zustand (client-side stores) |
| Animation | Framer Motion |
| Icons | Lucide React |
| AI | Google Gemini API (`@google/genai`) |
| Auth & DB | Supabase (PostgreSQL + Auth) |
| Deployment | AWS Amplify (auto-deploy from GitHub) |

## Architecture

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── (chat)/          # Chat pages (home + [id])
│   └── api/             # Server-side API routes
├── components/
│   ├── chat/            # ChatInput, MessageBubble, WelcomeScreen, etc.
│   ├── layout/          # Header, Sidebar, AppLayout
│   ├── markdown/        # Markdown rendering with syntax highlighting
│   └── ui/              # Reusable UI primitives (Button, Dialog, etc.)
├── config/              # Constants, prompts, models
├── hooks/               # useAuth, useChat, useVoice, useMediaQuery
├── lib/                 # Supabase client/server, utilities
├── store/               # Zustand stores (chat, sidebar, settings)
├── styles/              # Global CSS (Gemini dark theme)
└── types/               # TypeScript type definitions
```

## Features

### Authentication
- Email/password sign up and sign in via Supabase Auth
- Password reset flow
- Session persistence via middleware
- Protected routes (redirect to /login if unauthenticated)

### Chat
- Real-time streaming responses from Gemini API (SSE)
- Per-chat model selection (Gemini 3.5 Flash, 2.5 Pro, 2.0 Flash)
- Auto-scroll to latest message
- Copy message content
- Voice input (Web Speech API)
- Suggested prompts on home screen

### UI (Google Gemini Design)
- Dark theme matching Google Gemini (#000000 background, #1a73e8 primary)
- Pill-shaped chat input with mic/send/stop buttons
- User messages: right-aligned rounded bubbles
- Assistant messages: left-aligned with Gemini spark icon
- Time-grouped chat history in sidebar
- Model selector dropdown in header
- Responsive design (mobile sidebar with overlay)

### API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/auth/callback` | GET | Supabase OAuth callback |
| `/api/chats` | GET/POST | List/create chats |
| `/api/chats/[id]` | GET/PATCH/DELETE | Chat CRUD |
| `/api/chats/[id]/messages` | GET/POST | Message CRUD |
| `/api/chat/stream` | POST | Streaming Gemini response |

## Database Schema (Supabase)

- **chats**: id, user_id, title, model, settings, timestamps
- **messages**: id, chat_id, role (user/assistant/system), content, timestamps

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key |
| `NEXT_PUBLIC_APP_URL` | Deployed app URL |

## Deployment

- **Platform**: AWS Amplify (auto-deploy on git push to master)
- **Build**: `npm ci && npm run build`
- **Artifacts**: `.next/` directory
- **Environment**: All env vars prefixed with `NEXT_PUBLIC_` for Amplify runtime compatibility

## Key Decisions

1. **No Vercel SDK** — direct Gemini API integration via `@google/genai`
2. **Client-side state** — Zustand stores with localStorage persistence for settings/sidebar
3. **Server-side auth** — Supabase SSR with middleware-based session refresh
4. **Streaming** — Server-Sent Events (SSE) from API route to client for real-time token delivery
5. **`NEXT_PUBLIC_` prefix** — Required for Amplify to inject env vars into serverless runtime
