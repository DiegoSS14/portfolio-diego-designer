"use client";

import { useEffect, useRef, useState } from "react";
import { IconChevronDown, IconChevronUp, IconGripVertical, IconX } from "@tabler/icons-react";

interface SelectedUploadFilesListProps {
  files: File[];
  onRemove: (index: number) => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
}

function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function SelectedUploadFilesList({ files, onRemove, onMove }: SelectedUploadFilesListProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const draggedIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (files.length === 0) {
    return null;
  }

  function moveFile(index: number, offset: number) {
    const targetIndex = index + offset;

    if (targetIndex < 0 || targetIndex >= files.length) {
      return;
    }

    if (typeof onMove === "function") {
      onMove(index, targetIndex);
    }
  }

  return (
    <ul className="mt-3 space-y-2 md:col-span-2">
      {files.map((file, index) => (
        <li
          key={`${file.name}-${file.size}-${index}`}
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
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ui-border text-ui-text-muted">
                <IconGripVertical size={14} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-ui-text">{file.name}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-ui-text-muted">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveFile(index, -1)}
                disabled={index === 0 || typeof onMove !== "function"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Mover arquivo ${file.name} para cima`}
                title="Mover para cima"
              >
                <IconChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveFile(index, 1)}
                disabled={index === files.length - 1 || typeof onMove !== "function"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Mover arquivo ${file.name} para baixo`}
                title="Mover para baixo"
              >
                <IconChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text"
                aria-label={`Remover arquivo ${file.name}`}
                title="Remover arquivo"
              >
                <IconX size={14} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-ui-border bg-ui-surface/50">
            <img
              src={previewUrls[index]}
              alt={`Preview de ${file.name}`}
              className="h-auto w-full object-contain"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
