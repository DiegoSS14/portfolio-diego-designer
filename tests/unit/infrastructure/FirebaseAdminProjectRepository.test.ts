import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockDelete = jest.fn();
const mockFile = jest.fn(() => ({ delete: mockDelete }));
const mockBucket = jest.fn(() => ({ file: mockFile }));
const mockFirestoreDelete = jest.fn();
const mockFirestoreGet = jest.fn();
const mockDoc = jest.fn(() => ({ get: mockFirestoreGet, delete: mockFirestoreDelete }));
const mockCollection = jest.fn(() => ({ doc: mockDoc }));
const mockFirestoreClient = { collection: mockCollection };
const mockStorageClient = { bucket: mockBucket };

let FirebaseAdminProjectRepository: typeof import("@/modules/portfolio/infrastructure/adapters/firebase-admin/FirebaseAdminProjectRepository").FirebaseAdminProjectRepository;

describe("FirebaseAdminProjectRepository", () => {
  beforeEach(() => {
    jest.resetModules();

    jest.doMock("@/modules/shared/infrastructure/adapters/firebase-admin/firebaseAdminClient", () => ({
      getFirebaseAdminFirestoreClient: jest.fn(() => mockFirestoreClient),
      getFirebaseAdminStorageClient: jest.fn(() => mockStorageClient),
    }));

    ({ FirebaseAdminProjectRepository } = require("@/modules/portfolio/infrastructure/adapters/firebase-admin/FirebaseAdminProjectRepository"));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("removes the stored assets before deleting the project document", async () => {
    mockFirestoreGet.mockResolvedValue({
      exists: true,
      data: () => ({
        thumbnailUrl:
          "https://firebasestorage.googleapis.com/v0/b/example-bucket/o/projects%2Fproject-1%2Fthumbnails%2F2026-04-06%2Fthumb-1-cover.webp?alt=media&token=token",
        mediaUrls: [
          "https://firebasestorage.googleapis.com/v0/b/example-bucket/o/projects%2Fproject-1%2Fgallery%2F2026-04-06%2Fimg-0001-cover.webp?alt=media&token=token",
          "https://firebasestorage.googleapis.com/v0/b/example-bucket/o/projects%2Fproject-1%2Fgallery%2F2026-04-06%2Fimg-0002-cover.webp?alt=media&token=token",
        ],
        slug: "project-1",
        title: "Project 1",
        shortDescription: "Short",
        fullDescription: "Full",
        tags: [],
      }),
    });

    const repository = new FirebaseAdminProjectRepository();
    const removed = await repository.delete("project-1");

    expect(removed).toBe(true);
    expect(mockDelete).toHaveBeenCalledTimes(3);
    expect(mockFirestoreDelete).toHaveBeenCalledTimes(1);
    expect(mockFile).toHaveBeenNthCalledWith(1, "projects/project-1/thumbnails/2026-04-06/thumb-1-cover.webp");
    expect(mockFile).toHaveBeenNthCalledWith(2, "projects/project-1/gallery/2026-04-06/img-0001-cover.webp");
    expect(mockFile).toHaveBeenNthCalledWith(3, "projects/project-1/gallery/2026-04-06/img-0002-cover.webp");
  });

  it("skips deletion when the project does not exist", async () => {
    mockFirestoreGet.mockResolvedValue({
      exists: false,
      data: () => undefined,
    });

    const repository = new FirebaseAdminProjectRepository();
    const removed = await repository.delete("missing");

    expect(removed).toBe(false);
    expect(mockDelete).not.toHaveBeenCalled();
    expect(mockFirestoreDelete).not.toHaveBeenCalled();
  });
});