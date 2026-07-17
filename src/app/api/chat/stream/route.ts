import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  DEFAULT_TOP_K,
  DEFAULT_MAX_TOKENS,
  DEFAULT_SYSTEM_PROMPT,
} from "@/config/constants";

interface RequestBody {
  chatId: string;
  messages: Array<{ role: string; content: string }>;
  systemPrompt?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  model?: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
      const body: RequestBody = await request.json();
    const {
      messages,
      systemPrompt = DEFAULT_SYSTEM_PROMPT,
      temperature = DEFAULT_TEMPERATURE,
      topP = DEFAULT_TOP_P,
      topK = DEFAULT_TOP_K,
      maxTokens = DEFAULT_MAX_TOKENS,
      model: rawModel,
    } = body;
    const model = rawModel || DEFAULT_MODEL;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const genai = new GoogleGenAI({ apiKey });

    const contents = messages.map((msg) => ({
      role: (msg.role === "assistant" ? "model" : "user") as "model" | "user",
      parts: [{ text: msg.content }],
    }));

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await genai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction: systemPrompt,
              temperature,
              topP,
              topK,
              maxOutputTokens: maxTokens,
            },
          });

          for await (const chunk of response) {
            const text = chunk.text ?? "";
            if (text) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text, done: false })}\n\n`
                )
              );
            }
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: "", done: true })}\n\n`)
          );
          controller.close();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Stream failed";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
