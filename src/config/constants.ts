export const APP_NAME = "Gemini";

export const DEFAULT_MODEL = "gemini-3.5-flash";
export const DEFAULT_TEMPERATURE = 1.0;
export const DEFAULT_TOP_P = 0.95;
export const DEFAULT_TOP_K = 40;
export const DEFAULT_MAX_TOKENS = 8192;
export const DEFAULT_SYSTEM_PROMPT = "You are Gemini, a helpful, harmless, and honest AI assistant by Google.";

export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const MAX_IMAGES = 10;
export const MAX_MESSAGE_LENGTH = 100_000;

export const SUPPORTED_FILE_TYPES: Record<string, string> = {
  ".txt": "text/plain", ".md": "text/markdown", ".csv": "text/csv",
  ".json": "application/json", ".xml": "application/xml", ".yaml": "text/yaml",
  ".yml": "text/yaml", ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".js": "text/javascript", ".ts": "text/typescript", ".py": "text/x-python",
  ".java": "text/x-java-source", ".cpp": "text/x-c++src", ".c": "text/x-csrc",
  ".go": "text/x-go", ".rs": "text/x-rust", ".rb": "text/x-ruby",
  ".php": "text/x-php", ".html": "text/html", ".css": "text/css",
  ".sql": "application/sql", ".sh": "application/x-sh", ".log": "text/plain",
};

export const SUPPORTED_IMAGE_TYPES: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
};

export const API_ROUTES = {
  CHATS: "/api/chats",
  CHAT: (id: string) => `/api/chats/${id}`,
  MESSAGES: (chatId: string) => `/api/chats/${chatId}/messages`,
  STREAM: "/api/chat/stream",
  UPLOAD: "/api/files/upload",
  SETTINGS: "/api/user/settings",
} as const;

export const KEYBOARD_SHORTCUTS = [
  { keys: ["Ctrl", "Shift", "O"], action: "New Chat" },
  { keys: ["Ctrl", "Shift", "F"], action: "Search Chats" },
  { keys: ["Ctrl", "Shift", "S"], action: "Toggle Sidebar" },
  { keys: ["Ctrl", "Enter"], action: "Send Message" },
  { keys: ["Esc"], action: "Close Modal" },
] as const;

export const SUGGESTED_PROMPTS = [
  { title: "Write a story", prompt: "Write a short creative story about a robot learning to paint.", icon: "✨" },
  { title: "Explain a concept", prompt: "Explain how large language models work in simple terms.", icon: "💡" },
  { title: "Help me code", prompt: "Write a Python function to sort a list of dictionaries by a specific key.", icon: "💻" },
  { title: "Plan a trip", prompt: "Plan a 5-day trip to Japan with must-see attractions and local food recommendations.", icon: "✈️" },
  { title: "Create a list", prompt: "Give me 10 healthy meal prep ideas that are quick and easy to make.", icon: "📝" },
  { title: "Compare options", prompt: "Compare React, Vue, and Angular for building a large-scale web application.", icon: "⚖️" },
] as const;

export const MODELS = [
  { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", description: "Fastest" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Most capable" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Balanced" },
] as const;

export const VOICE_OPTIONS = [
  { id: "default", name: "Default", description: "System default voice" },
] as const;

export const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "zh", label: "中文" },
  { value: "pt", label: "Português" },
] as const;
