"use client";

import { useRef } from "react";
import { IconArrowDown, IconArrowUp, IconGripVertical, IconX } from "@tabler/icons-react";

interface ReorderableMediaListItem {
  id: string;
  label: string;
  previewUrl: string;
}

interface ReorderableMediaListProps {
  items: ReorderableMediaListItem[];
  onRemove: (index: number) => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
}

export function ReorderableMediaList({ items, onRemove, onMove }: ReorderableMediaListProps) {
  const draggedIndexRef = useRef<number | null>(null);

  if (items.length === 0) {
    return null;
  }

  function moveItem(index: number, offset: number) {
    const targetIndex = index + offset;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    onMove?.(index, targetIndex);
  }

  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable={typeof onMove === "function"}
          onDragStart={() => {
            draggedIndexRef.current = index;
          }}
          onDragOver={(event) => {
            if (typeof onMove !== "function") {
              return;
            }

            event.preventDefault();
          }}
          onDrop={(event) => {
            if (typeof onMove !== "function") {
              return;
            }

            event.preventDefault();
            const draggedIndex = draggedIndexRef.current;

            if (draggedIndex === null || draggedIndex === index) {
              return;
            }

            onMove(draggedIndex, index);
            draggedIndexRef.current = null;
          }}
          className="rounded-xl border border-ui-border bg-ui-bg p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ui-text-muted">
              {item.label}
            </p>
            <div className="flex items-center gap-1">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted">
                <IconGripVertical size={14} />
              </span>
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0 || typeof onMove !== "function"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Mover ${item.label} para cima`}
                title="Mover para cima"
              >
                <IconArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1 || typeof onMove !== "function"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Mover ${item.label} para baixo`}
                title="Mover para baixo"
              >
                <IconArrowDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text"
                aria-label={`Remover ${item.label}`}
                title="Remover imagem"
              >
                <IconX size={14} />
              </button>
            </div>
          </div>

          <img
            src={item.previewUrl}
            alt={item.label}
            className="h-auto w-full rounded-lg object-contain"
          />
        </li>
      ))}
    </ul>
  );
}