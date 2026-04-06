import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockFirebaseRepositoryInstance = { kind: "firebase" };
const mockInMemoryRepositoryInstance = { kind: "memory" };

let createProjectRepository: typeof import("@/modules/portfolio/infrastructure/factories/createProjectRepository").createProjectRepository;
let FirebaseProjectRepository: jest.Mock;
let InMemoryProjectRepository: jest.Mock;

const originalEnv = { ...process.env };

describe("createProjectRepository", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    delete process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

    jest.doMock("@/modules/portfolio/infrastructure/adapters/firebase/FirebaseProjectRepository", () => ({
      FirebaseProjectRepository: jest.fn(() => mockFirebaseRepositoryInstance),
    }));

    jest.doMock("@/modules/portfolio/infrastructure/adapters/in-memory/InMemoryProjectRepository", () => ({
      InMemoryProjectRepository: jest.fn(() => mockInMemoryRepositoryInstance),
    }));

    ({ FirebaseProjectRepository } = require("@/modules/portfolio/infrastructure/adapters/firebase/FirebaseProjectRepository"));
    ({ InMemoryProjectRepository } = require("@/modules/portfolio/infrastructure/adapters/in-memory/InMemoryProjectRepository"));
    ({ createProjectRepository } = require("@/modules/portfolio/infrastructure/factories/createProjectRepository"));

    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("falls back to in-memory repository without Firebase env", () => {
    const repository = createProjectRepository();

    expect(repository).toBe(mockInMemoryRepositoryInstance);
    expect(InMemoryProjectRepository).toHaveBeenCalledTimes(1);
    expect(FirebaseProjectRepository).not.toHaveBeenCalled();
  });

  it("creates the Firebase repository when all env vars are present", () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "api-key";
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "auth-domain";
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "project-id";
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "bucket";
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "sender";
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "app-id";

    const repository = createProjectRepository();

    expect(repository).toBe(mockFirebaseRepositoryInstance);
    expect(FirebaseProjectRepository).toHaveBeenCalledTimes(1);
    expect(InMemoryProjectRepository).not.toHaveBeenCalled();
  });
});
