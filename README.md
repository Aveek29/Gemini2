# NovaMind - AI Assistant

A production-ready conversational AI assistant powered by Google Gemini, built with Next.js, Supabase, and modern web technologies.

## Features

- **Real-time Streaming** - Token-by-token streaming responses from Gemini API
- **Markdown Rendering** - Full GFM support with syntax highlighting, tables, math (KaTeX)
- **Voice Input/Output** - Speech-to-text and text-to-speech via Web Speech API
- **File Upload** - Support for images, PDFs, documents, code files, and more
- **Image Analysis** - Vision capabilities using Gemini Vision
- **Conversation Management** - Create, rename, pin, archive, delete, organize into folders
- **Search** - Full-text search across conversations and messages
- **Export** - Export chats as Markdown, JSON, or PDF
- **Dark/Light/System Themes** - Beautiful glassmorphism UI with theme support
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Authentication** - Secure user authentication via Supabase Auth
- **Customizable Settings** - Temperature, top-p, top-k, max tokens, system prompt

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (Strict) |
| Styling | Tailwind CSS 4, Framer Motion |
| UI | Custom glassmorphism components |
| State | Zustand (persisted) |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| AI | Google Gemini API |
| Forms | React Hook Form + Zod |
| Markdown | React Markdown + remark-gfm + rehype-highlight |

## Getting Started

### Prerequisites

- Node.js 18+ 
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key

### 1. Clone & Install

```bash
git clone <your-repo>
cd novamind-ai
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL migration in your Supabase SQL Editor:

1. Go to your Supabase Dashboard → SQL Editor
2. Paste the contents of `supabase/migration/001_initial_schema.sql`
3. Click "Run"

This creates all required tables with Row Level Security (RLS).

### 4. Storage Setup

In your Supabase Dashboard:
1. Go to Storage
2. Create a bucket named `attachments`
3. Set it to private

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Create Your First Account

1. Navigate to `/register`
2. Create an account with email and password
3. Sign in and start chatting!

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (chat)/             # Chat interface
│   │   ├── chat/           # Chat pages
│   │   └── layout.tsx
│   ├── api/                # API routes
│   │   ├── auth/           # Auth callbacks
│   │   ├── chat/           # Chat streaming
│   │   ├── chats/          # CRUD operations
│   │   ├── files/          # File uploads
│   │   └── user/           # User settings
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Root redirect
│   ├── not-found.tsx       # 404 page
│   └── error.tsx           # Error boundary
├── components/
│   ├── ui/                 # Base UI components (20)
│   ├── chat/               # Chat components
│   ├── layout/             # Layout components
│   ├── markdown/           # Markdown renderer
│   ├── voice/              # Voice components
│   ├── files/              # File components
│   └── settings/           # Settings components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── gemini/             # Gemini API wrapper
│   └── utils.ts            # Utility functions
├── services/               # Database service layer
├── store/                  # Zustand stores
├── styles/                 # Global CSS
├── types/                  # TypeScript types
└── config/                 # Constants & config
```

## Deployment to AWS Amplify

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on AWS Amplify

1. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Select GitHub as the source
4. Authorize AWS Amplify to access your repository
5. Select the repository and branch (main)
6. Amplify will auto-detect Next.js and use `amplify.yml` for build settings
7. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Amplify domain)
8. Click "Save and deploy"

### 3. Update Supabase

After deployment:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Amplify domain to "Redirect URLs"
3. Set "Site URL" to your Amplify domain

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/⌘ + K` | Open search |
| `Ctrl/⌘ + N` | New chat |
| `Ctrl/⌘ + B` | Toggle sidebar |
| `Enter` | Send message (configurable) |
| `Ctrl/⌘ + Enter` | Send message (alternative) |
| `Escape` | Stop generation / Close modal |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/stream` | Stream chat completion (SSE) |
| GET | `/api/chats` | List user's chats |
| POST | `/api/chats` | Create new chat |
| GET | `/api/chats/[id]` | Get chat by ID |
| PATCH | `/api/chats/[id]` | Update chat |
| DELETE | `/api/chats/[id]` | Delete chat |
| GET | `/api/chats/[id]/messages` | Get chat messages |
| POST | `/api/chats/[id]/messages` | Add message |
| POST | `/api/files/upload` | Upload file |
| GET | `/api/user/settings` | Get settings |
| PUT | `/api/user/settings` | Update settings |
| GET | `/api/health` | Health check |

## Security

- Row Level Security (RLS) on all database tables
- Server-side authentication on all API routes
- Content Security Policy headers
- API keys never exposed to the client
- CSRF protection via SameSite cookies
- Secure HTTP headers (X-Frame-Options, X-Content-Type-Options, etc.)

## License

MIT
