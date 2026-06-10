import type { SupabaseClient } from "@supabase/supabase-js";

interface SaveGenerationParams {
  supabase: SupabaseClient;
  userId: string;
  template: string;
  inputData: Record<string, string>;
  output: string | null;
  model: string;
  tokensUsed: number | null;
}

export async function saveGeneration(params: SaveGenerationParams) {
  const { supabase, userId, template, inputData, output, model, tokensUsed } = params;
  const { error } = await supabase.from("ai_generations").insert({
    user_id: userId,
    template,
    input_data: inputData,
    output,
    model,
    tokens_used: tokensUsed,
  });
  if (error) console.error("Failed to save generation:", error);
}
