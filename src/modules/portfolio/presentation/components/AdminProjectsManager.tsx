"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconEdit,
  IconHome,
  IconLogout,
  IconPhotoPlus,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";

import type { Project } from "@/modules/portfolio/domain/entities/Project";
import {
  getFirebaseAuthClient,
  getFirebaseStorageClient,
} from "@/modules/portfolio/infrastructure/adapters/firebase/firebaseClient";
import { SelectedUploadFilesList } from "./SelectedUploadFilesList";

interface ProjectsResponse {
  projects: Project[];
}

interface ProjectMutationResponse {
  project: Project;
}

interface ApiErrorResponse {
  error?: string;
}

interface RemovedMediaState {
  url: string;
  index: number;
}

interface PendingProjectDeletionState {
  project: Project;
  index: number;
  timeoutId: number;
}

interface ProjectFormState {
  id: string | null;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string;
  existingThumbnailUrl: string;
  existingMediaUrls: string[];
  thumbnailFile: File | null;
  galleryFiles: File[];
}

const emptyFormState: ProjectFormState = {
  id: null,
  slug: "",
  title: "",
  shortDescription: "",
  fullDescription: "",
  tags: "",
  existingThumbnailUrl: "",
  existingMediaUrls: [],
  thumbnailFile: null,
  galleryFiles: [],
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDateFolder(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
}

export function AdminProjectsManager() {
  const authClient = useMemo(() => getFirebaseAuthClient(), []);
  const storageClient = useMemo(() => getFirebaseStorageClient(), []);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formState, setFormState] = useState<ProjectFormState>(emptyFormState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [removedThumbnailUrl, setRemovedThumbnailUrl] = useState<string | null>(null);
  const [removedMedia, setRemovedMedia] = useState<RemovedMediaState | null>(null);
  const [pendingProjectDeletion, setPendingProjectDeletion] =
    useState<PendingProjectDeletionState | null>(null);

  const readApiError = useCallback(async (response: Response): Promise<string> => {
    try {
      const payload = (await response.json()) as ApiErrorResponse;
      if (payload.error) {
        return payload.error;
      }
    } catch {
      // Ignore parse errors and fallback to generic message.
    }

    return `Request failed with status ${response.status}.`;
  }, []);

  const loadProjects = useCallback(async () => {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });

    if (!response.ok) {
      router.push("/login");
      return;
    }

    const payload = (await response.json()) as ProjectsResponse;
    setProjects(payload.projects);
  }, [router]);

  useEffect(() => {
    void loadProjects()
      .catch(() => {
        setErrorMessage("Nao foi possivel carregar os projetos.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loadProjects]);

  function openCreateForm() {
    setFormState(emptyFormState);
    setRemovedThumbnailUrl(null);
    setRemovedMedia(null);
    setIsFormVisible(true);
  }

  function openEditForm(project: Project) {
    setFormState({
      id: project.id,
      slug: project.slug,
      title: project.title,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      tags: project.tags.join(", "),
      existingThumbnailUrl: project.thumbnailUrl,
      existingMediaUrls: project.mediaUrls,
      thumbnailFile: null,
      galleryFiles: [],
    });
    setRemovedThumbnailUrl(null);
    setRemovedMedia(null);
    setIsFormVisible(true);
  }

  function closeForm() {
    setIsFormVisible(false);
    setRemovedThumbnailUrl(null);
    setRemovedMedia(null);
  }

  async function waitForFirebaseUser(): Promise<boolean> {
    if (authClient.currentUser) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const timeoutId = setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, 3000);

      const unsubscribe = onAuthStateChanged(authClient, (user) => {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(Boolean(user));
      });
    });
  }

  async function uploadFile(file: File, path: string): Promise<string> {
    const isAuthenticated = await waitForFirebaseUser();

    if (!isAuthenticated) {
      throw new Error("Sua autenticacao Firebase ainda nao foi restaurada. Aguarde alguns segundos e tente novamente.");
    }

    const storageRef = ref(storageClient, path);
    await uploadBytes(storageRef, file, { contentType: file.type });

    return getDownloadURL(storageRef);
  }

  async function buildMediaUrls(
    projectScope: string,
    baseThumbnailUrl: string,
    baseMediaUrls: string[],
  ): Promise<{ thumbnailUrl: string; mediaUrls: string[] }> {
    const dateFolder = formatDateFolder();

    const uploadedGalleryUrls = await Promise.all(
      formState.galleryFiles.map((file, index) => {
        const safeName = sanitizeFileName(file.name);
        const uniqueId = crypto.randomUUID();

        return uploadFile(
          file,
          `projects/${projectScope}/gallery/${dateFolder}/img-${String(index + 1).padStart(2, "0")}-${uniqueId}-${safeName}`,
        );
      }),
    );

    let thumbnailUrl = baseThumbnailUrl;

    if (formState.thumbnailFile) {
      const safeThumbnailName = sanitizeFileName(formState.thumbnailFile.name);
      const uniqueId = crypto.randomUUID();
      thumbnailUrl = await uploadFile(
        formState.thumbnailFile,
        `projects/${projectScope}/thumbnails/${dateFolder}/thumb-${uniqueId}-${safeThumbnailName}`,
      );
    }

    return {
      thumbnailUrl,
      mediaUrls: [...baseMediaUrls, ...uploadedGalleryUrls],
    };
  }

  async function saveProject(payload: {
    slug: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    tags: string;
    thumbnailUrl: string;
    mediaUrls: string[];
  }) {
    if (formState.id) {
      const updateResponse = await fetch(`/api/admin/projects/${formState.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!updateResponse.ok) {
        throw new Error(await readApiError(updateResponse));
      }

      return;
    }

    const createResponse = await fetch("/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!createResponse.ok) {
      throw new Error(await readApiError(createResponse));
    }

    const created = (await createResponse.json()) as ProjectMutationResponse;

    const hasUploads = Boolean(formState.thumbnailFile) || formState.galleryFiles.length > 0;

    if (!hasUploads) {
      return;
    }

    const withUploads = await buildMediaUrls(
      created.project.id,
      payload.thumbnailUrl,
      payload.mediaUrls,
    );

    const finalizeResponse = await fetch(`/api/admin/projects/${created.project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        ...withUploads,
      }),
    });

    if (!finalizeResponse.ok) {
      throw new Error(await readApiError(finalizeResponse));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const slug = formState.slug.trim() || slugify(formState.title);

      const hasThumbnailInput = formState.id
        ? Boolean(formState.existingThumbnailUrl) || Boolean(formState.thumbnailFile)
        : Boolean(formState.thumbnailFile);

      if (!hasThumbnailInput) {
        setErrorMessage("Selecione uma thumbnail para o projeto.");
        setIsSaving(false);
        return;
      }

      const basePayload = {
        slug,
        title: formState.title,
        shortDescription: formState.shortDescription,
        fullDescription: formState.fullDescription,
        tags: formState.tags,
        thumbnailUrl: formState.existingThumbnailUrl,
        mediaUrls: formState.existingMediaUrls,
      };

      if (formState.id) {
        const withUploads = await buildMediaUrls(
          formState.id,
          basePayload.thumbnailUrl,
          basePayload.mediaUrls,
        );

        await saveProject({
          ...basePayload,
          ...withUploads,
        });
      } else {
        await saveProject({
          ...basePayload,
          thumbnailUrl: basePayload.thumbnailUrl || "pending-thumbnail",
        });
      }

      await loadProjects();
      setFormState(emptyFormState);
      setRemovedThumbnailUrl(null);
      setRemovedMedia(null);
      setIsFormVisible(false);
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Nao foi possivel salvar o projeto. Verifique os campos e o upload.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const finalizeProjectDeletion = useCallback(async (projectId: string) => {
    const response = await fetch(`/api/admin/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setErrorMessage("Falha ao remover projeto.");
      await loadProjects();
    }
  }, [loadProjects]);

  async function handleDelete(projectId: string) {
    const targetIndex = projects.findIndex((project) => project.id === projectId);
    const targetProject = projects[targetIndex];

    if (!targetProject || targetIndex < 0) {
      return;
    }

    if (pendingProjectDeletion) {
      window.clearTimeout(pendingProjectDeletion.timeoutId);
      await finalizeProjectDeletion(pendingProjectDeletion.project.id);
      setPendingProjectDeletion(null);
    }

    setProjects((prev) => prev.filter((project) => project.id !== projectId));

    const timeoutId = window.setTimeout(() => {
      void finalizeProjectDeletion(targetProject.id);
      setPendingProjectDeletion(null);
    }, 5000);

    setPendingProjectDeletion({
      project: targetProject,
      index: targetIndex,
      timeoutId,
    });
  }

  function handleUndoProjectDeletion() {
    if (!pendingProjectDeletion) {
      return;
    }

    window.clearTimeout(pendingProjectDeletion.timeoutId);

    setProjects((prev) => {
      const nextProjects = [...prev];
      nextProjects.splice(pendingProjectDeletion.index, 0, pendingProjectDeletion.project);
      return nextProjects;
    });

    setPendingProjectDeletion(null);
  }

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(authClient);
    router.push("/");
    router.refresh();
  }

  function handleGoHome() {
    router.push("/");
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-12 md:py-20">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ui-text-muted">Admin</p>
          <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.08em] text-ui-text md:text-4xl">
            Gerenciar Projetos
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 rounded-2xl border border-ui-border bg-ui-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-text"
          >
            <IconHome size={14} />
            Voltar para o inicio
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-2xl border border-ui-accent bg-ui-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-accent-contrast"
          >
            <IconPlus size={14} />
            Novo Projeto
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-ui-border bg-ui-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-text"
          >
            <IconLogout size={14} />
            Sair
          </button>
        </div>
      </header>

      {errorMessage ? (
        <p className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      {pendingProjectDeletion ? (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-ui-border bg-ui-surface/85 px-4 py-3">
          <p className="text-sm text-ui-text">
            Projeto removido da lista. Voce pode desfazer em alguns segundos.
          </p>
          <button
            type="button"
            onClick={handleUndoProjectDeletion}
            className="inline-flex items-center rounded-lg border border-ui-border bg-ui-bg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ui-text"
          >
            Desfazer
          </button>
        </div>
      ) : null}

      {isFormVisible ? (
        <form onSubmit={handleSubmit} className="mb-10 rounded-3xl border border-ui-border bg-ui-surface/80 p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="inline-flex items-center gap-2 rounded-xl border border-ui-border bg-ui-bg px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-text-muted transition hover:text-ui-text"
                aria-label="Voltar para lista de projetos"
              >
                <IconArrowLeft size={14} />
                Voltar
              </button>
              <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-ui-text">
                {formState.id ? "Editar Projeto" : "Novo Projeto"}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ui-border text-ui-text-muted"
              aria-label="Fechar formulario"
            >
              <IconX size={16} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Nome do projeto"
              required
              value={formState.title}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  title: event.target.value,
                  slug: prev.slug || slugify(event.target.value),
                }))
              }
              className="rounded-xl border border-ui-border bg-ui-bg px-4 py-3 text-sm text-ui-text outline-none"
            />
            <input
              placeholder="Slug"
              value={formState.slug}
              onChange={(event) => setFormState((prev) => ({ ...prev, slug: event.target.value }))}
              className="rounded-xl border border-ui-border bg-ui-bg px-4 py-3 text-sm text-ui-text outline-none"
            />
            <input
              placeholder="Descricao curta"
              required
              value={formState.shortDescription}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, shortDescription: event.target.value }))
              }
              className="rounded-xl border border-ui-border bg-ui-bg px-4 py-3 text-sm text-ui-text outline-none md:col-span-2"
            />
            <textarea
              placeholder="Descricao completa"
              required
              rows={5}
              value={formState.fullDescription}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, fullDescription: event.target.value }))
              }
              className="rounded-xl border border-ui-border bg-ui-bg px-4 py-3 text-sm text-ui-text outline-none md:col-span-2"
            />
            <input
              placeholder="Tags separadas por virgula"
              value={formState.tags}
              onChange={(event) => setFormState((prev) => ({ ...prev, tags: event.target.value }))}
              className="rounded-xl border border-ui-border bg-ui-bg px-4 py-3 text-sm text-ui-text outline-none md:col-span-2"
            />

            <div className="rounded-xl border border-ui-border bg-ui-bg/60 p-4 md:col-span-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ui-text-muted">
                Thumbnail
              </p>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ui-border bg-ui-bg px-4 py-3 text-sm text-ui-text-muted">
                <IconPhotoPlus size={16} />
                Upload thumbnail
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      thumbnailFile: event.target.files?.[0] ?? null,
                    }))
                  }
                />
              </label>
              <SelectedUploadFilesList
                files={formState.thumbnailFile ? [formState.thumbnailFile] : []}
                onRemove={() =>
                  setFormState((prev) => ({
                    ...prev,
                    thumbnailFile: null,
                  }))
                }
              />

              {formState.existingThumbnailUrl ? (
                <div className="mt-3 rounded-xl border border-ui-border bg-ui-bg p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ui-text-muted">
                      Thumbnail atual
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!formState.existingThumbnailUrl) {
                          return;
                        }

                        setRemovedThumbnailUrl(formState.existingThumbnailUrl);
                        setFormState((prev) => ({ ...prev, existingThumbnailUrl: "" }));
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text"
                      aria-label="Remover thumbnail atual"
                      title="Remover thumbnail atual"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                  <Image
                    src={formState.existingThumbnailUrl}
                    alt="Thumbnail atual do projeto"
                    width={960}
                    height={540}
                    unoptimized
                    className="h-40 w-full rounded-lg object-cover"
                  />
                </div>
              ) : null}

              {removedThumbnailUrl ? (
                <div className="mt-3 rounded-xl border border-ui-border bg-ui-bg p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm text-ui-text">Thumbnail removida.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormState((prev) => ({ ...prev, existingThumbnailUrl: removedThumbnailUrl }));
                        setRemovedThumbnailUrl(null);
                      }}
                      className="inline-flex items-center rounded-lg border border-ui-border bg-ui-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ui-text"
                    >
                      Desfazer
                    </button>
                  </div>
                  <Image
                    src={removedThumbnailUrl}
                    alt="Thumbnail removida do projeto"
                    width={960}
                    height={540}
                    unoptimized
                    className="h-40 w-full rounded-lg object-cover opacity-70"
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-ui-border bg-ui-bg/60 p-4 md:col-span-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ui-text-muted">
                Imagens da galeria
              </p>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ui-border bg-ui-bg px-4 py-3 text-sm text-ui-text-muted">
                <IconUpload size={16} />
                Upload de imagens da galeria (multiplas de uma vez)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      galleryFiles: event.target.files ? Array.from(event.target.files) : [],
                    }))
                  }
                />
              </label>
              <SelectedUploadFilesList
                files={formState.galleryFiles}
                onRemove={(targetIndex) =>
                  setFormState((prev) => ({
                    ...prev,
                    galleryFiles: prev.galleryFiles.filter((_, index) => index !== targetIndex),
                  }))
                }
              />

              <ul className="mt-3 space-y-2">
                {formState.existingMediaUrls.map((mediaUrl, index) => (
                  <li
                    key={`${mediaUrl}-${index}`}
                    className="rounded-xl border border-ui-border bg-ui-bg p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ui-text-muted">
                        Imagem atual {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setRemovedMedia({ url: mediaUrl, index });
                          setFormState((prev) => ({
                            ...prev,
                            existingMediaUrls: prev.existingMediaUrls.filter(
                              (_, mediaIndex) => mediaIndex !== index,
                            ),
                          }));
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition hover:text-ui-text"
                        aria-label={`Remover imagem atual ${index + 1}`}
                        title="Remover imagem"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                    <Image
                      src={mediaUrl}
                      alt={`Imagem atual ${index + 1} do projeto`}
                      width={960}
                      height={540}
                      unoptimized
                      className="h-36 w-full rounded-lg object-cover"
                    />
                  </li>
                ))}

                {removedMedia ? (
                  <li className="rounded-xl border border-ui-border bg-ui-bg p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm text-ui-text">Imagem removida da galeria.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormState((prev) => {
                            const nextMediaUrls = [...prev.existingMediaUrls];
                            const insertIndex = Math.min(removedMedia.index, nextMediaUrls.length);
                            nextMediaUrls.splice(insertIndex, 0, removedMedia.url);

                            return {
                              ...prev,
                              existingMediaUrls: nextMediaUrls,
                            };
                          });

                          setRemovedMedia(null);
                        }}
                        className="inline-flex items-center rounded-lg border border-ui-border bg-ui-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ui-text"
                      >
                        Desfazer
                      </button>
                    </div>
                    <Image
                      src={removedMedia.url}
                      alt="Imagem removida da galeria"
                      width={960}
                      height={540}
                      unoptimized
                      className="h-36 w-full rounded-lg object-cover opacity-70"
                    />
                  </li>
                ) : null}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-2xl border border-ui-accent bg-ui-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-accent-contrast disabled:opacity-50"
            >
              <IconDeviceFloppy size={14} />
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-ui-text-muted">Carregando...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id} className="rounded-2xl border border-ui-border bg-ui-surface/80 p-4">
              <h3 className="font-display text-xl uppercase tracking-[0.06em] text-ui-text">{project.title}</h3>
              <p className="mt-2 text-sm text-ui-text-muted">{project.shortDescription}</p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(project)}
                  className="inline-flex items-center gap-1 rounded-xl border border-ui-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ui-text"
                >
                  <IconEdit size={14} />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(project.id)}
                  className="inline-flex items-center gap-1 rounded-xl border border-red-500/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-300"
                >
                  <IconTrash size={14} />
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
