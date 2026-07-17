# Gemini Clone

A Google Gemini clone built with Next.js 16, Supabase, and the Google Gemini API. Deployed on AWS Amplify.

## Features

- **Streaming Chat** - Real-time token-by-token responses from Gemini API via SSE
- **Markdown Rendering** - Code syntax highlighting, tables, lists
- **Voice Input** - Speech-to-text via Web Speech API
- **Model Selection** - Switch between Gemini 3.5 Flash, 2.5 Pro, and 2.0 Flash
- **Chat History** - Time-grouped conversation list in sidebar
- **Authentication** - Email/password sign up, sign in, password reset via Supabase
- **Dark Theme** - Google Gemini-style dark UI
- **Responsive** - Desktop and mobile with sidebar overlay
- **Copy Messages** - One-click copy for assistant responses

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| State | Zustand |
| AI | Google Gemini API (`@google/genai`) |
| Auth & DB | Supabase (PostgreSQL + Auth) |
| Deployment | AWS Amplify |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key

### 1. Clone & Install

```bash
git clone https://github.com/Aveek29/Gemini2.git
cd Gemini2
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Paste contents of `supabase/migration/001_initial_schema.sql`
3. Click "Run"

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/             # Login, Register, Forgot Password
│   ├── (chat)/             # Chat home + [id] pages
│   └── api/                # API routes (stream, chats, auth)
├── components/
│   ├── chat/               # ChatInput, MessageBubble, WelcomeScreen
│   ├── layout/             # Header, Sidebar, AppLayout
│   ├── markdown/           # Markdown renderer
│   └── ui/                 # Button, Dialog, Dropdown, etc.
├── config/                 # Constants, models, prompts
├── hooks/                  # useAuth, useChat, useVoice, useMediaQuery
├── lib/supabase/           # Supabase client & server setup
├── store/                  # Zustand stores (chat, sidebar, settings)
├── styles/                 # Global CSS
└── types/                  # TypeScript types
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/stream` | Stream Gemini response (SSE) |
| GET/POST | `/api/chats` | List / create chats |
| GET/PATCH/DELETE | `/api/chats/[id]` | Chat CRUD |
| GET/POST | `/api/chats/[id]/messages` | Message CRUD |
| GET | `/api/health` | Health check |

## Deployment (AWS Amplify)

1. Push to GitHub
2. Amplify Console → New app → GitHub → select repo & branch
3. Build settings uses `amplify.yml` from repo root
4. Add environment variables (all must be `NEXT_PUBLIC_` prefixed for Amplify):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. Deploy
6. Add Amplify URL to Supabase → Authentication → URL Configuration → Redirect URLs

**Note:** All env vars must use `NEXT_PUBLIC_` prefix on Amplify because it only injects prefixed vars into the serverless runtime.

## License

MIT
