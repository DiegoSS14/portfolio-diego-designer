import { IconX } from "@tabler/icons-react";

interface SelectedUploadFilesListProps {
  files: File[];
  onRemove: (index: number) => void;
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

export function SelectedUploadFilesList({ files, onRemove }: SelectedUploadFilesListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 space-y-2 md:col-span-2">
      {files.map((file, index) => (
        <li
          key={`${file.name}-${file.size}-${index}`}
          className="flex items-center justify-between gap-3 rounded-xl border border-ui-border bg-ui-bg px-3 py-2"
        >
          <div className="min-w-0">
            <p className="truncate text-sm text-ui-text">{file.name}</p>
            <p className="text-xs uppercase tracking-[0.12em] text-ui-text-muted">
              {formatFileSize(file.size)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text"
            aria-label={`Remover arquivo ${file.name}`}
            title="Remover arquivo"
          >
            <IconX size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}
