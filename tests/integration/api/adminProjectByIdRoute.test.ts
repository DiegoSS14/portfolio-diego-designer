/** @jest-environment node */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const requireAdminSessionMock = jest.fn();
const revalidateTagMock = jest.fn();

const repositoryMock = {
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findBySlug: jest.fn(),
};

jest.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => revalidateTagMock(...args),
}));

jest.mock("@/modules/auth/presentation/server/requireAdminSession", () => ({
  requireAdminSession: (...args: unknown[]) => requireAdminSessionMock(...args),
}));

jest.mock("@/modules/portfolio/infrastructure/factories/createAdminProjectRepository", () => ({
  createAdminProjectRepository: () => repositoryMock,
}));

describe("api/admin/projects/[id] route integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("PATCH updates project when authenticated", async () => {
    requireAdminSessionMock.mockResolvedValue({ uid: "admin-1" });
    repositoryMock.update.mockResolvedValue({
      id: "p1",
      slug: "projeto-1",
      title: "Projeto Atualizado",
      shortDescription: "Desc",
      fullDescription: "Full",
      thumbnailUrl: "https://example.com/thumb.webp",
      mediaUrls: [],
      tags: ["branding"],
    });

    const { PATCH } = await import("@/app/api/admin/projects/[id]/route");

    const response = await PATCH(
      new Request("http://localhost/api/admin/projects/p1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Projeto Atualizado",
          shortDescription: "Desc",
          fullDescription: "Full",
          thumbnailUrl: "https://example.com/thumb.webp",
          tags: ["branding"],
          mediaUrls: [],
        }),
      }),
      { params: Promise.resolve({ id: "p1" }) },
    );

    expect(response.status).toBe(200);
    expect((await response.json()).project.title).toBe("Projeto Atualizado");
    expect(revalidateTagMock).toHaveBeenCalledWith("projects", { expire: 0 });
  });

  it("PATCH returns 404 when project does not exist", async () => {
    requireAdminSessionMock.mockResolvedValue({ uid: "admin-1" });
    repositoryMock.update.mockResolvedValue(null);

    const { PATCH } = await import("@/app/api/admin/projects/[id]/route");

    const response = await PATCH(
      new Request("http://localhost/api/admin/projects/p404", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Projeto",
          shortDescription: "Desc",
          fullDescription: "Full",
          thumbnailUrl: "https://example.com/thumb.webp",
          tags: ["branding"],
          mediaUrls: [],
        }),
      }),
      { params: Promise.resolve({ id: "p404" }) },
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Project not found." });
  });

  it("DELETE removes project and revalidates cache", async () => {
    requireAdminSessionMock.mockResolvedValue({ uid: "admin-1" });
    repositoryMock.delete.mockResolvedValue(true);

    const { DELETE } = await import("@/app/api/admin/projects/[id]/route");

    const response = await DELETE(new Request("http://localhost/api/admin/projects/p1"), {
      params: Promise.resolve({ id: "p1" }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ removed: true });
    expect(revalidateTagMock).toHaveBeenCalledWith("projects", { expire: 0 });
  });

  it("DELETE returns 401 when unauthenticated", async () => {
    requireAdminSessionMock.mockResolvedValue(null);

    const { DELETE } = await import("@/app/api/admin/projects/[id]/route");

    const response = await DELETE(new Request("http://localhost/api/admin/projects/p1"), {
      params: Promise.resolve({ id: "p1" }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });
});
