export const DEFAULT_MODEL = "gemini-3.5-flash";
export const DEFAULT_TEMPERATURE = 1.0;
export const DEFAULT_TOP_P = 0.95;
export const DEFAULT_TOP_K = 40;
export const DEFAULT_MAX_TOKENS = 8192;
export const DEFAULT_SYSTEM_PROMPT = "You are Gemini, a helpful, harmless, and honest AI assistant by Google.";

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
