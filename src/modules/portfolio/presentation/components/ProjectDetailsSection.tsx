"use client";

import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { ProjectDetailsViewModel } from "../view-models/ProjectCardViewModel";

interface ProjectDetailsSectionProps {
  project: ProjectDetailsViewModel;
}

export function ProjectDetailsSection({ project }: ProjectDetailsSectionProps) {
  const [galleryViewMode, setGalleryViewMode] = useState<"stacked" | "grid">("stacked");

  return (
    <article className="space-y-10">
      <Link
        href="/"
        className="inline-flex items-center text-sm uppercase tracking-[0.2em] text-ui-text-muted transition hover:text-ui-text"
      >
        Voltar para o portfolio
      </Link>

      <header className="space-y-5">
        <h1 className="text-4xl font-semibold leading-tight text-ui-text md:text-6xl">
          {project.title}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-ui-text-muted md:text-xl">
          {project.fullDescription}
        </p>

        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-ui-border px-3 py-1 text-xs uppercase tracking-[0.14em] text-ui-text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ui-text-muted">
          Visualizacao das imagens
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-ui-border p-1">
          <button
            type="button"
            onClick={() => setGalleryViewMode("stacked")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              galleryViewMode === "stacked"
                ? "bg-ui-text text-ui-bg"
                : "text-ui-text-muted hover:text-ui-text"
            }`}
            aria-pressed={galleryViewMode === "stacked"}
          >
            <IconLayoutList size={16} stroke={1.8} aria-hidden />
            Lista
          </button>
          <button
            type="button"
            onClick={() => setGalleryViewMode("grid")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              galleryViewMode === "grid"
                ? "bg-ui-text text-ui-bg"
                : "text-ui-text-muted hover:text-ui-text"
            }`}
            aria-pressed={galleryViewMode === "grid"}
          >
            <IconLayoutGrid size={16} stroke={1.8} aria-hidden />
            Grid
          </button>
        </div>
      </div>

      <div
        className={
          galleryViewMode === "grid"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2"
            : "grid grid-cols-1 gap-6"
        }
      >
        {project.mediaUrls.map((mediaUrl, index) => (
          <figure key={mediaUrl} className="overflow-hidden rounded-2xl border border-ui-border">
            <div className="relative aspect-video bg-ui-surface">
              <Image
                src={mediaUrl}
                alt={`Imagem ${index + 1} do projeto ${project.title}`}
                fill
                quality={100}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </figure>
        ))}
      </div>
    </article>
  );
}
