import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MessageRole } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error: chatError } = await supabase
    .from("chats")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (chatError) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error: chatError } = await supabase
    .from("chats")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (chatError) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const body = await request.json();
  const { role, content } = body;

  if (!role || !content) {
    return NextResponse.json(
      { error: "Role and content are required" },
      { status: 400 }
    );
  }

  const validRoles: MessageRole[] = [
    MessageRole.USER,
    MessageRole.ASSISTANT,
    MessageRole.SYSTEM,
  ];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      chat_id: id,
      role,
      content,
      token_count: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("chats")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json(data, { status: 201 });
}
