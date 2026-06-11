"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { createClient } from "@/lib/supabase/client";
import { KanbanColumn, type ColumnData } from "@/components/kanban-column";
import { KanbanCard, type CardData } from "@/components/kanban-card";
import { AddColumnForm } from "@/components/add-column-form";
import { useRealtime } from "@/hooks/use-realtime";
import { usePresence } from "@/hooks/use-presence";
import { PresenceAvatars } from "@/components/presence-avatars";
import { ActivityFeed } from "@/components/activity-feed";
import { toast } from "sonner";

interface KanbanBoardProps {
  boardId: string;
  userId: string;
  email: string;
  initialColumns: ColumnData[];
  initialCards: CardData[];
}

export function KanbanBoard({
  boardId,
  userId,
  email,
  initialColumns,
  initialCards,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const { onlineUsers } = usePresence({ boardId, userId, email });

  const handleRealtimeEvent = useCallback(
    (event: { table: string; eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
      const { table, eventType } = event;

      if (table === "collab_columns") {
        if (eventType === "INSERT") {
          const col = event.new as unknown as ColumnData;
          setColumns((prev) => [...prev, col].sort((a, b) => a.position - b.position));
        } else if (eventType === "UPDATE") {
          const col = event.new as unknown as ColumnData;
          setColumns((prev) => prev.map((c) => (c.id === col.id ? col : c)).sort((a, b) => a.position - b.position));
        } else if (eventType === "DELETE") {
          const old = event.old as { id?: string };
          if (old.id) {
            setColumns((prev) => prev.filter((c) => c.id !== old.id));
            setCards((prev) => prev.filter((c) => c.column_id !== old.id));
          }
        }
      }

      if (table === "collab_cards") {
        if (eventType === "INSERT") {
          const card = event.new as unknown as CardData;
          setCards((prev) => {
            if (prev.find((c) => c.id === card.id)) return prev;
            return [...prev, card];
          });
        } else if (eventType === "UPDATE") {
          const card = event.new as unknown as CardData;
          setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
        } else if (eventType === "DELETE") {
          const old = event.old as { id?: string };
          if (old.id) {
            setCards((prev) => prev.filter((c) => c.id !== old.id));
          }
        }
      }
    },
    []
  );

  useRealtime({ boardId, onEvent: handleRealtimeEvent });

  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const cardsByColumn = useMemo(() => {
    const map: Record<string, CardData[]> = {};
    for (const col of columns) {
      map[col.id] = cards
        .filter((c) => c.column_id === col.id)
        .sort((a, b) => a.position - b.position);
    }
    return map;
  }, [cards, columns]);

  const snapshotRef = useRef<{ columns: ColumnData[]; cards: CardData[] }>({ columns, cards });
  function saveSnapshot() {
    snapshotRef.current = { columns: [...columns], cards: [...cards] };
  }
  function rollback() {
    setColumns(snapshotRef.current.columns);
    setCards(snapshotRef.current.cards);
  }

  function handleDragStart(event: DragStartEvent) {
    saveSnapshot();
    const { active } = event;
    const data = active.data.current;
    if (data?.type === "card") {
      setActiveCard(data.card as CardData);
    } else if (data?.type === "column") {
      setActiveColumn(data.column as ColumnData);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type !== "card") return;

    const activeCard = activeData.card as CardData;
    let overColumnId: string;

    if (overData?.type === "card") {
      overColumnId = (overData.card as CardData).column_id;
    } else if (overData?.type === "column") {
      overColumnId = (overData.column as ColumnData).id;
    } else {
      return;
    }

    if (activeCard.column_id === overColumnId) return;

    setCards((prev) => {
      return prev.map((c) =>
        c.id === activeCard.id ? { ...c, column_id: overColumnId } : c
      );
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    setActiveColumn(null);

    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "column" && overData?.type === "column") {
      const oldIndex = columns.findIndex((c) => c.id === active.id);
      const newIndex = columns.findIndex((c) => c.id === over.id);
      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex).map((c, i) => ({ ...c, position: i }));
        setColumns(newColumns);
        await persistColumnOrder(newColumns);
      }
      return;
    }

    if (activeData?.type === "card") {
      const activeCardData = activeData.card as CardData;
      const targetColumnId = overData?.type === "card"
        ? (overData.card as CardData).column_id
        : overData?.type === "column"
          ? (overData.column as ColumnData).id
          : activeCardData.column_id;

      const columnCards = cards
        .filter((c) => c.column_id === targetColumnId)
        .sort((a, b) => a.position - b.position);

      let newIndex = columnCards.length;
      if (overData?.type === "card") {
        newIndex = columnCards.findIndex((c) => c.id === over.id);
        if (newIndex === -1) newIndex = columnCards.length;
      }

      const updatedCards = cards.map((c) => {
        if (c.id === active.id) {
          return { ...c, column_id: targetColumnId, position: newIndex };
        }
        return c;
      });

      const finalCards = updatedCards
        .filter((c) => c.column_id === targetColumnId)
        .sort((a, b) => a.position - b.position)
        .map((c, i) => ({ ...c, position: i }));

      const otherCards = updatedCards.filter((c) => c.column_id !== targetColumnId);
      setCards([...otherCards, ...finalCards]);

      await persistCardOrder(finalCards, targetColumnId, activeCardData);
    }
  }

  async function persistColumnOrder(newColumns: ColumnData[]) {
    const supabase = createClient();
    const updates = newColumns.map((col) => ({ id: col.id, position: col.position }));
    const { error } = await supabase.rpc("collab_reorder_columns", {
      p_updates: updates,
    });
    if (error) {
      toast.error("Failed to reorder columns");
      rollback();
    }
  }

  async function persistCardOrder(columnCards: CardData[], columnId: string, movedCard: CardData) {
    const supabase = createClient();
    const updates = columnCards.map((card) => ({
      id: card.id,
      position: card.position,
      column_id: columnId,
    }));
    const { error } = await supabase.rpc("collab_reorder_cards", {
      p_updates: updates,
    });
    if (error) {
      toast.error("Failed to reorder cards");
      rollback();
      return;
    }

    if (movedCard.column_id !== columnId) {
      const col = columns.find((c) => c.id === columnId);
      try {
        await supabase.from("collab_activity_log").insert({
          board_id: boardId,
          user_id: userId,
          action: "card_moved",
          entity_type: "card",
          entity_id: movedCard.id,
          metadata: { title: movedCard.title, to_column: col?.title || "" },
        });
      } catch {
        // Activity logging is non-critical
      }
    }
  }

  async function handleDeleteColumn(columnId: string) {
    saveSnapshot();
    const supabase = createClient();
    setColumns((prev) => prev.filter((c) => c.id !== columnId));
    setCards((prev) => prev.filter((c) => c.column_id !== columnId));

    const { error } = await supabase.from("collab_columns").delete().eq("id", columnId);
    if (error) {
      toast.error("Failed to delete column");
      rollback();
    }
  }

  async function handleDeleteCard(cardId: string) {
    saveSnapshot();
    const supabase = createClient();
    setCards((prev) => prev.filter((c) => c.id !== cardId));

    const { error } = await supabase.from("collab_cards").delete().eq("id", cardId);
    if (error) {
      toast.error("Failed to delete card");
      rollback();
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <PresenceAvatars users={onlineUsers} currentUserId={userId} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-x-auto p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex h-full gap-4">
              <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    cards={cardsByColumn[column.id] ?? []}
                    onDeleteColumn={handleDeleteColumn}
                    onDeleteCard={handleDeleteCard}
                  />
                ))}
              </SortableContext>
              <AddColumnForm boardId={boardId} position={columns.length} />
            </div>
            <DragOverlay>
              {activeCard && <KanbanCard card={activeCard} isDraggingOverlay />}
              {activeColumn && (
                <div className="min-w-[280px] rounded-lg border bg-card/80 p-4 shadow-lg rotate-3">
                  <p className="text-sm font-semibold">{activeColumn.title}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
        <div className="hidden w-64 border-l lg:block">
          <ActivityFeed boardId={boardId} />
        </div>
      </div>
    </div>
  );
}
