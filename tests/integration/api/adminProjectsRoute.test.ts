/** @jest-environment node */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const requireAdminSessionMock = jest.fn<() => Promise<{ uid: string } | null>>();
const revalidateTagMock = jest.fn<(tag: string, options: { expire: number }) => void>();

const repositoryMock = {
  findAll: jest.fn<() => Promise<unknown[]>>(),
  create: jest.fn<() => Promise<unknown>>(),
  update: jest.fn<() => Promise<unknown>>(),
  delete: jest.fn<() => Promise<boolean>>(),
  findBySlug: jest.fn<() => Promise<unknown>>(),
};

jest.mock("next/cache", () => ({
  revalidateTag: revalidateTagMock,
}));

jest.mock("@/modules/auth/presentation/server/requireAdminSession", () => ({
  requireAdminSession: requireAdminSessionMock,
}));

jest.mock("@/modules/portfolio/infrastructure/factories/createAdminProjectRepository", () => ({
  createAdminProjectRepository: () => repositoryMock,
}));

describe("api/admin/projects route integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET returns 401 when no admin session", async () => {
    requireAdminSessionMock.mockResolvedValue(null);

    const { GET } = await import("@/app/api/admin/projects/route");
    const response = await GET();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("GET returns projects when admin is authenticated", async () => {
    requireAdminSessionMock.mockResolvedValue({ uid: "admin-1" });
    repositoryMock.findAll.mockResolvedValue([
      {
        id: "p1",
        slug: "projeto-1",
        title: "Projeto 1",
        shortDescription: "Desc",
        fullDescription: "Full",
        thumbnailUrl: "/thumb.webp",
        mediaUrls: [],
        tags: [],
      },
    ]);

    const { GET } = await import("@/app/api/admin/projects/route");
    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      projects: [
        {
          id: "p1",
          slug: "projeto-1",
          title: "Projeto 1",
          shortDescription: "Desc",
          fullDescription: "Full",
          thumbnailUrl: "/thumb.webp",
          mediaUrls: [],
          tags: [],
        },
      ],
    });
  });

  it("POST creates project and revalidates cache tag", async () => {
    requireAdminSessionMock.mockResolvedValue({ uid: "admin-1" });
    repositoryMock.create.mockResolvedValue({
      id: "p2",
      slug: "novo",
      title: "Novo",
      shortDescription: "Desc",
      fullDescription: "Full",
      thumbnailUrl: "https://example.com/thumb.webp",
      mediaUrls: [],
      tags: ["branding"],
    });

    const { POST } = await import("@/app/api/admin/projects/route");

    const response = await POST(
      new Request("http://localhost/api/admin/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Novo",
          shortDescription: "Desc",
          fullDescription: "Full",
          thumbnailUrl: "https://example.com/thumb.webp",
          tags: ["branding"],
          mediaUrls: [],
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect((await response.json()).project.id).toBe("p2");
    expect(revalidateTagMock).toHaveBeenCalledWith("projects", { expire: 0 });
  });

  it("POST returns 400 for invalid payload", async () => {
    requireAdminSessionMock.mockResolvedValue({ uid: "admin-1" });

    const { POST } = await import("@/app/api/admin/projects/route");

    const response = await POST(
      new Request("http://localhost/api/admin/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "" }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid project payload." });
  });
});
