"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface FavoriteButtonProps {
  generationId: string;
  initialFavorite: boolean;
}

export function FavoriteButton({
  generationId,
  initialFavorite,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const toggle = useCallback(async () => {
    const next = !isFavorite;
    setIsFavorite(next);

    const supabase = createClient();
    const { error } = await supabase
      .from("ai_generations")
      .update({ is_favorite: next })
      .eq("id", generationId);

    if (error) {
      setIsFavorite(!next);
      toast.error("Failed to update favorite");
    }
  }, [isFavorite, generationId]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 shrink-0"
      onClick={toggle}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={`h-4 w-4 ${
          isFavorite
            ? "fill-yellow-400 text-yellow-400"
            : "text-[hsl(var(--muted-foreground))]"
        }`}
      />
    </Button>
  );
}
