"use client";

import { useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconEdit,
  IconLayoutGrid,
  IconLayoutList,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { ProjectDetailsViewModel } from "../view-models/ProjectCardViewModel";

interface ProjectDetailsSectionProps {
  project: ProjectDetailsViewModel;
  isAuthenticatedOverride?: boolean;
}

interface SessionResponse {
  authenticated: boolean;
}

export function ProjectDetailsSection({ project, isAuthenticatedOverride }: ProjectDetailsSectionProps) {
  const router = useRouter();
  const [galleryViewMode, setGalleryViewMode] = useState<"stacked" | "grid">("stacked");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof isAuthenticatedOverride === "boolean") {
      setIsAuthenticated(isAuthenticatedOverride);
      setIsSessionLoading(false);
      return;
    }

    let isMounted = true;

    void fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        const payload = (await response.json()) as SessionResponse;
        setIsAuthenticated(Boolean(payload.authenticated));
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsSessionLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticatedOverride]);

  async function confirmDeleteProject() {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel excluir o projeto.");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Nao foi possivel excluir o projeto.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <article className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-ui-text-muted transition hover:text-ui-text"
          title="Voltar para o portfolio"
        >
          <IconArrowLeft size={18} stroke={1.8} aria-hidden />
          <span className="sr-only">Voltar para o portfolio</span>
        </Link>

        {!isSessionLoading && isAuthenticated ? (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/admin/projects?edit=${project.id}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-ui-border bg-ui-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-text transition hover:border-ui-text"
            >
              <IconEdit size={14} />
              Editar
            </Link>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-500/60 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-200 transition hover:bg-red-500/20"
            >
              <IconTrash size={14} />
              Excluir
            </button>
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

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
          <figure key={mediaUrl} className="overflow-hidden rounded-2xl border border-ui-border bg-ui-surface">
            <Image
              src={mediaUrl}
              alt={`Imagem ${index + 1} do projeto ${project.title}`}
              width={1600}
              height={1200}
              quality={100}
              unoptimized
              className="h-auto w-full"
              sizes={galleryViewMode === "grid" ? "(min-width: 768px) 50vw, 100vw" : "100vw"}
            />
          </figure>
        ))}
      </div>

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-ui-border bg-ui-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ui-text-muted">
                  Confirmacao de exclusao
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-ui-text">Excluir projeto?</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text"
                aria-label="Fechar modal"
              >
                <IconX size={16} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ui-text-muted">
              Esta acao remove o projeto permanentemente do portfolio. Se continuar, ele sumira da lista publicamente.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="inline-flex items-center gap-2 rounded-2xl border border-ui-border bg-ui-bg px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-text"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void confirmDeleteProject()}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-500/60 bg-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-50"
              >
                <IconDeviceFloppy size={14} />
                {isDeleting ? "Excluindo..." : "Confirmar exclusao"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
