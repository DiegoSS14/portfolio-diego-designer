import { afterEach, describe, expect, it, jest } from "@jest/globals";

import type { Project } from "@/modules/portfolio/domain/entities/Project";
import { InMemoryProjectRepository } from "@/modules/portfolio/infrastructure/adapters/in-memory/InMemoryProjectRepository";

function buildProject(
  project: Partial<Project> &
    Pick<Project, "id" | "slug" | "title" | "shortDescription" | "fullDescription" | "thumbnailUrl">,
): Project {
  return {
    mediaUrls: [],
    tags: [],
    ...project,
  };
}

describe("InMemoryProjectRepository", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns projects ordered by most recent update first", async () => {
    const repository = new InMemoryProjectRepository([
      buildProject({
        id: "older",
        slug: "older",
        title: "Older",
        shortDescription: "older",
        fullDescription: "older",
        thumbnailUrl: "/older.png",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      }),
      buildProject({
        id: "newer",
        slug: "newer",
        title: "Newer",
        shortDescription: "newer",
        fullDescription: "newer",
        thumbnailUrl: "/newer.png",
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-04T00:00:00.000Z",
      }),
    ]);

    const projects = await repository.findAll();

    expect(projects.map((project) => project.id)).toEqual(["newer", "older"]);
  });

  it("creates, updates and deletes projects", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.parse("2026-04-06T10:00:00.000Z"));

    const repository = new InMemoryProjectRepository([]);

    const created = await repository.create({
      slug: "novo-projeto",
      title: "Novo Projeto",
      shortDescription: "Resumo",
      fullDescription: "Descricao",
      thumbnailUrl: "/thumb.png",
      mediaUrls: [],
      tags: ["branding"],
    });

    expect(created.createdAt).toBeDefined();
    expect(created.updatedAt).toBeDefined();

    jest.setSystemTime(Date.parse("2026-04-06T10:00:01.000Z"));

    const updated = await repository.update(created.id, {
      slug: "novo-projeto",
      title: "Novo Projeto Atualizado",
      shortDescription: "Resumo",
      fullDescription: "Descricao",
      thumbnailUrl: "/thumb.png",
      mediaUrls: ["/media.png"],
      tags: ["branding"],
    });

    expect(updated?.createdAt).toBe(created.createdAt);
    expect(updated?.updatedAt).not.toBe(created.updatedAt);

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);
    expect(await repository.findBySlug("novo-projeto")).toBeNull();
  });
});
