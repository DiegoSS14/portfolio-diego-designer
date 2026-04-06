import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ unoptimized, ...props }: Record<string, unknown> & { unoptimized?: boolean }) => (
    <img {...props} />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={typeof href === "string" ? href : "#"} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

const { ProjectDetailsSection } = require("@/modules/portfolio/presentation/components/ProjectDetailsSection");

describe("ProjectDetailsSection", () => {
  const originalFetch = global.fetch;

  function createMockResponse(body: unknown, status = 200) {
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    } as Response;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : String(input);

      if (url.includes("/api/auth/session")) {
        return createMockResponse({ authenticated: true }, 200);
      }

      if (url.includes("/api/admin/projects/project-1") && init?.method === "DELETE") {
        return createMockResponse({ removed: true }, 200);
      }

      return createMockResponse(null, 404);
    }) as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("shows admin actions and confirms deletion", async () => {
    render(
      <ProjectDetailsSection
        project={{
          id: "project-1",
          title: "Projeto Um",
          fullDescription: "Descricao completa",
          mediaUrls: ["/image-1.webp"],
          tags: ["branding"],
        }}
        isAuthenticatedOverride={true}
      />,
    );

    const editLink = await screen.findByRole("link", { name: /editar/i });
    expect(editLink).toHaveAttribute("href", "/admin/projects?edit=project-1");

    fireEvent.click(screen.getByRole("button", { name: /excluir/i }));
    expect(screen.getByText(/confirmacao de exclusao/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /confirmar exclusao/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/projects/project-1", { method: "DELETE" });
      expect(pushMock).toHaveBeenCalledWith("/");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
