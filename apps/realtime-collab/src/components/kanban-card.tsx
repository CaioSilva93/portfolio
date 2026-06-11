"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CardData {
  id: string;
  column_id: string;
  board_id: string;
  title: string;
  description: string;
  position: number;
  color: string | null;
  assigned_to: string | null;
}

interface KanbanCardProps {
  card: CardData;
  onDelete?: (cardId: string) => void;
  isDraggingOverlay?: boolean;
}

export function KanbanCard({ card, onDelete, isDraggingOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "card", card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40",
        isDraggingOverlay && "rotate-3 shadow-lg",
        card.color && `border-l-4`
      )}
      {...attributes}
      {...listeners}
    >
      <div
        className="flex items-start gap-2 p-3"
        style={card.color ? { borderLeftColor: card.color } : undefined}
      >
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">{card.title}</p>
          {card.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{card.description}</p>
          )}
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
          >
            <Trash2 className="h-3 w-3 text-muted-foreground" />
          </Button>
        )}
      </div>
    </Card>
  );
}
