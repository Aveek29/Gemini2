-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────

create table public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  full_name  text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─── folders ─────────────────────────────────────────────────

create table public.folders (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  name       text not null,
  color      text not null default '#6366f1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.folders enable row level security;

create index idx_folders_user_id on public.folders(user_id);

create policy "Users can manage own folders"
  on public.folders for all
  using (auth.uid() = user_id);

-- ─── chats ───────────────────────────────────────────────────

create table public.chats (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null default 'New Chat',
  folder_id     uuid references public.folders(id) on delete set null,
  is_pinned     boolean not null default false,
  is_archived   boolean not null default false,
  is_deleted    boolean not null default false,
  system_prompt text not null default 'You are NovaMind, a helpful, harmless, and honest AI assistant.',
  model         text not null default 'gemini-2.5-flash',
  temperature   numeric(3,2) not null default 1.0,
  top_p         numeric(3,2) not null default 0.95,
  top_k         integer not null default 40,
  max_tokens    integer not null default 8192,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.chats enable row level security;

create index idx_chats_user_id on public.chats(user_id);
create index idx_chats_updated_at on public.chats(updated_at desc);
create index idx_chats_folder_id on public.chats(folder_id);

create policy "Users can manage own chats"
  on public.chats for all
  using (auth.uid() = user_id);

-- ─── messages ────────────────────────────────────────────────

create table public.messages (
  id          uuid primary key default uuid_generate_v4(),
  chat_id     uuid not null references public.chats(id) on delete cascade,
  role        text not null check (role in ('user', 'assistant', 'system')),
  content     text not null,
  token_count integer,
  created_at  timestamptz not null default now()
);

alter table public.messages enable row level security;

create index idx_messages_chat_id on public.messages(chat_id);
create index idx_messages_created_at on public.messages(created_at);

create policy "Users can manage messages in own chats"
  on public.messages for all
  using (
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
        and chats.user_id = auth.uid()
    )
  );

-- ─── attachments ─────────────────────────────────────────────

create table public.attachments (
  id            uuid primary key default uuid_generate_v4(),
  message_id    uuid not null references public.messages(id) on delete cascade,
  file_name     text not null,
  file_url      text not null,
  file_type     text not null,
  file_size     bigint not null,
  thumbnail_url text,
  created_at    timestamptz not null default now()
);

alter table public.attachments enable row level security;

create index idx_attachments_message_id on public.attachments(message_id);

create policy "Users can manage attachments in own messages"
  on public.attachments for all
  using (
    exists (
      select 1 from public.messages
      join public.chats on chats.id = messages.chat_id
      where messages.id = attachments.message_id
        and chats.user_id = auth.uid()
    )
  );

-- ─── user_settings ───────────────────────────────────────────

create table public.user_settings (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null unique references public.profiles(id) on delete cascade,
  theme                 text not null default 'system',
  language              text not null default 'en',
  temperature           numeric(3,2) not null default 1.0,
  top_p                 numeric(3,2) not null default 0.95,
  top_k                 integer not null default 40,
  max_tokens            integer not null default 8192,
  system_prompt         text not null default 'You are NovaMind, a helpful, harmless, and honest AI assistant.',
  streaming_enabled     boolean not null default true,
  voice_enabled         boolean not null default false,
  voice_id              text,
  notifications_enabled boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can manage own settings"
  on public.user_settings for all
  using (auth.uid() = user_id);

-- ─── usage ───────────────────────────────────────────────────

create table public.usage (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null unique references public.profiles(id) on delete cascade,
  total_tokens   bigint not null default 0,
  total_messages bigint not null default 0,
  total_chats    bigint not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.usage enable row level security;

create policy "Users can view own usage"
  on public.usage for select
  using (auth.uid() = user_id);

create policy "System can update own usage"
  on public.usage for update
  using (auth.uid() = user_id);

create policy "System can insert own usage"
  on public.usage for insert
  with check (auth.uid() = user_id);

-- ─── updated_at trigger ──────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.chats
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.folders
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.user_settings
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.usage
  for each row execute function public.handle_updated_at();

-- ─── create profile on signup ────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );

  insert into public.user_settings (user_id)
  values (new.id);

  insert into public.usage (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
