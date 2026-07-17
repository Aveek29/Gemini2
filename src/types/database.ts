export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  folder_id: string | null;
  is_pinned: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  system_prompt: string;
  model: string;
  temperature: number;
  top_p: number;
  top_k: number;
  max_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: MessageRole;
  content: string;
  token_count: number | null;
  created_at: string;
}

export interface Attachment {
  id: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  thumbnail_url: string | null;
  created_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  temperature: number;
  top_p: number;
  top_k: number;
  max_tokens: number;
  system_prompt: string;
  streaming_enabled: boolean;
  voice_enabled: boolean;
  voice_id: string | null;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Usage {
  id: string;
  user_id: string;
  total_tokens: number;
  total_messages: number;
  total_chats: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

export interface ChatInsert {
  id?: string;
  user_id: string;
  title?: string;
  folder_id?: string | null;
  is_pinned?: boolean;
  is_archived?: boolean;
  is_deleted?: boolean;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
}

export interface MessageInsert {
  id?: string;
  chat_id: string;
  role: MessageRole;
  content: string;
  token_count?: number | null;
}

export interface AttachmentInsert {
  id?: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  thumbnail_url?: string | null;
}

export interface FolderInsert {
  id?: string;
  user_id: string;
  name: string;
  color?: string;
}

export interface UserSettingsInsert {
  id?: string;
  user_id: string;
  theme?: string;
  language?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  system_prompt?: string;
  streaming_enabled?: boolean;
  voice_enabled?: boolean;
  voice_id?: string | null;
  notifications_enabled?: boolean;
}

export interface UsageInsert {
  id?: string;
  user_id: string;
  total_tokens?: number;
  total_messages?: number;
  total_chats?: number;
}

export interface ProfileUpdate {
  full_name?: string | null;
  avatar_url?: string | null;
}

export interface ChatUpdate {
  title?: string;
  folder_id?: string | null;
  is_pinned?: boolean;
  is_archived?: boolean;
  is_deleted?: boolean;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
}

export interface MessageUpdate {
  content?: string;
  token_count?: number | null;
}

export interface FolderUpdate {
  name?: string;
  color?: string;
}

export interface UserSettingsUpdate {
  theme?: string;
  language?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  system_prompt?: string;
  streaming_enabled?: boolean;
  voice_enabled?: boolean;
  voice_id?: string | null;
  notifications_enabled?: boolean;
}

export interface UsageUpdate {
  total_tokens?: number;
  total_messages?: number;
  total_chats?: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      chats: {
        Row: Chat;
        Insert: ChatInsert;
        Update: ChatUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      attachments: {
        Row: Attachment;
        Insert: AttachmentInsert;
        Update: Partial<AttachmentInsert>;
      };
      folders: {
        Row: Folder;
        Insert: FolderInsert;
        Update: FolderUpdate;
      };
      user_settings: {
        Row: UserSettings;
        Insert: UserSettingsInsert;
        Update: UserSettingsUpdate;
      };
      usage: {
        Row: Usage;
        Insert: UsageInsert;
        Update: UsageUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      message_role: MessageRole;
    };
  };
}
