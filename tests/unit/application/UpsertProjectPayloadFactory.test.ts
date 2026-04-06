import { describe, expect, it } from "@jest/globals";

import { createProjectUpsertPayload } from "@/modules/portfolio/application/use-cases/UpsertProjectPayloadFactory";

describe("createProjectUpsertPayload", () => {
  it("normalizes values and derives slug from title when missing", () => {
    const payload = createProjectUpsertPayload({
      title: "  Projeto Novo  ",
      shortDescription: "  Descricao curta  ",
      fullDescription: "  Descricao completa  ",
      thumbnailUrl: "  https://example.com/thumb.webp  ",
      mediaUrls: [" a ", "", 123],
      tags: [" ui ", "", "design"],
    });

    expect(payload).toEqual({
      slug: "projeto-novo",
      title: "Projeto Novo",
      shortDescription: "Descricao curta",
      fullDescription: "Descricao completa",
      thumbnailUrl: "https://example.com/thumb.webp",
      mediaUrls: ["a", "123"],
      tags: ["ui", "design"],
    });
  });

  it("throws when required fields are missing", () => {
    expect(() =>
      createProjectUpsertPayload({
        title: "",
        shortDescription: "",
        fullDescription: "",
        thumbnailUrl: "",
      }),
    ).toThrow("Missing required project fields.");
  });
});
