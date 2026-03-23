import type { ProjectUpsertPayload } from "../../domain/repositories/ProjectRepository";

export interface RawProjectPayload {
  slug?: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  thumbnailUrl?: string;
  mediaUrls?: unknown;
  tags?: unknown;
}

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createProjectUpsertPayload(rawPayload: RawProjectPayload): ProjectUpsertPayload {
  const title = (rawPayload.title ?? "").trim();
  const slug = (rawPayload.slug ?? "").trim() || slugify(title);
  const shortDescription = (rawPayload.shortDescription ?? "").trim();
  const fullDescription = (rawPayload.fullDescription ?? "").trim();
  const thumbnailUrl = (rawPayload.thumbnailUrl ?? "").trim();
  const mediaUrls = normalizeList(rawPayload.mediaUrls);
  const tags = normalizeList(rawPayload.tags);

  if (!title || !slug || !shortDescription || !fullDescription || !thumbnailUrl) {
    throw new Error("Missing required project fields.");
  }

  return {
    slug,
    title,
    shortDescription,
    fullDescription,
    thumbnailUrl,
    mediaUrls,
    tags,
  };
}
