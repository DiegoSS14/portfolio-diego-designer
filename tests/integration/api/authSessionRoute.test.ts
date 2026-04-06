/** @jest-environment node */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const getCurrentAdminSessionUseCaseMock = { execute: jest.fn() };
const startAdminSessionUseCaseMock = { execute: jest.fn() };
const endAdminSessionUseCaseMock = { execute: jest.fn() };

jest.mock("@/modules/auth/infrastructure/factories/createAuthDependencies", () => ({
  createAuthDependencies: () => ({
    getCurrentAdminSessionUseCase: getCurrentAdminSessionUseCaseMock,
    startAdminSessionUseCase: startAdminSessionUseCaseMock,
    endAdminSessionUseCase: endAdminSessionUseCaseMock,
  }),
}));

describe("api/auth/session route integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET returns session when authenticated", async () => {
    getCurrentAdminSessionUseCaseMock.execute.mockResolvedValue({
      uid: "admin-1",
      email: "admin@example.com",
      isAdmin: true,
      expiresAt: "2099-01-01T00:00:00.000Z",
    });

    const { GET } = await import("@/app/api/auth/session/route");
    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      authenticated: true,
      session: {
        uid: "admin-1",
        email: "admin@example.com",
        isAdmin: true,
        expiresAt: "2099-01-01T00:00:00.000Z",
      },
    });
  });

  it("POST returns 400 when idToken is missing", async () => {
    const { POST } = await import("@/app/api/auth/session/route");

    const response = await POST(
      new Request("http://localhost/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "idToken is required" });
  });

  it("POST returns authenticated session when token is valid", async () => {
    startAdminSessionUseCaseMock.execute.mockResolvedValue({
      uid: "admin-1",
      email: "admin@example.com",
      isAdmin: true,
      expiresAt: "2099-01-01T00:00:00.000Z",
    });

    const { POST } = await import("@/app/api/auth/session/route");

    const response = await POST(
      new Request("http://localhost/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken: "valid-token" }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      authenticated: true,
      session: {
        uid: "admin-1",
        email: "admin@example.com",
        isAdmin: true,
        expiresAt: "2099-01-01T00:00:00.000Z",
      },
    });
  });

  it("DELETE ends the session", async () => {
    endAdminSessionUseCaseMock.execute.mockResolvedValue(undefined);

    const { DELETE } = await import("@/app/api/auth/session/route");
    const response = await DELETE();

    expect(endAdminSessionUseCaseMock.execute).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ authenticated: false });
  });
});
