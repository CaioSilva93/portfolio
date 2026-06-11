"use client";

import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard, type CardData } from "@/components/kanban-card";
import { AddCardForm } from "@/components/add-card-form";
import { Button } from "@/components/ui/button";
import { GripVertical, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ColumnData {
  id: string;
  board_id: string;
  title: string;
  position: number;
}

interface KanbanColumnProps {
  column: ColumnData;
  cards: CardData[];
  onDeleteColumn?: (columnId: string) => void;
  onDeleteCard?: (cardId: string) => void;
}

export function KanbanColumn({ column, cards, onDeleteColumn, onDeleteCard }: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column", column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardIds = cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex h-full min-w-[280px] max-w-[320px] flex-col rounded-lg border bg-card/50",
        isDragging && "opacity-40"
      )}
    >
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
          <h3 className="text-sm font-semibold">{column.title}</h3>
          <span className="text-xs text-muted-foreground">({cards.length})</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDeleteColumn?.(column.id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
        </SortableContext>
      </div>

      <div className="border-t p-2">
        <AddCardForm boardId={column.board_id} columnId={column.id} position={cards.length} />
      </div>
    </div>
  );
}
