import {
  consumeStream,
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/lib/templates";
import { saveGeneration } from "@/lib/save-generation";
import { getGenerateRateLimit } from "@/lib/rate-limit";
import { generateRequestSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (origin && appUrl && !origin.startsWith(appUrl)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimiter = getGenerateRateLimit();
  if (rateLimiter) {
    const { success } = await rateLimiter.limit(user.id);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { messages, template: templateSlug, inputData } = parsed.data;

  const templateConfig = getTemplate(templateSlug);
  if (!templateConfig) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: templateConfig.systemPrompt,
    messages: await convertToModelMessages(messages as UIMessage[]),
    maxTokens: templateConfig.maxTokens,
  });

  return result.toUIMessageStreamResponse({
    consumeSseStream: consumeStream,
    onFinish: async ({ responseMessage, finishReason, isAborted }) => {
      if (isAborted) return;

      const outputText = responseMessage.parts
        .filter(
          (p): p is { type: "text"; text: string } => p.type === "text"
        )
        .map((p) => p.text)
        .join("");

      try {
        await saveGeneration({
          supabase,
          userId: user.id,
          template: templateSlug,
          inputData,
          output:
            finishReason === "content-filter"
              ? null
              : outputText || null,
          model: "gemini-2.0-flash",
          tokensUsed: null,
        });
      } catch (error) {
        console.error("Failed to save generation in onFinish:", error);
      }
    },
  });
}
