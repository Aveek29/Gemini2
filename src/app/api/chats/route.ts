import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ChatInsert } from "@/types";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
  );
  const folder = searchParams.get("folder");
  const archived = searchParams.get("archived") === "true";
  const pinned = searchParams.get("pinned") === "true";
  const offset = (page - 1) * limit;

  let query = supabase
    .from("chats")
    .select(
      `
        *,
        messages:messages(content, role, created_at)
      `,
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (folder) {
    query = query.eq("folder_id", folder);
  } else if (searchParams.has("folder")) {
    query = query.is("folder_id", null);
  }

  if (archived) {
    query = query.eq("is_archived", true);
  } else {
    query = query.eq("is_archived", false);
  }

  if (pinned) {
    query = query.eq("is_pinned", true);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const chats = (data || []).map((chat: Record<string, unknown>) => {
    const messages = chat.messages as Array<{
      content: string;
      role: string;
      created_at: string;
    }> | null;
    const lastMsg = messages?.[messages.length - 1] ?? null;
    return {
      id: chat.id,
      title: chat.title,
      folder_id: chat.folder_id,
      is_pinned: chat.is_pinned,
      is_archived: chat.is_archived,
      updated_at: chat.updated_at,
      last_message: lastMsg
        ? {
            content: lastMsg.content,
            role: lastMsg.role,
            created_at: lastMsg.created_at,
          }
        : null,
    };
  });

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    items: chats,
    total,
    page,
    per_page: limit,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, folderId, systemPrompt, model, temperature, topP, topK, maxTokens } =
    body;

  const insert: ChatInsert = {
    user_id: user.id,
    title: title || "New Chat",
    folder_id: folderId ?? null,
    system_prompt: systemPrompt,
    model,
    temperature,
    top_p: topP,
    top_k: topK,
    max_tokens: maxTokens,
  };

  const { data, error } = await supabase
    .from("chats")
    .insert(insert)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
